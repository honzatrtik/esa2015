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
		return sha1(join(',', [intval($data['personID']), $data['email']]));
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{

		$url = $input->getArgument('url') ?: call_user_func($this->urlCreator);
		$output->write('Using url: ' . $url);

		$it = new SessionExportIterator(new Stream($url), 'subsumed_author');

		foreach($it as $data)
		{
			$hash = $this->makeHash($data);

			$personId = intval($data['personID']);
			$presentationIds = array_filter(array_map('trim', explode(',', $data['paperIDs'])));

			$this->db->beginTransaction();

			/*
			if (strpos(strtoupper($data['name']), 'CH') === 0)
			{
				$firstChar = 'Ch';
			}
			*/

			$firstChar = mb_substr($data['name'], 0, 1, 'UTF8');

			$lastName = isset($data['lastname'])
				? $data['lastname']
				: trim(explode(',', $data['name'])[0]);

			$this->db->delete('author', ['author_hash' => $hash]);
			$this->db->insert('author', [
				'person_id' => $personId ?: NULL,
				'author_hash' => $hash,
				'first_char' => $firstChar,
				'first_name' => $data['firstname'] ?: NULL,
				'last_name' =>  $lastName ?: NULL,
				'email' => $data['email'],
				'name' => $data['name'],
				'organisation' => $data['organisation'],
			]);

			$authorId = $this->db->query('SELECT lastval()')->fetchColumn();

			foreach($presentationIds as $presentationId)
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


			$this->db->commit();
		}
	}
}