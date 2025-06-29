<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
Route::group(["prefix" => "v1"], function () {

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);

        // Protected routes (require JWT token)
        Route::middleware('jwt')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });
});
