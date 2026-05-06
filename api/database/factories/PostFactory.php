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
        $images = [
            '1Pbjf1yUJXTk62KdkFBrHwQezGeAAfOvKNYSNzCP.png',
            'Tfodr67ikldE8ivIMmYnTdjvGapJg8a74iC6CrFP.png',
            'dv7vcZNB1h6Sw7ldsbk0k8BENf9xW4ODPel0dnCm.png',
            'edOLvNfkj6ogd9qNlWbNTA0pjMbmvpdQvv0Ucua0.png',
            'etZfYVxjN7tA34pzx9hCaAhgSpXmUL08S7hUBc0h.jpg',
            'kzH1ETJS9SwR9o19LPLQaMZAGUB2KZ00a028xB4Z.png',
            'xWCTDnFHT8k7j8MZTxUu6zFUro7YtTqR6lpQBVkP.png',
            'xXLRebQybXz3OsfZDg8FsyGOjnKbj23oN5dglQew.png',
        ];

        return [
            'description' => fake()->sentence(12),
            'image' => fake()->boolean(70)
                ? 'posts/' . fake()->randomElement($images)
                : null,
            'user_id' => \App\Models\User::inRandomOrder()->first()->id,
        ];
    }
}
