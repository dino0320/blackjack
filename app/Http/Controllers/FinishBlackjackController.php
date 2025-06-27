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

        $request->validate([
            'score' => 'required|integer',
        ]);

        $userRepository = new UserRepository();

        if (!$user->is_game) {
            throw new UserException('blackjack already finished.');
        }

        if ($request->score > $user->high_score) {
            $user->high_score = $request->score;
        }

        $user->is_game = false;

        $userRepository->upsertModel($user);

        return new JsonResponse();
    }
}
