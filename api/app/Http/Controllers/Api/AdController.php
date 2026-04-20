<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Ad;

class AdController extends Controller
{
    /**
     * Liste toutes les annonces (publiques) triées par distance.
     */
    public function index(Request $request)
    {
        $lat = $request->input('lat');
        $lng = $request->input('lng');

        return Ad::selectRaw("*, DISTANCE(lat, lng, ?, ?) AS distance", [$lat, $lng])
            ->orderBy('distance', 'asc')
            ->get();
    }

    /**
     * Créer une nouvelle annonce.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'city'        => 'required|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('ads', 'public');
        }

        $ad = Ad::create($data);

        return response()->json($ad, 201);
    }

    /**
     * Afficher une seule annonce par son ID.
     */
    public function show(string $id)
    {
        return Ad::findOrFail($id);
    }

    /**
     * Mettre à jour une annonce (seulement si elle nous appartient).
     */
    public function update(Request $request, string $id)
    {
        $userId = $request->user()->id;    
        $ad = Ad::where('user_id', $userId)->findOrFail($id);
        
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'city'        => 'sometimes|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('ads', 'public');
        }

        $ad->update($data);
        return $ad;
    }

    /**
     * Supprimer une annonce (seulement si elle nous appartient).
     */
    public function destroy(Request $request, string $id)
    {
        $userId = $request->user()->id;    
        $ad = Ad::where('user_id', $userId)->findOrFail($id);
        
        $ad->delete();
        return response()->json(['message' => 'Annonce supprimée avec succès']);
    }

    /**
     * Display a listing of a connected user's posts.
     */
    public function indexUser(Request $request)
    {
        $user = $request->user();

        $ads = Ad::where('user_id', $user->id)
                    ->with('user') 
                    ->latest()
                    ->paginate(10);

        return response()->json($ads);
    }

     /**
     * Display a specified connected user's post.
     */
    public function showUser($id, Request $request)
    {
        $userId = $request->user()->id;
        $ad = Ad::with('user')
                    ->where('user_id', $userId)
                    ->findOrFail($id);

        return $ad;

    }
}