<?php
/**
 * Date: 26/07/15
 * Time: 16:39
 */

namespace Esa\Export;


use Doctrine\DBAL\Connection;
use PhpOffice\PhpWord\PhpWord;


class Book
{
	/** @var  Connection  */
	private $db;

	private static $typeNames = [
		'RN01' => 'Ageing in Europe',
		'RN02' => 'Sociology of the Arts',
		'RN03' => 'Biographical Perspectives on European Societies',
		'RN04' => 'Sociology of Children and Childhood',
		'RN05' => 'Sociology of Consumption',
		'RN06' => 'Critical Political Economy',
		'RN07' => 'Sociology of Culture',
		'RN08' => 'Disaster, Conflict and Social Crisis',
		'RN09' => 'Economic Sociology',
		'RN10' => 'Sociology of Education',
		'RN11' => 'Sociology of emotions',
		'RN12' => 'Environment and Society',
		'RN13' => 'Sociology of Families and Intimate Lives',
		'RN14' => 'Gender Relations in the Labour Market and the Welfare State',
		'RN15' => 'Global, Transnational and Cosmopolitan Sociology',
		'RN16' => 'Sociology of Health and Illness',
		'RN17' => 'Work, Employment and Industrial Relations',
		'RN18' => 'Sociology of Communications and Media Research',
		'RN19' => 'Sociology of Professions',
		'RN20' => 'Qualitative Methods',
		'RN21' => 'Quantitative Methods',
		'RN22' => 'Sociology of Risk and Uncertainty',
		'RN23' => 'Sexuality',
		'RN24' => 'Science and Technology',
		'RN25' => 'Social Movements',
		'RN26' => 'Sociology of Social Policy',
		'RN27' => 'Regional Network on Southern European Societies',
		'RN28' => 'Society and Sports',
		'RN29' => 'Social Theory',
		'RN30' => 'Youth and Generation',
		'RN31' => 'Ethnic Relations, Racism and Antisemitism',
		'RN32' => 'Political Sociology',
		'RN33' => 'Women’s and Gender Studies',
		'RN34' => 'Sociology of Religion',
		'RN35' => 'Sociology of Migration',
		'RN36' => 'Sociology of Transformations => East and West',
		'RN37' => 'Urban Sociology',
		'RS1' => ' Arts Management',
		'RS2' => 'Design in Use',
		'RS3' => 'Europeanization from Below?',
		'RS4' => 'Sociology of Celebration',
		'RS5' => 'Sociology of Knowledge',
		'RS6' => 'Sociology of Morality',
		'RS7' => 'Maritime Sociology',
		'SPS' => 'Semi-Plenary Sessions',
		'MD' => 'Mid-day Specials',
		'SE' => 'Special Events',
		'OC' => 'Opening Ceremony',
		'OS' => 'Other Sessions',
		'CP' => 'Closing Plenary',
		'MA' => 'Meetings & Assemblies',
		'EL' => 'ESA Lectures'
	];

	/**
	 * Book constructor.
	 *
	 * @param Connection $db
	 */
	public function __construct(Connection $db)
	{
		$this->db = $db;
	}


