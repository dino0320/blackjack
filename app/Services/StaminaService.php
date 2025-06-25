<?php

namespace App\Services;

use App\Consts\CommonConst;
use App\Exceptions\UserException;
use App\Models\master\Stamina;
use App\Models\user\UserStamina;
use DateTime;

class StaminaService
{
    /**
     * Consume stamina.
     *
     * @param UserStamina $userStamina
     * @param Stamina $stamina
     * @return void
     */
    public static function consumeStamina(UserStamina $userStamina, Stamina $stamina): void
    {
        self::recoverStamina($userStamina, $stamina);

        if ($userStamina->point < $stamina->consumed_point) {
            throw new UserException("require stamina more than {$stamina->consumed_point}. stamina: {$userStamina->point}");
        }

        $userStamina->point -= $stamina->consumed_point;
    }

    /**
     * Recover stamina.
     *
     * @param UserStamina $userStamina
     * @param Stamina $stamina
     * @return void
     */
    public static function recoverStamina(UserStamina $userStamina, Stamina $stamina): void
    {
        if ($userStamina->point >= $stamina->max_point) {
            return;
        }

        $lastUpdatedDateTime = new DateTime($userStamina->last_updated_at);
        $currentDateTime = new DateTime();
        $diff = $currentDateTime->getTimestamp() - $lastUpdatedDateTime->getTimestamp();
        $userStamina->point = min((int)($userStamina->point + (($stamina->recovery_point / CommonConst::SECONDS_IN_AN_HOUR) * $diff)), $stamina->max_point);
        $userStamina->last_updated_at = $currentDateTime;
    }
}