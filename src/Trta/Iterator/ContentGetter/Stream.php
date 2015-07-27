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

	function __construct($url)
	{
		$this->url = $url;
	}



	/**
	 * @return string Request body content
	 */
	public function getContent()
	{
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL, $this->url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2400);
		curl_setopt($ch, CURLOPT_TIMEOUT, 2400);
		$data = curl_exec($ch);

		if(curl_errno($ch))
		{
			throw new \RuntimeException(curl_error($ch), curl_errno($ch));
		}
		return $data;
	}
} 