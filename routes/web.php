<?php

use Illuminate\Support\Facades\Route;

Route::get('/home', function () {
    return view('home');
});

Route::get('/game', function () {
    return view('blackjack');
});

Route::get('/ranking', function () {
    return view('ranking');
});
