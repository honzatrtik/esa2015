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

	protected function execute(InputInterface $input, OutputInterface $output)
	{

		$url = $input->getArgument('url') ?: call_user_func($this->urlCreator);
		$output->write('Using url: ' . $url);

		$it = new SessionExportIterator(new Stream($url), 'subsumed_author');

		foreach($it as $data)
		{
			$authorId = $data['personID'];
			$presentationIds = array_filter(array_map('trim', explode(',', $data['paperIDs'])));

			$this->db->beginTransaction();

			$this->db->delete('author', ['id' => $authorId]);
			$this->db->insert('author', [
				'id' => $authorId,
				'email' => $data['email'],
				'name' => $data['name'],
				'organisation' => $data['organisation'],
			]);

			foreach($presentationIds as $presentationId)
			{
				$exists = $this->db->fetchColumn('SELECT COUNT(*) FROM presentation WHERE id = ?', [$presentationId]);
				if ($exists)
				{
					$this->db->delete('presentation_to_author', [
						'author_id' => $authorId,
						'presentation_id' => $presentationId,
					]);

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