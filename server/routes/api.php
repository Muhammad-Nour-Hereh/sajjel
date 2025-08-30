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
            Route::patch('/{sale}', [SaleController::class, 'patch']); // For partial updates
            Route::delete('/{sale}', [SaleController::class, 'destroy']);

            // Nested sale items routes
            Route::prefix('{sale}/items')->group(function () {
                Route::get('/', [SaleItemController::class, 'index']);        // Get all items for a sale
                Route::post('/', [SaleItemController::class, 'store']);       // Add item to sale
                Route::get('/{saleItem}', [SaleItemController::class, 'show']); // Show specific sale item
                Route::put('/{saleItem}', [SaleItemController::class, 'update']); // Update sale item
                Route::patch('/{saleItem}', [SaleItemController::class, 'patch']); // Partial update
                Route::delete('/{saleItem}', [SaleItemController::class, 'destroy']); // Remove from sale
                Route::patch('/reorder', [SaleItemController::class, 'reorder']); // Batch reorder items
            });
        });
    });
});
