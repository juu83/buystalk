<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Notification;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FirebaseNotification;

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
        // On garde la création en base de données
        Notification::create([
            'type' => 'like',
            'user_id' => $post->user_id, // Le propriétaire du post
            'from_user_id' => $user->id, // Celui qui like
            'post_id' => $postId,
        ]);

        // On NE rappelle PAS $this->sendPushNotification() pour l'instant 
        // car c'est elle qui provoquait l'erreur 500.
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

    private function sendPushNotification($recipient, $sender, $type, $notification)
    {
        if (!$recipient->device_token) {
            return;
        }

        $messaging = app('firebase.messaging');

        $title = $type === 'like' ? 'Nouveau like' : 'Nouveau commentaire';
        $body = "{$sender->firstname} {$sender->lastname} " . 
                ($type === 'like' ? 'a aimé votre publication' : 'a commenté votre publication');

        $message = CloudMessage::withTarget('token', $recipient->device_token)
            ->withNotification(FirebaseNotification::create($title, $body))
            ->withData([
                'notification_id' => $notification->id,
                'type' => $type,
                'post_id' => $notification->post_id,
            ]);

        try {
            $messaging->send($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send push notification: ' . $e->getMessage());
        }
    }
}
