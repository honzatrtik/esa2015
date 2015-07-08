<?php

namespace Esa\Iterator;
/**
 * Date: 05/07/15
 * Time: 12:40
 */
class SessionExportIterator extends \Trta\Iterator\XmlLoadIterator
{
	protected function load()
	{
		$r = $this->getReader();

		$entities = array();
		while(empty($entities))
		{
			$this->read($r, 'session');

			$outerXml = $r->readOuterXml();
			try
			{
				$xml = new \SimpleXMLElement($outerXml);
			}
			catch(\Exception $e)
			{
				user_error(sprintf('Can not create SimpleXMLElement "%s": %s', $e->getMessage(), $outerXml));
				continue;
			}

			$session = [];
			foreach($xml->children() as $child)
			{
				$name = $child->getName();
				$session[$name] = (string) $child;
			}
			$entities[] = $session;

		}

		return $entities;
	}

}