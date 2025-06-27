<?php

use App\Http\Controllers\CreateGameDataController;
use App\Http\Controllers\FinishBlackjackController;
use App\Http\Controllers\GetRankingController;
use App\Http\Controllers\SignInController;
use App\Http\Controllers\SignUpController;
use App\Http\Controllers\StartBlackjackController;
use App\Http\Middleware\PostProcessing;
use App\Models\user\User;
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

Route::post('/sign-up', [SignUpController::class, 'executeAPI']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/sign-in', [SignInController::class, 'executeAPI']);

    Route::post('/create-game-data', [CreateGameDataController::class, 'executeAPI']);
     
    Route::post('/start-blackjack', [StartBlackjackController::class, 'executeAPI']);
    
    Route::post('/finish-blackjack', [FinishBlackjackController::class, 'executeAPI']);

    Route::post('/get-ranking', [GetRankingController::class, 'executeAPI']);
});