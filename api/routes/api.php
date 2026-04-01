<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdController;



Route::post('/login', [UserController::class, 'login']);
Route::get('/ads', [AdController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);

    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);
    Route::get('/user/posts', [PostController::class, 'indexUser']);
    Route::post('/user/posts', [PostController::class, 'store']);
    Route::get('/user/posts/{id}', [PostController::class, 'showUser']);
    Route::put('/user/posts/{id}', [PostController::class, 'update']);
    Route::delete('/user/posts/{id}', [PostController::class, 'destroy']);

   
});

Route::apiResource('posts', PostController::class);
?>