<?php
/**
 * Date: 18/07/14
 * Time: 17:08
 */

namespace Trta\Iterator\ContentGetter;


class GunzipWrapper implements ContentGetterInterface
{

	/**
	 * @var ContentGetterInterface
	 */
	protected $wrappedGetter;

	function __construct(ContentGetterInterface $wrappedGetter)
	{
		$this->wrappedGetter = $wrappedGetter;
	}


	/**
	 * @return string Request body content
	 */
	public function getContent()
	{
		$content = $this->wrappedGetter->getContent();
		$tempFile = tempnam(sys_get_temp_dir(), __CLASS__);
		file_put_contents($tempFile, $content);

		$zip = new \ZipArchive();
		if ($zip->open($tempFile) !== TRUE)
		{
			throw new  \RuntimeException('ZipArchive::open failed.');
		}

		$content = $zip->getFromIndex(0);

		$zip->close();
		unlink($tempFile);

		return $content;
	}
} 