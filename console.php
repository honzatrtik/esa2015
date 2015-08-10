#!/usr/bin/env php
<?php

$app = require __DIR__ . '/bootstrap.php';

use Symfony\Component\Console\Application;

$application = new Application();
$application->add(new \Esa\Command\ImportCommand($app['db'], $app['conftool.createUrl']));
$application->add(new \Esa\Command\ImportChairAuthorsCommand($app['db']));
$application->add(new \Esa\Command\ImportAuthorsCommand($app['db'], function() use ($app) {
	return $app['conftool.createUrl']('papers', [
		'form_export_papers_options' => [
			'authors_extended',
			'submitter'
		]
	]);
}));
$application->add(new \Esa\Command\ExportBookCommand(
	new \Esa\Export\Book($app['db'])
));

$application->run();