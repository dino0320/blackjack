<?php

namespace App\Http\Controllers;

use App\Consts\UserConst;
use App\Models\user\UserStamina;
use App\Repositories\master\StaminaRepository;
use App\Repositories\user\UserStaminaRepository;
use DateTime;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreateGameDataController extends Controller
{
    /**
     * Create game data.
     *
     * @param Request $request
     * @return void
     */
    public function executeCommand(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $userStaminaRepository = new UserStaminaRepository();
        $staminaRepository = new StaminaRepository();

        $stamina = $staminaRepository->selectByStaminaId(UserConst::DEFAULT_STAMINA_ID);

        $userStamina = new UserStamina([
            'user_id' => $user->user_id,
            'stamina_id' => $stamina->stamina_id,
            'point' => $stamina->initial_point,
            'last_updated_at' => new DateTime(),
        ]);
        
        $userStaminaRepository->upsertModel($userStamina);
    
        return response()->json([
            'stamina' => $userStamina->point,
        ]);
    }
}
