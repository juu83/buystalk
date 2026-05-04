<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\NotificationController;

Route::get('/ping', function () {
  return response()->json([
      'message' => 'API OK',
      'time' => now()
  ]);
});


Route::apiResource('posts', PostController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () {
  Route::apiResource('posts', PostController::class)->only(['store', 'update', 'destroy']);
  Route::post('/user/ads', [AdController::class, 'store']);
});

Route::get('/ads', [AdController::class, 'index']);

Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::post('/user/device-token', [UserController::class, 'updateDeviceToken']);

    Route::get('/user/posts', [PostController::class, 'indexUser']);
    Route::get('/user/posts/{id}', [PostController::class, 'showUser']);
    Route::post('/user/posts', [PostController::class, 'store']);
    Route::put('/user/posts/{id}', [PostController::class, 'update']);
    Route::delete('/user/posts/{id}', [PostController::class, 'destroy']);

    // Likes
    Route::get('/posts/{postId}/likes', [LikeController::class, 'index']);
    Route::post('/posts/{postId}/likes', [LikeController::class, 'store']);

    // Comments
    Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});

?>
