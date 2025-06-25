<?php

namespace App\Http\Controllers;

use App\Consts\UserConst;
use App\Models\user\User;
use App\Repositories\master\StaminaRepository;
use App\Repositories\user\UserRepository;
use App\Repositories\user\UserStaminaRepository;
use App\Services\StaminaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SignInController extends Controller
{
    /**
     * Sing in.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function executeCommand(Request $request): JsonResponse
    {
        $user = $request->user();

        $userStaminaRepository = new UserStaminaRepository();
        $staminaRepository = new StaminaRepository();

        $stamina = $staminaRepository->selectByStaminaId(UserConst::DEFAULT_STAMINA_ID);
        $userStamina = $userStaminaRepository->selectByUserIdAndStaminaId($user->user_id, $stamina->stamina_id);
        StaminaService::recoverStamina($userStamina, $stamina);
        
        $user->tokens()->delete();
        
        $token = $user->createToken($user->device_name);
        
        return response()->json([
            'token' => $token->plainTextToken,
            'stamina' => $userStamina->point,
        ]);
    }
}
