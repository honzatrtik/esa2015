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


class ImportCommand extends Command
{

	static protected $indexedSessionKeys = [
		'session_short',
		'session_title',
		'session_start',
		'session_end',
		'session_room_ID',
	];

	static protected $indexedPresentationKeys = [
		'paper_ID',
		'contribution_type',
		'authors'
	];

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
			->setName('esa:import')
			->setDescription('Import data.')
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

		$it = new SessionExportIterator(new Stream($url));
		$qb = $this->db->createQueryBuilder();

		foreach($it as $data)
		{
			$this->db->beginTransaction();
			$sessionId = $data['session_ID'];

			$this->db->executeQuery('
				INSERT INTO session (id)
				SELECT ?
				WHERE
					NOT EXISTS (
						SELECT id FROM session WHERE id = ?
					)
				', [$sessionId, $sessionId]);

			$this->db->delete('session_data', ['session_id' => $sessionId]);
			$presentations = [];
			foreach($data as $key => $val)
			{
				if (empty($val)) continue;
				if (preg_match('/^p(\d+)\_(.*)$/', $key, $matches))
				{
					list(, $presentationId, $presentationKey) = $matches;
					$presentations[$presentationId][$presentationKey] = $val;
				}
				else
				{
					$column = in_array($key, self::$indexedSessionKeys)
						? 'indexed'
						: 'val';

					$data = [
						'session_id' => $sessionId,
						'key' => $key,
						$column => $val
					];

					$this->db->insert('session_data', $data);
				}
			}

			foreach(array_column($presentations, 'paperID') as $presentationId)
			{
				$presentationSessionId = $this->db->fetchColumn('SELECT session_id FROM presentation WHERE id = ?', [$presentationId]);
				if ($presentationSessionId)
				{
					if ($presentationSessionId != $sessionId)
					{
						$this->db->update('presentation', ['session_id' => $sessionId], ['id' => $presentationId]);
					}
				}
				else
				{
					$this->db->insert('presentation', ['id' => $presentationId, 'session_id' => $sessionId]);
				}
			}

			foreach($presentations as $presentationData)
			{
				$presentationId = $presentationData['paperID'];
				$this->db->delete('presentation_data', ['presentation_id' => $presentationId]);

				foreach($presentationData as $key => $val)
				{
					if (empty($val)) continue;
					$column = in_array($key, self::$indexedPresentationKeys)
						? 'indexed'
						: 'val';

					$data = [
						'presentation_id' => $presentationId,
						'key' => $key,
						$column => $val
					];

					$this->db->insert('presentation_data', $data);
				}
			}
			$this->db->commit();
		}
	}
}