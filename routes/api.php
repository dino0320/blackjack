<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\BlackjackController;
use App\Http\Middleware\PostProcessing;
use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/

Route::post('/signin2', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        //'device_name' => 'required',
    ]);

    if (Auth::attempt([
        'email' => $request->email,
        'password' => $request->password,
    ])) {
        $request->user()->tokens()->delete();

        $token = $request->user()->createToken('TestToken');
        
        return ['token' => $token->plainTextToken];
    }
 
    /*$user = User::where('email', $request->email)->first();
 
    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    $token = $user->createToken('TestToken');

    return ['token' => $token->plainTextToken];*/
});

Route::post('/sign-up', [AuthenticationController::class, 'signUp']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/sign-in', [AuthenticationController::class, 'signIn']);
     
    Route::post('/start-blackjack', [BlackjackController::class, 'startBlackjack']);
    
    Route::post('/finish-blackjack', [BlackjackController::class, 'finishBlackjack']);
});