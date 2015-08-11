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


class ImportChairAuthorsCommand extends Command
{

	/** @var  Connection  */
	private $db;

	/**
	 * ImportCommand constructor.
	 *
	 * @param Connection $db
	 */
	public function __construct(Connection $db)
	{
		$this->db = $db;
		parent::__construct();
	}


	protected function configure()
	{
		$this
			->setName('esa:import:chairauthors')
			->setDescription('Import chair to authors.');
	}

	protected function createAuthorData($name, $organisation)
	{
		list($lastName, $firstName) = array_map('trim', explode(',', $name));
		$firstChar = mb_substr($lastName, 0, 1, 'UTF8');
		$hash = sha1(join(',', [$name, $organisation]));
		return [
			'person_id' => NULL,
			'author_hash' => $hash,
			'first_char' => $firstChar,
			'first_name' => $firstName ?: NULL,
			'last_name' =>  $lastName ?: NULL,
			'email' => sprintf('%s@fakemail.com', $hash),
			'name' => $name,
			'organisation' => $organisation
		];
	}


	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$sessions = $this->db->fetchAll('
			SELECT s.*, (SELECT p.id FROM v_presentation AS p WHERE p.session_id = s.id LIMIT 1) AS presentation_id FROM v_session s
		');

		$authorsCache = [];

		$this->db->beginTransaction();
		foreach($sessions as $data)
		{
			$presentationId = $data['presentation_id'];
			if ($data['chair1'])
			{
				$authorData = $this->createAuthorData($data['chair1'], $data['chair1_organisation']);
				$hash = $authorData['author_hash'];

				$emails = array_filter([$data['chair1_email'], $data['chair1_email2']]);
				if ($emails)
				{
					$authorId = $this->db->fetchColumn('
						SELECT id FROM v_author WHERE email IN (?)
					', [$emails], 0, [\Doctrine\DBAL\Connection::PARAM_STR_ARRAY]);
					if ($authorId)
					{
						$exists = $this->db->fetchColumn('SELECT COUNT(*) FROM presentation WHERE id = ?', [$presentationId]);
						if ($exists)
						{
							$this->db->insert('presentation_to_author', [
								'author_id'       => $authorId,
								'presentation_id' => $presentationId,
							]);
						}
						continue;
					}
				}


				if (!isset($authorsCache[$hash]))
				{
					$authorsCache[$hash] = [
						'authorData'      => $authorData,
						'presentationIds' => [$presentationId],
					];
					$output->writeln(sprintf('Parsed: <info>Session [%s] chair #1 %s, %s</info>.', $data['id'], $authorData['last_name'], $authorData['first_name']));
				}
				else
				{
					$authorsCache[$hash]['presentationIds'][] = $presentationId;
				}
			}
		}

		foreach($sessions as $data)
		{

			if ($data['chair2'])
			{
				$authorData = $this->createAuthorData($data['chair2'], $data['chair2_organisation']);
				$hash = $authorData['author_hash'];

				$emails = array_filter([$data['chair2_email'], $data['chair2_email2']]);
				if ($emails)
				{
					$authorId = $this->db->fetchColumn('
						SELECT id FROM v_author WHERE email IN (?)
					', [$emails], 0, [\Doctrine\DBAL\Connection::PARAM_STR_ARRAY]);
					if ($authorId)
					{
						$exists = $this->db->fetchColumn('SELECT COUNT(*) FROM presentation WHERE id = ?', [$presentationId]);
						if ($exists)
						{
							$this->db->insert('presentation_to_author', [
								'author_id'       => $authorId,
								'presentation_id' => $presentationId,
							]);
						}
						continue;
					}
				}


				if (!isset($authorsCache[$hash]))
				{
					$authorsCache[$hash] = [
						'authorData'      => $authorData,
						'presentationIds' => [$presentationId],
					];
					$output->writeln(sprintf('Parsed: <info>Session [%s] chair #1 %s, %s</info>.', $data['id'], $authorData['last_name'], $authorData['first_name']));
				}
				else
				{
					$authorsCache[$hash]['presentationIds'][] = $presentationId;
				}
			}
		}
		$this->db->commit();

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

			if ($isIn > 1000)
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
}