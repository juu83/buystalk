<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{

    public function index(Request $request)
    {
        $query = Post::with('user')->latest();

        // optional filter by user id (e.g. /api/posts?user=3)
        if ($request->has('user')) {
            $query->where('user_id', $request->query('user'));
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(Post::with('user')->findOrFail($id));
    }

    public function indexUser(Request $request)
    {
        $user = $request->user();
        
        $posts = Post::with('user')
                    ->where('user_id', $user->id)
                    ->latest()
                    ->get();
                    
        return response()->json($posts);
    }

    public function showUser(Request $request, $id)
    {
        $user = $request->user();
        
        $post = Post::with('user')
                    ->where('user_id', $user->id)
                    ->findOrFail($id);
                    
        return response()->json($post);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $post = new Post();
        $post->description = $request->description;
        $post->user_id = $request->user()->id;

        if ($request->hasFile('image')) {
            $post->image = $request->file('image')->store('posts', 'public');
        }

        $post->save();

        return response()->json($post->load('user'), 201);
    }


    public function update(Request $request, $id)
    {
        $user = $request->user();
        
        $post = Post::where('user_id', $user->id)->findOrFail($id);
        
        $request->validate([
            'description' => 'required|string'
        ]);

        $post->update(['description' => $request->description]);

        return response()->json($post->load('user'));
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        $post = Post::where('user_id', $user->id)->findOrFail($id);
        
        $post->delete();

        return response()->json(['message' => 'Post supprimé avec succès']);
    }
}