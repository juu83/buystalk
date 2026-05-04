<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Post;
use App\Models\Notification;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FirebaseNotification;

class LikeController extends Controller
{
    public function index(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);
        $likes = $post->likes()->with('user')->get();
        return response()->json($likes);
    }

    public function store(Request $request, $postId)
    {
        $user = $request->user();
        $post = Post::findOrFail($postId);

        $existingLike = Like::where('user_id', $user->id)->where('post_id', $postId)->first();

        if ($existingLike) {
            $existingLike->delete();
            return response()->json(['message' => 'Like retiré']);
        } else {
            $like = Like::create([
                'user_id' => $user->id,
                'post_id' => $postId,
            ]);

            // Créer notification si pas son propre post
            if ($post->user_id != $user->id) {
                $notification = Notification::create([
                    'type' => 'like',
                    'user_id' => $post->user_id,
                    'from_user_id' => $user->id,
                    'post_id' => $postId,
                ]);

                // Send push notification
                //$this->sendPushNotification($post->user, $user, 'like', $notification);
            }

            return response()->json($like->load('user'), 201);
        }
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
