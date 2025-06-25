<?php

namespace App\Http\Controllers;

use App\Consts\UserConst;
use App\Exceptions\UserException;
use App\Repositories\master\StaminaRepository;
use App\Repositories\user\UserRepository;
use App\Repositories\user\UserStaminaRepository;
use App\Services\StaminaService;
use Illuminate\Http\Request;

class BlackjackController extends Controller
{
    /**
     * ブラックジャックを開始する
     *
     * @param Request $request
     * @return void
     */
    public function startBlackjack(Request $request): void
    {
        $user = $request->user();

        $userRepository = new UserRepository();
        $userStaminaRepository = new UserStaminaRepository();
        $staminaRepository = new StaminaRepository();

        if ($user->is_game) {
            throw new UserException("the game has been started. user_id: {$user->user_id}");
        }

        $stamina = $staminaRepository->selectByStaminaId(UserConst::DEFAULT_STAMINA_ID);
        $userStamina = $userStaminaRepository->selectByUserIdAndStaminaId($user->user_id, $stamina->stamina_id);
        StaminaService::consumeStamina($userStamina, $stamina);

        $user->is_game = true;

        $userRepository->upsertModel($user);
        $userStaminaRepository->upsertModel($userStamina);
    }

    /**
     * ブラックジャックを終了する
     *
     * @param Request $request
     * @return void
     */
    public function finishBlackjack(Request $request): void
    {
        $user = $request->user();

        $userRepository = new UserRepository();

        if (!$user->is_game) {
            throw new UserException('blackjack already finished.');
        }

        $user->is_game = false;

        // 得点記録処理

        $userRepository->upsertModel($user);
    }
}
