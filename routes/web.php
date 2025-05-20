<?php

use Illuminate\Support\Facades\Route;

/*Route::get('/signup', function () {
    return view('signup');
});

Route::get('/signin', function () {
    return view('signin');
});*/

Route::get('/home', function () {
    return view('home');
});

Route::get('/game', function () {
    return view('blackjack');
});
