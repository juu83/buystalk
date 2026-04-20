<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create a known user for local debugging
        User::factory()->create([
            'email' => 'test@test.com',
            'password' => Hash::make('password'),
            'firstname' => 'Test',
            'lastname' => 'User'
        ]);

        $users = User::factory(10)->create();

        Post::factory(50)->make()->each(function ($post) use ($users) {
            $post->user_id = $users->random()->id;
            $post->save();
        });
    }
}
