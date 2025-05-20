<?php

namespace App\Http\Controllers;

use App\Exceptions\UserException;
use App\Models\Master\Stamina;
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

        $this->consumeStamina($user);

        $user->is_game = true;

        $stamina = Stamina::find(1);

        $user->save();
    }

    /**
     * スタミナを消費する
     *
     * @param User $user
     * @return void
     */
    private function consumeStamina($user): void
    {
        $consumedStamina = 20;
        if ($user->stamina < $consumedStamina) {
            throw new UserException("require stamina more than {$consumedStamina}. stamina: {$user->stamina}");
        }

        $user->stamina -= $consumedStamina;
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

        if (!$user->is_game) {
            throw new UserException('blackjack already finished.');
        }

        $user->is_game = false;

        // 得点記録処理

        $user->save();
    }
}
