<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Notification;

class CommentController extends Controller
{
    public function index(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);
        $comments = $post->comments()->with('user')->get();
        return response()->json($comments);
    }

    public function store(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string|max:500'
        ]);

        $user = $request->user();
        $post = Post::findOrFail($postId);

        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => $user->id,
            'post_id' => $postId,
        ]);

        if ($post->user_id != $user->id) {
            $notification = Notification::create([
                'type' => 'comment',
                'user_id' => $post->user_id, // Le propriétaire du post
                'from_user_id' => $user->id, // Celui qui commente
                'post_id' => $postId,
                'comment_id' => $comment->id,
            ]);

            \Log::info('Comment notification created:', ['notification_id' => $notification->id, 'user_id' => $post->user_id, 'from_user_id' => $user->id]);
        }

        return response()->json($comment->load('user'), 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $comment = Comment::where('user_id', $user->id)->findOrFail($id);

        $request->validate([
            'content' => 'required|string|max:500'
        ]);

        $comment->update(['content' => $request->content]);

        return response()->json($comment->load('user'));
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $comment = Comment::where('user_id', $user->id)->findOrFail($id);

        $comment->delete();

        return response()->json(['message' => 'Commentaire supprimé']);
    }
}
