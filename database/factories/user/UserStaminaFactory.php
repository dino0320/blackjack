<?php

namespace Database\Factories\user;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\user\User>
 */
class UserStaminaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'point' => fake()->randomNumber(),
            'last_updated_at' => now(),
        ];
    }
}
