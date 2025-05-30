<?php

use App\Consts\ErrorCodeConst;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e) {
            return response()->json(
                [
                    'error_code' => ErrorCodeConst::UNAUTHORIZED,
                    'error_message' => $e->getMessage(),
                ]
            );
        });

        $exceptions->render(function (ValidationException $e) {
            return response()->json(
                [
                    'error_code' => ErrorCodeConst::BAD_REQUEST,
                    'error_message' => $e->getMessage(),
                ]
            );
        });
    })->create();
