<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function follow(User $user): JsonResponse
    {
        $auth = Auth::user();

        // Can't follow yourself
        if ($auth->id === $user->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 422);
        }

        // Check if already following
        if ($auth->isFollowing($user)) {
            return response()->json(['message' => 'Already following this user'], 422);
        }

        Follow::create([
            'follower_id' => $auth->id,
            'following_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'User followed successfully',
            'is_following' => true,
            'is_mutual' => $auth->isMutualFollow($user),
        ]);
    }

    public function unfollow(User $user): JsonResponse
    {
        $auth = Auth::user();

        Follow::where('follower_id', $auth->id)
            ->where('following_id', $user->id)
            ->delete();

        return response()->json([
            'message' => 'User unfollowed successfully',
            'is_following' => false,
            'is_mutual' => false,
        ]);
    }

    public function getFollowers(User $user)
    {
        $followers = $user->followers()
            ->with('follower:id,name,nickname,bio')
            ->get()
            ->map(function ($follow) use ($user) {
                $follower = $follow->follower;
                return [
                    'id' => $follower->id,
                    'name' => $follower->name,
                    'nickname' => $follower->nickname,
                    'bio' => $follower->bio,
                    'is_mutual' => $user->isMutualFollow($follower),
                ];
            });

        return response()->json($followers);
    }

    public function getFollowing(User $user)
    {
        $following = $user->following()
            ->with('following:id,name,nickname,bio')
            ->get()
            ->map(function ($follow) use ($user) {
                $followingUser = $follow->following;
                return [
                    'id' => $followingUser->id,
                    'name' => $followingUser->name,
                    'nickname' => $followingUser->nickname,
                    'bio' => $followingUser->bio,
                    'is_mutual' => $user->isMutualFollow($followingUser),
                ];
            });

        return response()->json($following);
    }

    public function getFollowStatus(User $user): JsonResponse
    {
        $auth = Auth::user();

        return response()->json([
            'is_following' => $auth->isFollowing($user),
            'is_followed_by' => $auth->isFollowedBy($user),
            'is_mutual' => $auth->isMutualFollow($user),
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
        ]);
    }
}

