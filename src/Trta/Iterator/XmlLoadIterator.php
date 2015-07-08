<?php
/**
 * Date: 9/26/13
 * Time: 6:25 PM
 */

namespace Trta\Iterator;


use Trta\Iterator\ContentGetter\ContentGetterInterface;

abstract class XmlLoadIterator implements \Iterator
{
	/**
	 * @var \XMLReader;
	 */
	protected $reader;

	/**
	 * @var ContentGetterInterface
	 */
	protected $contentGetter;

	/**
	 * @var array
	 */
	protected $loaded = array();

	/**
	 * @var array
	 */
	protected $current;

	/**
	 * @var int
	 */
	protected $key = -1;

	/**
	 * @var bool
	 */
	protected $initialized = FALSE;

	function __construct(ContentGetterInterface $contentGetter)
	{
		$this->contentGetter = $contentGetter;
	}

	protected function getReader($reload = FALSE)
	{
		if ($this->reader === NULL || $reload)
		{
			$this->initialized = FALSE;
			$this->key = -1;
			$this->reader = new \XMLReader();
			if (!$this->reader->XML($this->contentGetter->getContent()))
			{
				throw new \RuntimeException(sprintf('Can not parse string.'));
			}
		}
		return $this->reader;
	}

	/**
	 * Cte xml k dalsimu elementu s nazvem $name
	 * @param \XMLReader $r
	 * @param string|array $name
	 * @throws \RuntimeException
	 */
	protected function read(\XMLReader $r, $name)
	{
		$names = is_array($name)
			? $name
			: array($name);

		do
		{
			$read = $r->read();
			$nt = $r->nodeType;
			$nn = $r->name;

		}
		while($read && !(in_array($nn, $names) && ($nt === \XMLReader::ELEMENT)));

		if (!$read)
		{
			throw new \RuntimeException(sprintf('Can not read any of elements "%s".', implode(',', $names)));
		}
	}

	/**
	 * @return array
	 */
	abstract protected function load();


	protected function initialize()
	{
		if (!$this->initialized)
		{
			$this->initialized = TRUE;
			$this->next();
		}
	}


	public function current()
	{
		$this->initialize();
		return $this->current;
	}


	public function next()
	{
		$this->initialize();

		// Pokud nemame dalsi prvky, zkusime nacist
		if (!count($this->loaded))
		{
			try
			{
				$this->loaded = $this->load();
			}
			catch(\RuntimeException $e)
			{
				// Nothing to do
			}
		}

		// Vyzvedneme dalsi prvek
		if ($this->current = array_pop($this->loaded))
		{
			$this->key++;
		}
		else
		{
			// Dalsi prvek neexistuje
			$this->key = NULL;
		}

	}


	public function key()
	{
		$this->initialize();
		return $this->key;
	}


	public function valid()
	{
		$this->initialize();
		return (bool) $this->current;
	}


	public function rewind()
	{
		// Reload dokumentu
		$this->getReader(TRUE);
	}

	public function __destruct()
	{
		if ($this->reader)
		{
			$this->reader->close();
		}
	}


} 