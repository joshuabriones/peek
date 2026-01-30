# SOLID Architecture - Quick Reference

## Request Flow Diagram

```
HTTP Request
    ↓
┌─────────────────────────────────────┐
│  FollowController                   │
│  (HTTP Layer)                       │
│  - Receives request                 │
│  - Returns JSON response            │
│  - Handles exceptions               │
└─────────────────────────────────────┘
    ↓ depends on
┌─────────────────────────────────────┐
│  FollowServiceInterface             │  ← Interface (Contract)
└─────────────────────────────────────┘
    ↓ implemented by
┌─────────────────────────────────────┐
│  FollowService                      │
│  (Business Logic Layer)             │
│  - Validates business rules         │
│  - Orchestrates operations          │
│  - Transforms data                  │
└─────────────────────────────────────┘
    ↓ depends on
┌─────────────────────────────────────┐
│  FollowRepositoryInterface          │  ← Interface (Contract)
└─────────────────────────────────────┘
    ↓ implemented by
┌─────────────────────────────────────┐
│  FollowRepository                   │
│  (Data Access Layer)                │
│  - CRUD operations                  │
│  - Database queries                 │
│  - Eloquent interactions            │
└─────────────────────────────────────┘
    ↓ uses
┌─────────────────────────────────────┐
│  Follow Model                       │
│  (Eloquent ORM)                     │
└─────────────────────────────────────┘
    ↓
Database
```

---

## Directory Structure

```
app/
│
├── Contracts/                          # Interfaces (Contracts)
│   ├── FollowServiceInterface.php     # Service contract
│   └── FollowRepositoryInterface.php  # Repository contract
│
├── Services/                           # Business Logic
│   └── FollowService.php              # Implements FollowServiceInterface
│
├── Repositories/                       # Data Access
│   └── FollowRepository.php           # Implements FollowRepositoryInterface
│
├── Http/
│   └── Controllers/
│       └── FollowController.php       # HTTP request/response handling
│
├── Models/
│   └── Follow.php                     # Eloquent model
│
└── Providers/
    └── FollowServiceProvider.php      # Dependency injection bindings
```

---

## Code Example Flow

### 1. Route receives request
```php
Route::post('/api/users/{user}/follow', [FollowController::class, 'follow']);
```

### 2. Controller handles HTTP
```php
class FollowController extends Controller
{
    public function __construct(
        private FollowServiceInterface $followService  // ← Depends on interface
    ) {}

    public function follow(User $user): JsonResponse
    {
        $result = $this->followService->follow(Auth::user(), $user);
        return response()->json($result);
    }
}
```

### 3. Service executes business logic
```php
class FollowService implements FollowServiceInterface
{
    public function __construct(
        private FollowRepositoryInterface $followRepository  // ← Depends on interface
    ) {}

    public function follow(User $follower, User $following): array
    {
        // Validation
        if ($follower->id === $following->id) {
            throw new InvalidArgumentException('Cannot follow yourself');
        }

        // Create follow
        $this->followRepository->create($follower->id, $following->id);

        // Check mutual
        $isMutual = $this->followRepository->isMutualFollow(
            $follower->id, 
            $following->id
        );

        // Return result
        return [
            'message' => 'User followed successfully',
            'is_following' => true,
            'is_mutual' => $isMutual,
        ];
    }
}
```

### 4. Repository handles database
```php
class FollowRepository implements FollowRepositoryInterface
{
    public function create(int $followerId, int $followingId): Follow
    {
        return Follow::create([
            'follower_id' => $followerId,
            'following_id' => $followingId,
        ]);
    }

    public function isMutualFollow(int $userId1, int $userId2): bool
    {
        return $this->isFollowing($userId1, $userId2) 
            && $this->isFollowing($userId2, $userId1);
    }
}
```

### 5. Service Provider binds interfaces
```php
class FollowServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            FollowRepositoryInterface::class,
            FollowRepository::class
        );

        $this->app->bind(
            FollowServiceInterface::class,
            FollowService::class
        );
    }
}
```

---

## SOLID Principles Checklist

### ✅ Single Responsibility Principle (SRP)
- Controller: HTTP only
- Service: Business logic only
- Repository: Database only

