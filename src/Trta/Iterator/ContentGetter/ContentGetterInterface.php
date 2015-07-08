<?php
/**
 * Date: 18/07/14
 * Time: 17:08
 */

namespace Trta\Iterator\ContentGetter;


interface ContentGetterInterface
{
	/**
	 * @return string Request body content
	 */
	public function getContent();
} 