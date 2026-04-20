<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => fake()->sentence(12),
            'image' => fake()->boolean(70)
                ? 'posts/' . fake()->uuid() . '.jpg'
                : null,
            'user_id' => \App\Models\User::inRandomOrder()->first()->id,
        ];
    }
}
