<?php

namespace App\Http\Controllers\Api;

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
    public function store(Request $request)
    {
        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        if ($request->hasFile('image')) {
            $pathImage = $request->file('image')->store('posts', 'public');
            $data['image'] = $pathImage;
        }
        $post = Post::create($data);

        return $post;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with('user', $userId)->findOrFail($id);
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
        $userId = $request->user()->id;
        $posts = Post::where('user_id', $userId)->get();
        return $posts;
    }

     /**
     * Display a specified connected user's post.
     */
    public function showUser($id, Request $request)
    {
        $userId = $request->user()->id;
        $post = Post::where('user_id', $userId)->findOrFail($id);
        return $post;

    }
}