### ✅ Open/Closed Principle (OCP)
- Open for extension (create new implementations)
- Closed for modification (don't change existing code)

### ✅ Liskov Substitution Principle (LSP)
- Any implementation of interface can be swapped
- Behavior remains correct

### ✅ Interface Segregation Principle (ISP)
- Small, focused interfaces
- No bloated "god interfaces"

### ✅ Dependency Inversion Principle (DIP)
- Depend on abstractions (interfaces)
- Not concrete implementations
- Use constructor injection

---

## Quick Implementation Checklist

When creating a new feature:

- [ ] Create `{Feature}ServiceInterface` in `app/Contracts/`
- [ ] Create `{Feature}RepositoryInterface` in `app/Contracts/`
- [ ] Create `{Feature}Service` in `app/Services/`
- [ ] Create `{Feature}Repository` in `app/Repositories/`
- [ ] Refactor or create `{Feature}Controller`
- [ ] Create `{Feature}ServiceProvider` in `app/Providers/`
- [ ] Register provider in `bootstrap/providers.php`
- [ ] Write tests for each layer

---

## Testing Each Layer

```php
// Test Repository (with database)
class FollowRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_follow()
    {
        $repo = new FollowRepository();
        $follow = $repo->create(1, 2);
        
        $this->assertDatabaseHas('follows', [
            'follower_id' => 1,
            'following_id' => 2,
        ]);
    }
}

// Test Service (with mocked repository)
class FollowServiceTest extends TestCase
{
    public function test_cannot_follow_yourself()
    {
        $mockRepo = Mockery::mock(FollowRepositoryInterface::class);
        $service = new FollowService($mockRepo);
        
        $user = User::factory()->make(['id' => 1]);
        
        $this->expectException(InvalidArgumentException::class);
        $service->follow($user, $user);
    }
}

// Test Controller (with mocked service)
class FollowControllerTest extends TestCase
{
    public function test_follow_endpoint()
    {
        $mockService = Mockery::mock(FollowServiceInterface::class);
        $mockService->shouldReceive('follow')->once()->andReturn([
            'message' => 'Success',
            'is_following' => true,
            'is_mutual' => false,
        ]);
        
        $this->app->instance(FollowServiceInterface::class, $mockService);
        
        $response = $this->postJson('/api/users/2/follow');
        $response->assertStatus(200);
    }
}
```

---

## Common Pitfalls to Avoid

❌ **Don't put business logic in Controller**
```php
// BAD
public function follow(User $user) {
    if (Auth::id() === $user->id) { // Business logic in controller
        return response()->json(['error' => 'Cannot follow yourself']);
    }
}
```

✅ **Put business logic in Service**
```php
// GOOD - Controller
public function follow(User $user) {
    return $this->followService->follow(Auth::user(), $user);
}

// GOOD - Service
public function follow(User $follower, User $following) {
    if ($follower->id === $following->id) {
        throw new InvalidArgumentException('Cannot follow yourself');
    }
}
```

---

❌ **Don't query database directly in Service**
```php
// BAD - Service
public function follow(User $follower, User $following) {
    Follow::create([...]);  // Direct model query in service
}
```

✅ **Use Repository for database operations**
```php
// GOOD - Service
public function follow(User $follower, User $following) {
    $this->followRepository->create($follower->id, $following->id);
}

// GOOD - Repository
public function create(int $followerId, int $followingId): Follow {
    return Follow::create([
        'follower_id' => $followerId,
        'following_id' => $followingId,
    ]);
}
```

---

❌ **Don't depend on concrete classes**
```php
// BAD - Depends on concrete class
public function __construct(private FollowService $followService) {}
```

✅ **Depend on interfaces**
```php
// GOOD - Depends on interface
public function __construct(private FollowServiceInterface $followService) {}
```

---

## Benefits Summary

| Benefit | Description |
|---------|-------------|
| **Testability** | Each layer can be tested independently with mocks |
| **Maintainability** | Clear separation makes bugs easy to locate |
| **Extensibility** | Add features without modifying existing code |
| **Flexibility** | Swap implementations easily (e.g., add caching) |
| **Scalability** | Architecture supports growing complexity |
| **Team Collaboration** | Clear boundaries for different developers |

---

## Next Steps

1. Review the refactored Follow feature
2. Test all endpoints to ensure functionality
3. Use this blueprint for next feature (e.g., Message feature)
4. Write tests for each layer
5. Document any feature-specific variations

---

**Remember**: Start with the interface, implement the repository, build the service, then connect the controller!
