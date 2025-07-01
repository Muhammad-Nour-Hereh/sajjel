<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "v1"], function () {

    // guest routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
    });

    // user routes
    Route::middleware('jwt')->group(function () {
        // auth
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        // items
        Route::prefix('items')->group(function () {
            Route::get('/', [ItemController::class, 'index']);
            Route::post('/', [ItemController::class, 'store']);
            Route::get('/{item}', [ItemController::class, 'show']);
            Route::put('/{item}', [ItemController::class, 'update']);
            Route::delete('/{item}', [ItemController::class, 'destroy']);
        });
    });
});
