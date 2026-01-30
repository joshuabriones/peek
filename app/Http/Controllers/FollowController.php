<?php

namespace App\Http\Controllers;

use App\Contracts\FollowServiceInterface;
use App\Http\Requests\Follow\FollowUserRequest;
use App\Http\Requests\Follow\UnfollowUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function __construct(
        private FollowServiceInterface $followService
    ) {}

    public function follow(FollowUserRequest $request, User $user): JsonResponse
    {
        $result = $this->followService->follow(Auth::user(), $user);
        
        return response()->json(
            $result['success'] 
                ? ['message' => $result['message'], ...$result['data']] 
                : ['message' => $result['message']],
            $result['status']
        );
    }

    public function unfollow(UnfollowUserRequest $request, User $user): JsonResponse
    {
        $result = $this->followService->unfollow(Auth::user(), $user);
        
        return response()->json(
            $result['success'] 
                ? ['message' => $result['message'], ...$result['data']] 
                : ['message' => $result['message']],
            $result['status']
        );
    }

    public function getFollowers(User $user): JsonResponse
    {
        $result = $this->followService->getFollowers($user);
        
        return response()->json($result['data'], $result['status']);
    }

    public function getFollowing(User $user): JsonResponse
    {
        $result = $this->followService->getFollowing($user);
        
        return response()->json($result['data'], $result['status']);
    }

    public function getFollowStatus(User $user): JsonResponse
    {
        $result = $this->followService->getFollowStatus(Auth::user(), $user);
        
        return response()->json($result['data'], $result['status']);
    }
}

