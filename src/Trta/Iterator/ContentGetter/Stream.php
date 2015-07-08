<?php
/**
 * Date: 18/07/14
 * Time: 17:08
 */

namespace Trta\Iterator\ContentGetter;


class Stream implements ContentGetterInterface
{


	protected $url;

	protected $context;

	function __construct($url, $context = NULL)
	{
		$this->url = $url;
		$this->context = $context;
	}


	/**
	 * @return string Request body content
	 */
	public function getContent()
	{
		if (($content = file_get_contents($this->url, NULL, $this->context)) === FALSE)
		{
			throw new \RuntimeException(sprintf('Can not get contents of "%s".', $this->url));
		}
		return $content;
	}
} 