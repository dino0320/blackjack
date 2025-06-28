<?php

use App\Http\Controllers\CreateGameDataController;
use App\Http\Controllers\FinishBlackjackController;
use App\Http\Controllers\GetRankingController;
use App\Http\Controllers\SignInController;
use App\Http\Controllers\SignUpController;
use App\Http\Controllers\StartBlackjackController;
use Illuminate\Support\Facades\Route;

Route::post('/sign-up', [SignUpController::class, 'executeAPI']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/sign-in', [SignInController::class, 'executeAPI']);

    Route::post('/create-game-data', [CreateGameDataController::class, 'executeAPI']);
     
    Route::post('/start-blackjack', [StartBlackjackController::class, 'executeAPI']);
    
    Route::post('/finish-blackjack', [FinishBlackjackController::class, 'executeAPI']);

    Route::post('/get-ranking', [GetRankingController::class, 'executeAPI']);
});