	public function export($path)
	{
		$phpWord = new PhpWord();
		$phpWord->setDefaultFontName('Times New Roman');
		$phpWord->setDefaultFontSize(12);


		$phpWord->addTitleStyle(1, [
			'size' => 26,
			'bold' => true
		], [

		]);

		$phpWord->addTitleStyle(2, [
			'size' => 22,
			'bold' => true
		], [

		]);

		$phpWord->addTitleStyle(3, [
			'size' => 18,
			'bold' => true
		], [

		]);

		$phpWord->addTitleStyle(4, [
			'size' => 16,
			'bold' => true
		], [

		]);

		$phpWord->addFontStyle('f_timeAndPlace', [
			'size' => 16,
			'bold' => false,
		]);

		$phpWord->addFontStyle('f_bold', [
			'bold' => true,
		]);

		$phpWord->addFontStyle('f_italic', [
			'italic' => true,
		]);

		$phpWord->addFontStyle('f_label', [
		]);

		$phpWord->addFontStyle('f_chairName', [
		]);
		$phpWord->addFontStyle('f_chairOrganisation', [
		]);

		$phpWord->addFontStyle('f_presentationAuthor', [
			'bold' => true,
		]);

		$phpWord->addFontStyle('f_presentationOrganisation', [
		]);

		$phpWord->addFontStyle('f_presentationName', [
			'italic' => true,
		]);


		$phpWord->addFontStyle('f_contributionPaperLabel', [
		]);
		$phpWord->addParagraphStyle('p_contributionPaperLabel', [
			'lineHeight' => 1
		]);

		$phpWord->addParagraphStyle('p_presentation', [
			'lineHeight' => 1
		]);

		$phpWord->addParagraphStyle('p_presentationContributionPaper', [
			'lineHeight' => 1,
			'basedOn' => 'presentation'
		]);

		$phpWord->addParagraphStyle('p_chairs', [
		]);

		$phpWord->addParagraphStyle('p_timeAndPlace', [
		]);


		$section = $phpWord->addSection();
		$section->addTitle($this->text('Research Network / Research Stream Sessions'));

		foreach($this->getTypes() as $type)
		{
			if (!$this->isExportType($type))
			{
				continue;
			}

			$section->addTitle($this->text(sprintf('%s - %s', $type, static::$typeNames[$type])), 2);

			foreach($this->getSessions($type) as $session)
			{

				$start = new \DateTime($session['start']);
				$end = new \DateTime($session['end']);

				$timeAndPlace = sprintf(
					'%s - %s / %s / %s',
					$start->format('H:i'),
					$end->format('H:i'),
					$start->format('jS l'),
					$session['room']
				);

				$section->addText($timeAndPlace, 'f_timeAndPlace', 'p_timeAndPlace');
				$section->addTitle($this->text(sprintf('%s / %s', $session['short'], $session['title'])), 3);

				$chairs = $this->getChairs($session);
				if ($chairs)
				{
					$textRun = $section->addTextRun('p_chairs');
					$text = count($chairs) == 1
						? 'Chair: '
						: 'Chairs: ';

					$textRun->addText($this->text($text), 'f_label', null);

					foreach($chairs as $chair)
					{
						$textRun->addText(
							$this->text(sprintf('%s ', $chair['name'])),
							'f_chairName',
							null
						);
						$textRun->addText(
							$this->text(sprintf('(%s)', $chair['organisation'])),
							'f_chairOrganisation',
							null
						);
					}
				}


				$presentations = $this->getPresentations($session['id']);

				$contributingPapers = array_filter($presentations, function($p) {
					return $p['acceptance'] === 'Contributing Paper';
				});

				$otherPresentations = array_filter($presentations, function($p) {
					return $p['acceptance'] !== 'Contributing Paper';
				});

				foreach($otherPresentations as $presentation)
				{
					$textRun = $section->addTextRun('p_presentation');

					foreach($this->getAuthors($presentation) as $author)
					{
						$textRun->addText($this->text(sprintf('%s ',$author['name'])), 'f_presentationAuthor');
						$textRun->addText($this->text(sprintf('(%s)', $author['organisation'])), 'f_presentationOrganisation');
						$textRun->addText(', ');
					}
					$textRun->addText($this->text($presentation['title']), 'f_presentationName');
				}

				if ($contributingPapers)
				{
					$section->addText('Contributed papers', 'f_contributionPaperLabel', 'p_contributionPaperLabel');
					foreach($contributingPapers as $presentation)
					{
						$textRun = $section->addTextRun('p_presentationContributionPaper');

						foreach($this->getAuthors($presentation) as $author)
						{
							$textRun->addText($this->text(sprintf('%s ',$author['name'])), 'f_presentationAuthor');
							$textRun->addText($this->text(sprintf('(%s)', $author['organisation'])), 'f_presentationOrganisation');
							$textRun->addText(', ');
						}
						$textRun->addText($this->text($presentation['title']), 'f_presentationName');


					}
				}

			}
			$section->addPageBreak();
		}

		$phpWord->save($path);
	}

	private function getAuthors($presentation)
	{
		$authors = [];

		$nameParts = array_map('trim', explode(';', $presentation['authors']));
		$organisationParts = array_map('trim', explode(';', $presentation['organisations']));


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
					$authorOrganisations[] = $organisations[$index];
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

	private function isExportType($type)
	{
		return preg_match('/^(rn|rs)/iu', $type);
	}

	private function getChairs($session)
	{
		$chairs = [];
		if (!empty($session['chair1']))
		{
			array_push($chairs, [
				'name' => $session['chair1'],
				'organisation' => $session['chair1_organisation']
			]);
		}
		if (!empty($session['chair2']))
		{
			array_push($chairs, [
				'name' => $session['chair2'],
				'organisation' => $session['chair2_organisation']
			]);
		}
		return $chairs;
	}

	private function getTypeName($type)
	{
		if (!isset(static::$typeNames[$type]))
		{
			throw new \OutOfBoundsException('Type not found: ' . $type);
		}
		return static::$typeNames[$type];
	}


	private function getTypes()
	{
		$types = $this->db->executeQuery('
			SELECT DISTINCT d1.indexed AS "type" FROM presentation_data AS d1
        	WHERE d1.key = ?
		', ['contribution_type'])->fetchAll();

		return array_map(function($row) {
			return $row['type'];
		}, $types);
	}

	private function getSessions($type)
	{
		return $this->db->executeQuery('
			SELECT DISTINCT s.*
			FROM v_presentation AS p
			JOIN v_session AS s ON (p.session_id = s.id)
			WHERE p.type = ?
			ORDER BY start, short
		', [$type])->fetchAll();
	}

	private function getPresentations($sessionId)
	{
		return $this->db->executeQuery('
			SELECT p.*
			FROM v_presentation AS p
			WHERE p.session_id = ?
			ORDER BY "position"
		', [$sessionId])->fetchAll();
	}

	private function text($text)
	{
		return htmlspecialchars($text);
	}




}