<?php

namespace App\Repositories\master;

use App\Models\master\Stamina;
use App\Repositories\Repository;

class StaminaRepository extends Repository
{
    /**
     * Select stamina Model.
     *
     * @param integer $staminaId
     * @return Stamina
     */
    public function selectByStaminaId(int $staminaId): Stamina
    {
        return Stamina::find($staminaId);
    }
}