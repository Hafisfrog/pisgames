<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\StandingController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/standings', [StandingController::class, 'index']);
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/teams/{team}', [TeamController::class, 'show']);
Route::get('/sports', [SportController::class, 'index']);
Route::get('/sports/{sport}', [SportController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);
Route::get('/results', [ResultController::class, 'index']);
Route::get('/results/{result}', [ResultController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('admin')->group(function () {
        Route::apiResource('teams', TeamController::class)->except(['index', 'show']);
        Route::apiResource('sports', SportController::class)->except(['index', 'show']);
        Route::apiResource('events', EventController::class)->except(['index', 'show']);
        Route::apiResource('results', ResultController::class)->except(['index', 'show']);
    });

    Route::middleware('admin')->prefix('users')->group(function () {

        Route::get('/', [UserController::class, 'index']);

        Route::post('/', [UserController::class, 'store']);

        Route::get('/{user}', [UserController::class, 'show']);

        Route::put('/{user}', [UserController::class, 'update']);

        Route::delete('/{user}', [UserController::class, 'destroy']);

    });
});
