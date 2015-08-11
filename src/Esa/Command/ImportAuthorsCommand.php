<?php
/**
 * Date: 05/07/15
 * Time: 13:46
 */

namespace Esa\Command;

use Doctrine\DBAL\Connection;
use Esa\Iterator\SessionExportIterator;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Trta\Iterator\ContentGetter\Stream;


class ImportAuthorsCommand extends Command
{

	/** @var  Connection  */
	private $db;

	/**
	 * @var callable
	 */
	private $urlCreator;
	/**
	 * ImportCommand constructor.
	 *
	 * @param Connection $db
	 */
	public function __construct(Connection $db, callable $urlCreator)
	{
		$this->db = $db;
		$this->urlCreator = $urlCreator;
		parent::__construct();
	}


	protected function configure()
	{
		$this
			->setName('esa:import:authors')
			->setDescription('Import authors.')
			->addArgument(
				'url',
				InputArgument::OPTIONAL,
				'Custom url to import.'
			);
		;
	}

	protected function makeHash($data)
	{
		return sha1(join(',', func_get_args()));
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{

		$url = $input->getArgument('url') ?: call_user_func($this->urlCreator);
		$output->write('Using url: ' . $url);

		$it = new SessionExportIterator(new Stream($url), 'paper');

		$authorsCache = [];

		foreach($it as $data)
		{
			$hash = $this->makeHash($data['sa_firstname'], $data['sa_name']);

			$personId = intval($data['submitting_author_ID']);
			$presentationId = $data['paperID'];

			/*
			if (strpos(strtoupper($data['name']), 'CH') === 0)
			{
				$firstChar = 'Ch';
			}
			*/

			$firstChar = mb_substr($data['sa_name'], 0, 1, 'UTF8');

			$lastName = isset($data['sa_name'])
				? $data['sa_name']
				: trim(explode(',', $data['submitting_author'])[0]);

			$authorData = [
				'person_id' => $personId ?: NULL,
				'author_hash' => $hash,
				'first_char' => $firstChar,
				'first_name' => $data['sa_firstname'] ?: NULL,
				'last_name' =>  $lastName ?: NULL,
				'email' => $data['sa_email'],
				'name' => $data['submitting_author'],
				'organisation' => join(', ', [$data['sa_organisation'], $data['sa_country']]),
			];

			if (!isset($authorsCache[$hash]))
			{


				$authorsCache[$hash] = [
					'authorData' => $authorData,
					'presentationIds' => [$presentationId],
				];

				$output->writeln(sprintf('Parsed: <info>[%s] %s, %s</info>.', $personId, $authorData['last_name'], $authorData['first_name']));

			}
			else
			{
				$authorsCache[$hash]['presentationIds'][] = $presentationId;
			}


			$emails = array_map('trim', explode(',', $data['all_emails']));
			foreach($this->getAuthors($data['authors'], $data['organisations']) as $index => $nameOrganisations)
			{
				$firstChar = mb_substr($nameOrganisations['name'], 0, 1, 'UTF8');

				list($lastName, $firstName) = array_map('trim', (explode(',', $nameOrganisations['name'])));

				$hash = $this->makeHash($firstName, $lastName);

				$authorData = [
					'person_id' => NULL,
					'author_hash' => $hash,
					'first_char' => $firstChar,
					'first_name' => $firstName ?: NULL,
					'last_name' =>  $lastName ?: NULL,
					'email' => empty($emails[$index])
						? sprintf('coauthor-%s@fakemail.com', $hash)
						: $emails[$index],
					'name' => $nameOrganisations['name'],
					'organisation' => $nameOrganisations['organisation'],
				];

				if (!isset($authorsCache[$hash]))
				{


					$authorsCache[$hash] = [
						'authorData' => $authorData,
						'presentationIds' => [$presentationId],
					];

					$output->writeln(sprintf('Parsed: <info>[%s] %s, %s</info>.', $personId, $authorData['last_name'], $authorData['first_name']));

				}
				else
				{
					$authorsCache[$hash]['presentationIds'][] = $presentationId;
				}
			}


		}

		$isIn = 0;
		foreach($authorsCache as $hash => $author)
		{
			if (!$isIn)
			{
				$this->db->beginTransaction();
			}

			$this->db->delete('author', ['author_hash' => $hash]);
			$this->db->insert('author', $author['authorData']);



			$authorId = $this->db->query('SELECT lastval()')->fetchColumn();

			foreach(array_unique($author['presentationIds']) as $presentationId)
			{
				$exists = $this->db->fetchColumn('SELECT COUNT(*) FROM presentation WHERE id = ?', [$presentationId]);
				if ($exists)
				{
					$this->db->insert('presentation_to_author', [
						'author_id' => $authorId,
						'presentation_id' => $presentationId,
					]);
				}
			}

			if ($isIn > 100)
			{
				$this->db->commit();
				$isIn = 0;
				$output->writeln('Commit!');
			}
			else
			{
				$isIn++;
			}
		}

		if ($isIn)
		{
			$this->db->commit();
		}
	}


	private function addData($authorData, $presentationIds)
	{

	}

	private function getAuthors($n ,$o)
	{
		$authors = [];

		$nameParts = array_map('trim', explode(';', $n));
		$organisationParts = array_map('trim', explode(';', $o));


		$organisations = [];
		foreach($organisationParts as $part)
		{
			if (preg_match('/^\s*(\d+)\:\s*(.*)\s*$/', $part, $matches))
			{
				$organisations[$matches[1]] = $matches[2];
			}
			else
			{
				$organisations[] = $part;
			}
		}

		foreach($nameParts as $part)
		{
			if (preg_match('/^\s*(.*)\s*\((.*)\)$/', $part, $matches))
			{
				$indexes = array_map('trim', explode(',', $matches[2]));
				$authorOrganisations = [];
				foreach($indexes as $index)
				{
					$authorOrganisations[] = isset($organisations[$index])
						? $organisations[$index]
						: $organisations[0];
				}
				$authors[] = [
					'name' => $matches[1],
					'organisation' => join('; ', $authorOrganisations),
				];
			}
			else
			{
				$authors[] = [
					'name' => $part,
					'organisation' => $organisations[0],
				];
			}
		}
		return $authors;
	}
}