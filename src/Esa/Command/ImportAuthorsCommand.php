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
		return sha1($data['submitting_author_ID']);
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{

		$url = $input->getArgument('url') ?: call_user_func($this->urlCreator);
		$output->write('Using url: ' . $url);

		$it = new SessionExportIterator(new Stream($url), 'paper');

		$authorsCache = [];

		foreach($it as $data)
		{
			$hash = $this->makeHash($data);

			$personId = intval($data['submitting_author_ID']);
			$presentationId = $data['paperID'];

			/*
			if (strpos(strtoupper($data['name']), 'CH') === 0)
			{
				$firstChar = 'Ch';
			}
			*/

			if (!isset($authorsCache[$hash]))
			{
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

			foreach($author['presentationIds'] as $presentationId)
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
	}
}