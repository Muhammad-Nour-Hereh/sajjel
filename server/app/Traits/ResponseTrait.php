<?php

namespace App\Traits;

trait ResponseTrait {

    public function successResponse($data, $code = 200) {
        return response()->json([
            "success" => "true",
            "data" => $data
        ], $code);
    }

    public function createdResponse($data = "", $message = "the has been created successfully") {
        return response()->json([
            "success" => "true",
            "message" => $message,
            "data" => $data
        ], 201);
    }

    public function noContentResponse() {
        return response()->noContent();
    }

    public function failResponse($message, $errors = [], $code = 400) {
        return response()->json([
            "success" => "false",
            "message" => $message,
            "errors" => $errors,
            "data" => null
        ], $code);
    }

    public function unauthorizedResponse() {
        return response()->json([
            "success" => "false",
            "message" => "Unauthorized",
            "data" => null
        ], 401);
    }

    public function forbiddenResponse() {
        return response()->json([
            "success" => "false",
            "message" => "Forbidden",
            "data" => null
        ], 403);
    }

    public function notFoundResponse() {
        return response()->json([
            "success" => "false",
            "message" => "not found",
            "data" => null
        ], 404);
    }

    public function conflictResponse($errors) {
        return response()->json([
            'success' => 'false',
            'message' => $errors,
            'data' => null,
        ], 409);
    }

    public function unprocessableContentResponse($error) {
        return response()->json([
            'success' => 'false',
            'message' => $error,
            'data' => null,
        ], 422);
    }
}