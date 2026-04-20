<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ad;

class AdController extends Controller
{
    public function index(Request $request)
    {
        $query = Ad::with('user');

        if ($request->has('lat') && $request->has('lng')) {
            $lat = $request->lat;
            $lng = $request->lng;

            $query->selectRaw("*, 
                ( 6371 * acos( cos( radians(?) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(?) ) + 
                sin( radians(?) ) * sin( radians( lat ) ) ) 
                ) AS distance", [$lat, $lng, $lat])
                ->orderBy('distance');
        } else {
            $query->latest();
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'city' => 'required|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'image' => 'nullable|image|max:10240'
        ]);

        $ad = new Ad();
        $ad->title = $request->title;
        $ad->description = $request->description;
        $ad->city = $request->city;
        $ad->lat = $request->lat;
        $ad->lng = $request->lng;
        $ad->user_id = $request->user()->id;

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $path = $request->file('image')->store('ads', 'public');
            $ad->image = $path;
        }

        $ad->save();

        return response()->json($ad->load('user'), 201);
    }
}