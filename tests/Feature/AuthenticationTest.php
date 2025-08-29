<?php

namespace Tests\Feature;

use App\Consts\ErrorCodeConst;
use App\Consts\UserConst;
use App\Models\user\User;
use App\Models\user\UserStamina;
use App\Repositories\master\StaminaRepository;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\ApiTestCase;

class AuthenticationTest extends ApiTestCase
{
    public function test_sign_up(): void
    {
        $response = $this->postJson('/api/sign-up', ['user_name' => 'test', 'device_name' => 'testing']);

        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->whereType('token', 'string')
            );
    }

    public function test_sign_up_validation_error(): void
    {
        $response = $this->postJson('/api/sign-up', ['user_name' => '', 'device_name' => 'testing']);

        $response
            ->assertStatus(200)    
            ->assertJson(fn (AssertableJson $json) =>
                $json->where('error_code', ErrorCodeConst::BAD_REQUEST)
                    ->whereType('error_message', 'string')
            );
    }

    public function test_sign_in(): void
    {
        $staminaRepository = new StaminaRepository();
        
        $user = User::factory()->create(['user_name' => 'test']);
        $stamina = $staminaRepository->selectByStaminaId(UserConst::DEFAULT_STAMINA_ID);
        UserStamina::factory()
            ->for($user)
            ->create(['stamina_id' => $stamina->stamina_id, 'point' => $stamina->initial_point]);
        
        $token = $user->createToken($user->device_name)->plainTextToken;
        $response = $this->withToken($token)->postJson('/api/sign-in');

        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->whereType('token', 'string')
                    ->where('stamina', $stamina->initial_point)
            );
    }

    public function test_sign_in_authentication_error(): void
    {
        $staminaRepository = new StaminaRepository();
        
        $user = User::factory()->create(['user_name' => 'test']);
        $stamina = $staminaRepository->selectByStaminaId(UserConst::DEFAULT_STAMINA_ID);
        UserStamina::factory()
            ->for($user)
            ->create(['stamina_id' => $stamina->stamina_id, 'point' => $stamina->initial_point]);
        
        $user->createToken($user->device_name)->plainTextToken;
        $response = $this->withToken('invalid token')->postJson('/api/sign-in');

        $response
            ->assertStatus(200)    
            ->assertJson(fn (AssertableJson $json) =>
                $json->where('error_code', ErrorCodeConst::UNAUTHORIZED)
                    ->whereType('error_message', 'string')
            );
    }
}
