#!/usr/bin/env php
<?php

$app = require __DIR__ . '/bootstrap.php';

use Symfony\Component\Console\Application;

$application = new Application();
$application->add(new \Esa\Command\ImportCommand($app['db'], $app['conftool.createUrl']));
$application->run();