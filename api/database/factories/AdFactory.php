<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ad>
 */
class AdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $city = fake()->randomElement(['Nice', 'Antibes', 'Cannes', 'Marseille', 'Lyon', 'Paris']);

        [$baseLat, $baseLng] = match($city) {
            'Nice'      => [43.71, 7.26],
            'Antibes'   => [43.58, 7.12],
            'Cannes'    => [43.55, 7.01],
            'Marseille' => [43.29, 5.37],
            'Lyon'      => [45.76, 4.83],
            'Paris'     => [48.85, 2.35],
            default     => [46.22, 2.21], // Centre de la France par défaut
        };

        return [
            'title'       => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'city'        => $city,
            'lat'         => $baseLat + fake()->randomFloat(4, -0.05, 0.05),
            'lng'         => $baseLng + fake()->randomFloat(4, -0.05, 0.05),
            'image'       => null,
        ];
    }
}
