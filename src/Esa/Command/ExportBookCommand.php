<?php
/**
 * Date: 05/07/15
 * Time: 13:46
 */

namespace Esa\Command;

use Esa\Export\Book;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;


class ExportBookCommand extends Command
{


	/** @var  Book */
	private $bookExport;

	/**
	 * ExportBookCommand constructor.
	 *
	 * @param Book $bookExport
	 */
	public function __construct(Book $bookExport)
	{
		$this->bookExport = $bookExport;
		parent::__construct();
	}


	protected function configure()
	{
		$this
			->setName('esa:export:book')
			->setDescription('Export book document.')
			->addArgument(
				'path',
				InputArgument::REQUIRED,
				'Document path.'
			);
		;
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$path = $input->getArgument('path');
		$this->bookExport->export($path);
	}
}