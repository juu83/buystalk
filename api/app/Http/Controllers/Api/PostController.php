<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Post::with('user')->latest()->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        $request->validate([
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $post = new Post();
        $post->description = $request->description;
        $post->user_id = $request->user()->id;

        if ($request->hasFile('image')) {
            $pathImage = $request->file('image')->store('posts', 'public');
            $post->image = $pathImage;
        }

        $post->save();

        return response()->json($post->load('user'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with('user')->findOrFail($id);
        return $post;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $userId = $request->user()->id;    
        $post = Post::where('user_id', $userId)->findOrFail($id);
        
        $data = $request->all();
        if ($request->hasFile('image')) {
            $pathImage = $request->file('image')->store('posts', 'public');
            $data['image'] = $pathImage;
        }

        $post->update($data);
        return $post;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $userId = $request->user()->id;    
        $post = Post::where('user_id', $userId)->findOrFail($id);
        $post->delete();
        return response()->json(['message' => 'Post supprimé avec succès']);
    }

    /**
     * Display a listing of a connected user's posts.
     */
    public function indexUser(Request $request)
    {
        $user = $request->user();

        $posts = Post::where('user_id', $user->id)
                    ->with('user') 
                    ->latest()
                    ->paginate(10);

        return response()->json($posts);
    }

     /**
     * Display a specified connected user's post.
     */
    public function showUser($id, Request $request)
    {
        $userId = $request->user()->id;
        $post = Post::with('user')
                    ->where('user_id', $userId)
                    ->findOrFail($id);

        return $post;

    }
}
