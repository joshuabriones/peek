<?php

namespace Tests\Feature\Repositories;

use App\Models\Follow;
use App\Models\User;
use App\Repositories\FollowRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Example tests for FollowRepository
 * 
 * These tests demonstrate how to test the Repository layer
 * with actual database interactions
 */
class FollowRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private FollowRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new FollowRepository();
    }

    /** @test */
    public function it_creates_a_follow_relationship()
    {
        // Arrange
        $follower = User::factory()->create();
        $following = User::factory()->create();

        // Act
        $follow = $this->repository->create($follower->id, $following->id);

        // Assert
        $this->assertInstanceOf(Follow::class, $follow);
        $this->assertDatabaseHas('follows', [
            'follower_id' => $follower->id,
            'following_id' => $following->id,
        ]);
    }

    /** @test */
    public function it_deletes_a_follow_relationship()
    {
        // Arrange
        $follower = User::factory()->create();
        $following = User::factory()->create();
        $this->repository->create($follower->id, $following->id);

        // Act
        $result = $this->repository->delete($follower->id, $following->id);

        // Assert
        $this->assertTrue($result);
        $this->assertDatabaseMissing('follows', [
            'follower_id' => $follower->id,
            'following_id' => $following->id,
        ]);
    }

    /** @test */
    public function it_returns_false_when_deleting_non_existent_follow()
    {
        // Arrange
        $follower = User::factory()->create();
        $following = User::factory()->create();

        // Act
        $result = $this->repository->delete($follower->id, $following->id);

        // Assert
        $this->assertFalse($result);
    }

    /** @test */
    public function it_checks_if_user_is_following_another_user()
    {
        // Arrange
        $follower = User::factory()->create();
        $following = User::factory()->create();
        $notFollowing = User::factory()->create();

        $this->repository->create($follower->id, $following->id);

        // Act & Assert
        $this->assertTrue($this->repository->isFollowing($follower->id, $following->id));
        $this->assertFalse($this->repository->isFollowing($follower->id, $notFollowing->id));
    }

    /** @test */
    public function it_checks_if_user_is_followed_by_another_user()
    {
        // Arrange
        $user = User::factory()->create();
        $follower = User::factory()->create();
        $notFollower = User::factory()->create();

        $this->repository->create($follower->id, $user->id);

        // Act & Assert
        $this->assertTrue($this->repository->isFollowedBy($user->id, $follower->id));
        $this->assertFalse($this->repository->isFollowedBy($user->id, $notFollower->id));
    }

    /** @test */
    public function it_checks_mutual_follow_relationship()
    {
        // Arrange
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        // User1 follows User2
        $this->repository->create($user1->id, $user2->id);
        
        // User2 follows User1 (mutual)
        $this->repository->create($user2->id, $user1->id);
        
        // User3 follows User1 (not mutual)
        $this->repository->create($user3->id, $user1->id);

        // Act & Assert
        $this->assertTrue($this->repository->isMutualFollow($user1->id, $user2->id));
        $this->assertTrue($this->repository->isMutualFollow($user2->id, $user1->id));
        $this->assertFalse($this->repository->isMutualFollow($user1->id, $user3->id));
    }

    /** @test */
    public function it_gets_all_followers_of_a_user()
    {
        // Arrange
        $user = User::factory()->create(['name' => 'Main User']);
        $follower1 = User::factory()->create(['name' => 'Follower 1']);
        $follower2 = User::factory()->create(['name' => 'Follower 2']);
        $notFollower = User::factory()->create(['name' => 'Not Follower']);

        $this->repository->create($follower1->id, $user->id);
        $this->repository->create($follower2->id, $user->id);

        // Act
        $followers = $this->repository->getFollowers($user->id);

        // Assert
        $this->assertCount(2, $followers);
        $this->assertTrue($followers->contains('name', 'Follower 1'));
        $this->assertTrue($followers->contains('name', 'Follower 2'));
        $this->assertFalse($followers->contains('name', 'Not Follower'));
    }

    /** @test */
    public function it_gets_all_users_being_followed()
    {
        // Arrange
        $user = User::factory()->create(['name' => 'Main User']);
        $following1 = User::factory()->create(['name' => 'Following 1']);
        $following2 = User::factory()->create(['name' => 'Following 2']);
        $notFollowing = User::factory()->create(['name' => 'Not Following']);

        $this->repository->create($user->id, $following1->id);
        $this->repository->create($user->id, $following2->id);

        // Act
        $following = $this->repository->getFollowing($user->id);

        // Assert
        $this->assertCount(2, $following);
        $this->assertTrue($following->contains('name', 'Following 1'));
        $this->assertTrue($following->contains('name', 'Following 2'));
        $this->assertFalse($following->contains('name', 'Not Following'));
    }

    /** @test */
    public function it_counts_followers_correctly()
    {
        // Arrange
        $user = User::factory()->create();
        $follower1 = User::factory()->create();
        $follower2 = User::factory()->create();
        $follower3 = User::factory()->create();

        $this->repository->create($follower1->id, $user->id);
        $this->repository->create($follower2->id, $user->id);
        $this->repository->create($follower3->id, $user->id);

        // Act
        $count = $this->repository->countFollowers($user->id);

        // Assert
        $this->assertEquals(3, $count);
    }

    /** @test */
    public function it_counts_following_correctly()
    {
        // Arrange
        $user = User::factory()->create();
        $following1 = User::factory()->create();
        $following2 = User::factory()->create();
        $following3 = User::factory()->create();

        $this->repository->create($user->id, $following1->id);
        $this->repository->create($user->id, $following2->id);
        $this->repository->create($user->id, $following3->id);

        // Act
        $count = $this->repository->countFollowing($user->id);

        // Assert
        $this->assertEquals(3, $count);
    }

    /** @test */
    public function it_returns_zero_when_user_has_no_followers()
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $count = $this->repository->countFollowers($user->id);

        // Assert
        $this->assertEquals(0, $count);
    }

    /** @test */
    public function it_returns_zero_when_user_is_not_following_anyone()
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $count = $this->repository->countFollowing($user->id);

        // Assert
        $this->assertEquals(0, $count);
    }

    /** @test */
    public function it_handles_complex_follow_scenarios()
    {
        // Arrange
        $user1 = User::factory()->create(['name' => 'User 1']);
        $user2 = User::factory()->create(['name' => 'User 2']);
        $user3 = User::factory()->create(['name' => 'User 3']);
        $user4 = User::factory()->create(['name' => 'User 4']);

        // User1 follows: User2, User3, User4
        $this->repository->create($user1->id, $user2->id);
        $this->repository->create($user1->id, $user3->id);
        $this->repository->create($user1->id, $user4->id);

        // User2 follows: User1 (mutual with User1)
        $this->repository->create($user2->id, $user1->id);

        // User3 follows: User1 (mutual with User1), User4
        $this->repository->create($user3->id, $user1->id);
        $this->repository->create($user3->id, $user4->id);

        // User4 follows: User1 (mutual with User1), User2, User3 (mutual with User3)
        $this->repository->create($user4->id, $user1->id);
        $this->repository->create($user4->id, $user2->id);
        $this->repository->create($user4->id, $user3->id);

        // Act & Assert
        $this->assertEquals(3, $this->repository->countFollowing($user1->id));
        $this->assertEquals(3, $this->repository->countFollowers($user1->id));
        
        $this->assertTrue($this->repository->isMutualFollow($user1->id, $user2->id));
        $this->assertTrue($this->repository->isMutualFollow($user1->id, $user3->id));
        $this->assertTrue($this->repository->isMutualFollow($user1->id, $user4->id));
        $this->assertTrue($this->repository->isMutualFollow($user3->id, $user4->id));
        
        $this->assertFalse($this->repository->isMutualFollow($user2->id, $user3->id));
        $this->assertFalse($this->repository->isMutualFollow($user2->id, $user4->id));
    }
}
