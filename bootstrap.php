<?php

require __DIR__.'/vendor/autoload.php';

$app = new \Silex\Application();



$app['conftool.passPhrase'] = 'cG9v3N38';
$app['conftool.baseUrl'] = 'https://www.conftool.pro/esa2015/rest.php';
$app['conftool.createUrl'] = $app->protect(function($export = 'sessions') use ($app) {
	$nonce = time();
	$pass = $app['conftool.passPhrase'];
	$query = [
		'nonce' => $nonce,
		'passhash' => hash('sha256', $nonce . $pass),
		'page' => 'adminExport',
		'export_select' => $export,	// Allowed values: papers, invitations, authors, subsumed_authors, topics, reviews, reviewers, sessions, participants, nametags, identities, event_participants, payments, identities
		'form_export_format' => 'xml',	//allowed: xml_short, csv_comma, csv_semicolon, and xls
		'cmd_create_export' => true,
		'form_export_sessions_options' => ['presentations', 'presentations_abstracts', 'all'],
		'form_status' => 1
	];
	return $app['conftool.baseUrl'] . '?' . http_build_query($query);
});


$app['db.url'] = getenv('DATABASE_URL');
if (empty($app['db.url'])) {
	throw new RuntimeException('Set DATABASE_URL environment variable.');
}

$app['db'] = $app->factory(function() use ($app) {
	return \Doctrine\DBAL\DriverManager::getConnection([
		'url' => $app['db.url'],
	]);
});



return $app;