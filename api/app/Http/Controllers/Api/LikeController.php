<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Post;
use App\Models\Notification;

class LikeController extends Controller
{
    public function index(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);
        $likes = $post->likes()->with('user')->get();
        return response()->json($likes);
    }

    public function store(Request $request, $postId){
        $user = $request->user();
        $post = Post::findOrFail($postId);

        $existingLike = Like::where('user_id', $user->id)
                            ->where('post_id', $postId)
                            ->first();

        if ($existingLike) {
            $existingLike->delete();
            // On renvoie explicitement false
            return response()->json(['isLiked' => false, 'likes_count' => $post->likes()->count()]);
        } else {
            $like = Like::create([
                'user_id' => $user->id,
                'post_id' => $postId,
            ]);

            if ($post->user_id != $user->id) {
                $notification = Notification::create([
                    'type' => 'like',
                    'user_id' => $post->user_id,
                    'from_user_id' => $user->id,
                    'post_id' => $postId,
                ]);

                \Log::info('Like notification created:', ['notification_id' => $notification->id, 'user_id' => $post->user_id, 'from_user_id' => $user->id]);
            }

            // On renvoie explicitement true et le nouveau décompte
            return response()->json([
                'isLiked' => true, 
                'likes_count' => $post->likes()->count(),
                'like' => $like->load('user')
            ], 201);
        }
    }
}
