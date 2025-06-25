<?php

namespace App\Http\Controllers;

use App\Exceptions\UserException;
use App\Repositories\user\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinishBlackjackController extends Controller
{
    /**
     * Finish Blackjack.
     *
     * @param Request $request
     * @return void
     */
    public function executeCommand(Request $request): JsonResponse
    {
        $user = $request->user();

        $userRepository = new UserRepository();

        if (!$user->is_game) {
            throw new UserException('blackjack already finished.');
        }

        $user->is_game = false;

        // 得点記録処理

        $userRepository->upsertModel($user);

        return new JsonResponse();
    }
}
