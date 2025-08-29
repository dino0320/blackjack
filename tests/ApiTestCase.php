<?php

namespace Tests;

use App\Consts\DatabaseConst;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase {
        migrateFreshUsing as traitMigrateFreshUsing;
    }

    protected function migrateFreshUsing()
    {
        return array_merge([
            '--realpath' => true,
            '--path' => database_path(DatabaseConst::MIGRATIONS_BASEPATH . '/' . DatabaseConst::PURPOSE_USER),
            ], $this->traitMigrateFreshUsing());
    }
}
