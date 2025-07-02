<?php

namespace Database\Seeders\master;

use App\Consts\DatabaseConst;
use App\Models\master\Stamina;
use App\Repositories\master\StaminaRepository;
use Database\Seeders\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class StaminaSeeder extends Seeder
{
    /**
     * Set properties.
     *
     * @return void
     */
    protected function setProperties(): void
    {
        $this->modelName = Stamina::class;
        $this->repositoryName = StaminaRepository::class;
        $this->purpose = DatabaseConst::PURPOSE_MASTER;
        $this->table = (new Stamina())->getTable();
    }
}
