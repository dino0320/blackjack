<?php

namespace App\Http\Controllers;

use App\Consts\UserConst;
use App\Models\user\User;
use App\Models\user\UserStamina;
use App\Repositories\master\StaminaRepository;
use App\Repositories\user\UserRepository;
use App\Repositories\user\UserStaminaRepository;
use DateTime;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthenticationController extends Controller
{
    /**
     * サインアップする
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function signUp(Request $request): JsonResponse
    {
        $request->validate([
            'user_name' => 'required',
            //'email' => 'required|email',
            //'password' => 'required',
            'device_name' => 'required',
        ]);

        $userRepository = new UserRepository();
        $userStaminaRepository = new UserStaminaRepository();
        $staminaRepository = new StaminaRepository();
        
        $user = new User([
            'user_name' => $request->user_name,
            'device_name' => $request->device_name,
        ]);

        $userRepository->upsertModel($user);

        $stamina = $staminaRepository->selectByStaminaId(UserConst::DEFAULT_STAMINA_ID);

        $userStamina = new UserStamina([
            'user_id' => $user->user_id,
            'stamina_id' => $stamina->stamina_id,
            'point' => $stamina->initial_point,
            'last_updated_at' => new DateTime(),
        ]);
        
        $userStaminaRepository->upsertModel($userStamina);
    
        $token = $user->createToken($request->device_name);
    
        return response()->json(['token' => $token->plainTextToken]);
    }

    /**
     * サインインする
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function signIn(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $user->tokens()->delete();
        
        $token = $user->createToken($user->device_name);
        
        return response()->json(['token' => $token->plainTextToken]);
    }
}
