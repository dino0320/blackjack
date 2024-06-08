<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', function (Request $request) {
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => $request->password
    ]);

    $token = $user->createToken('TestToken');

    return ['token' => $token->plainTextToken];
});

Route::post('/login', function (Request $request) {
    if (Auth::attempt([
        'email' => $request->email,
        'password' => $request->password,
    ])) {
        $request->user()->tokens()->delete();

        $token = $request->user()->createToken('TestToken');

        return ['token' => $token->plainTextToken];
    }

    return response()->json(['error' => '認証に失敗しました。'], 401);
});
