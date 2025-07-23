<?php

namespace App\Http\Controllers;

use App\Models\user\User;
use App\Repositories\user\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SignUpController extends Controller
{
    /**
     * Sign up.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function executeCommand(Request $request): JsonResponse
    {
        $request->validate([
            'user_name' => 'required',
            'device_name' => 'required',
        ]);

        Log::info('after validate');

        $userRepository = new UserRepository();
        
        $user = new User([
            'user_name' => $request->user_name,
            'device_name' => $request->device_name,
        ]);

        $userRepository->upsertModel($user);

        Log::info('after upsert');
    
        $token = $user->createToken($request->device_name);
    
        return response()->json([
            'token' => $token->plainTextToken,
        ]);
    }
}
