<?php

namespace App\Http\Controllers;

use App\Models\User\User;
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
        
        $user = User::create([
            'user_name' => $request->user_name,
            'device_name' => $request->device_name,
            //'email' => $request->email,
            //'password' => $request->password,
        ]);
    
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
