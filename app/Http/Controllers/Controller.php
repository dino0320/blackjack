<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

abstract class Controller
{
    /**
     * Execute API.
     *
     * @return JsonResponse
     */
    public function executeAPI(Request $request): JsonResponse
    {
        $response = new JsonResponse();

        try {
            DB::beginTransaction();
            $response = $this->executeCommand($request);
            DB::commit();
            return $response;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $response;
    }

    /**
     * Execute command.
     *
     * @param Request $request
     * @return JsonResponse
     */
    abstract protected function executeCommand(Request $request): JsonResponse;
}
