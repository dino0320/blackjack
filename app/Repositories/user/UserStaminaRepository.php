<?php

namespace App\Repositories\user;

use App\Models\user\UserStamina;
use App\Repositories\Repository;

class UserStaminaRepository extends Repository
{
    /**
     * Model class name
     */
    protected string $modelName = UserStamina::class;

    /**
     * Select stamina Model.
     *
     * @param integer $userId
     * @param integer $staminaId
     * @return UserStamina
     */
    public function selectByUserIdAndStaminaId(int $userId, int $staminaId): UserStamina
    {
        return UserStamina::where('user_id', $userId)->where('stamina_id', $staminaId)->first();
    }
}