<?php

namespace App\Http\Controllers;

use App\Repositories\user\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class GetRankingController extends Controller
{
    /**
     * Get ranking.
     *
     * @param Request $request
     * @return void
     */
    public function executeCommand(Request $request): JsonResponse
    {
        $user = $request->user();

        $userRepository = new UserRepository();

        $users = $userRepository->selectRanking();

        return response()->json([
            'high_score' => $user->high_score,
            'users' => $this->getRankingResponse($users),
        ]);
    }

    /**
     * Get ranking response.
     *
     * @param Collection $users
     * @return array
     */
    private function getRankingResponse(Collection $users): array
    {
        $rankingResponse = [];
        foreach ($users as $rank => $user) {
            $rankingResponse[] = [
                'rank' => $rank + 1,
                'user_name' => $user->user_name,
                'high_score' => $user->high_score,
            ];
        }

        return $rankingResponse;
    }
}
