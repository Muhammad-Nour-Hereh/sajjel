<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleItemController;
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
            Route::patch('/{item}/update-thumbnail', [ItemController::class, 'updateThumbnail']);
            Route::delete('/{item}', [ItemController::class, 'destroy']);
        });

        // sales
        Route::prefix('sales')->group(function () {
            Route::get('/', [SaleController::class, 'index']);
            Route::post('/', [SaleController::class, 'store']);
            Route::get('/{sale}', [SaleController::class, 'show']);
            Route::put('/{sale}', [SaleController::class, 'update']);
            Route::patch('/{sale}', [SaleController::class, 'patch']);
            Route::delete('/{sale}', [SaleController::class, 'destroy']);

            // sale items routes
            Route::prefix('{sale}/items')->group(function () {
                Route::get('/', [SaleItemController::class, 'index']);
                Route::post('/', [SaleItemController::class, 'store']);
                Route::get('/{saleItem}', [SaleItemController::class, 'show']);
                Route::put('/{saleItem}', [SaleItemController::class, 'update']);
                Route::patch('/{saleItem}', [SaleItemController::class, 'patch']);
                Route::delete('/{saleItem}', [SaleItemController::class, 'destroy']);
                Route::patch('/reorder', [SaleItemController::class, 'reorder']);
            });
        });
    });
});
