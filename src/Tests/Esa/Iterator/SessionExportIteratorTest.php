<?php

namespace Tests\Esa\Iterator;
use Esa\Iterator\SessionExportIterator;

/**
 * Date: 05/07/15
 * Time: 13:05
 */
class SessionExportIteratorTest  extends \PHPUnit_Framework_TestCase
{
	protected function getContentGetterMock($file)
	{

		$data = file_get_contents($file);
		$mock = $this->getMockBuilder('Trta\Iterator\ContentGetter\ContentGetterInterface')
			->setMethods(array('getContent'))
			->getMock();

		$mock->expects($this->any())
			->method('getContent')
			->will($this->returnValue($data));

		return $mock;
	}

	public function testIterator()
	{

		$it = new SessionExportIterator($this->getContentGetterMock(__DIR__ . '/sessions.xml'));
		$array = $it->current();

		$this->assertInternalType('array', $array);
		$this->assertArrayHasKey('session_ID', $array);
		$this->assertArrayHasKey('session_start', $array);
		$this->assertArrayHasKey('session_end', $array);

	}
}
