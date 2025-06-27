<?php

namespace App\Exceptions;

use App\Consts\ErrorCodeConst;
use Exception;
use Illuminate\Http\JsonResponse;

class UserException extends Exception
{
    /**
     * Constructor
     *
     * @param string $message
     */
    public function __construct(string $message)
    {
        parent::__construct($message, ErrorCodeConst::BAD_REQUEST);
    }
 
    /**
     * Render the exception.
     *
     * @return JsonResponse
     */
    public function render(): JsonResponse
    {
        return response()->json(
            [
                'error_code' => $this->code,
                'error_message' => $this->message,
            ]
        );
    }
}
