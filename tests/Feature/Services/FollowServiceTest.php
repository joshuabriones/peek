<?php

namespace Tests\Feature\Services;

use App\Contracts\FollowRepositoryInterface;
use App\Models\User;
use App\Services\FollowService;
use InvalidArgumentException;
use Mockery;
use Tests\TestCase;

/**
 * Example tests for FollowService
 * 
 * These tests demonstrate how to test the Service layer
 * with mocked dependencies (Repository layer)
 */
class FollowServiceTest extends TestCase
{
    private FollowRepositoryInterface $mockRepository;
    private FollowService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Create mock repository
        $this->mockRepository = Mockery::mock(FollowRepositoryInterface::class);
        
        // Create service with mocked repository
        $this->service = new FollowService($this->mockRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_prevents_user_from_following_themselves()
    {
        // Arrange
        $user = User::factory()->make(['id' => 1]);

        // Assert
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('You cannot follow yourself');

        // Act
        $this->service->follow($user, $user);
    }

    /** @test */
    public function it_prevents_following_a_user_twice()
    {
        // Arrange
        $follower = User::factory()->make(['id' => 1]);
        $following = User::factory()->make(['id' => 2]);

        // Mock: User is already following
        $this->mockRepository
            ->shouldReceive('isFollowing')
            ->once()
            ->with(1, 2)
            ->andReturn(true);

        // Assert
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Already following this user');

        // Act
        $this->service->follow($follower, $following);
    }

    /** @test */
    public function it_successfully_creates_a_follow_relationship()
    {
        // Arrange
        $follower = User::factory()->make(['id' => 1]);
        $following = User::factory()->make(['id' => 2]);

        // Mock: Not already following
        $this->mockRepository
            ->shouldReceive('isFollowing')
            ->once()
            ->with(1, 2)
            ->andReturn(false);

        // Mock: Create follow
        $this->mockRepository
            ->shouldReceive('create')
            ->once()
            ->with(1, 2)
            ->andReturn(new \App\Models\Follow(['follower_id' => 1, 'following_id' => 2]));

        // Mock: Check mutual (not mutual)
        $this->mockRepository
            ->shouldReceive('isMutualFollow')
            ->once()
            ->with(1, 2)
            ->andReturn(false);

        // Act
        $result = $this->service->follow($follower, $following);

        // Assert
        $this->assertEquals([
            'message' => 'User followed successfully',
            'is_following' => true,
            'is_mutual' => false,
        ], $result);
    }

    /** @test */
    public function it_detects_mutual_follow_after_following()
    {
        // Arrange
        $follower = User::factory()->make(['id' => 1]);
        $following = User::factory()->make(['id' => 2]);

        // Mock: Not already following
        $this->mockRepository
            ->shouldReceive('isFollowing')
            ->once()
            ->with(1, 2)
            ->andReturn(false);

        // Mock: Create follow
        $this->mockRepository
            ->shouldReceive('create')
            ->once()
            ->with(1, 2)
            ->andReturn(new \App\Models\Follow(['follower_id' => 1, 'following_id' => 2]));

        // Mock: Check mutual (is mutual!)
        $this->mockRepository
            ->shouldReceive('isMutualFollow')
            ->once()
            ->with(1, 2)
            ->andReturn(true);

        // Act
        $result = $this->service->follow($follower, $following);

        // Assert
        $this->assertTrue($result['is_mutual']);
    }

    /** @test */
    public function it_successfully_unfollows_a_user()
    {
        // Arrange
        $follower = User::factory()->make(['id' => 1]);
        $following = User::factory()->make(['id' => 2]);

        // Mock: Delete follow
        $this->mockRepository
            ->shouldReceive('delete')
            ->once()
            ->with(1, 2)
            ->andReturn(true);

        // Act
        $result = $this->service->unfollow($follower, $following);

        // Assert
        $this->assertEquals([
            'message' => 'User unfollowed successfully',
            'is_following' => false,
            'is_mutual' => false,
        ], $result);
    }

    /** @test */
    public function it_returns_correct_follow_status()
    {
        // Arrange
        $follower = User::factory()->make(['id' => 1]);
        $following = User::factory()->make(['id' => 2]);

        // Mock: User 1 follows User 2
        $this->mockRepository
            ->shouldReceive('isFollowing')
            ->once()
            ->with(1, 2)
            ->andReturn(true);

        // Mock: User 2 follows User 1
        $this->mockRepository
            ->shouldReceive('isFollowedBy')
            ->once()
            ->with(1, 2)
            ->andReturn(true);

        // Mock: Count followers
        $this->mockRepository
            ->shouldReceive('countFollowers')
            ->once()
            ->with(2)
            ->andReturn(5);

        // Mock: Count following
        $this->mockRepository
            ->shouldReceive('countFollowing')
            ->once()
            ->with(2)
            ->andReturn(10);

        // Act
        $result = $this->service->getFollowStatus($follower, $following);

        // Assert
        $this->assertEquals([
            'is_following' => true,
            'is_followed_by' => true,
            'is_mutual' => true,
            'followers_count' => 5,
            'following_count' => 10,
        ], $result);
    }

    /** @test */
    public function it_gets_followers_with_mutual_status()
    {
        // Arrange
        $user = User::factory()->make(['id' => 1]);
        $follower1 = User::factory()->make(['id' => 2, 'name' => 'User 2', 'nickname' => 'user2', 'bio' => 'Bio 2']);
        $follower2 = User::factory()->make(['id' => 3, 'name' => 'User 3', 'nickname' => 'user3', 'bio' => 'Bio 3']);

        // Mock: Get followers
        $this->mockRepository
            ->shouldReceive('getFollowers')
            ->once()
            ->with(1)
            ->andReturn(collect([$follower1, $follower2]));

        // Mock: Check mutual for each follower
        $this->mockRepository
            ->shouldReceive('isMutualFollow')
            ->once()
            ->with(1, 2)
            ->andReturn(true);

        $this->mockRepository
            ->shouldReceive('isMutualFollow')
            ->once()
            ->with(1, 3)
            ->andReturn(false);

        // Act
        $result = $this->service->getFollowers($user);

        // Assert
        $this->assertCount(2, $result);
        $this->assertEquals('User 2', $result[0]['name']);
        $this->assertTrue($result[0]['is_mutual']);
        $this->assertEquals('User 3', $result[1]['name']);
        $this->assertFalse($result[1]['is_mutual']);
    }

    /** @test */
    public function it_gets_following_with_mutual_status()
    {
        // Arrange
        $user = User::factory()->make(['id' => 1]);
        $following1 = User::factory()->make(['id' => 2, 'name' => 'User 2', 'nickname' => 'user2', 'bio' => 'Bio 2']);
        $following2 = User::factory()->make(['id' => 3, 'name' => 'User 3', 'nickname' => 'user3', 'bio' => 'Bio 3']);

        // Mock: Get following
        $this->mockRepository
            ->shouldReceive('getFollowing')
            ->once()
            ->with(1)
            ->andReturn(collect([$following1, $following2]));

        // Mock: Check mutual for each following
        $this->mockRepository
            ->shouldReceive('isMutualFollow')
            ->once()
            ->with(1, 2)
            ->andReturn(true);

        $this->mockRepository
            ->shouldReceive('isMutualFollow')
            ->once()
            ->with(1, 3)
            ->andReturn(false);

        // Act
        $result = $this->service->getFollowing($user);

        // Assert
        $this->assertCount(2, $result);
        $this->assertEquals('User 2', $result[0]['name']);
        $this->assertTrue($result[0]['is_mutual']);
        $this->assertEquals('User 3', $result[1]['name']);
        $this->assertFalse($result[1]['is_mutual']);
    }
}
