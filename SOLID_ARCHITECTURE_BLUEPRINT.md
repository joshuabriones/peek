# SOLID Principles Implementation Blueprint

## Overview
This document demonstrates the implementation of SOLID principles in the **Follow Feature** as a blueprint for future features.

---

## Architecture Structure

```
Follow Feature
├── Controller Layer          (FollowController)
├── Service Layer            (FollowService + Interface)
├── Repository Layer         (FollowRepository + Interface)
└── Model Layer              (Follow, User)
```

---

## SOLID Principles Applied

### 1. **S** - Single Responsibility Principle (SRP)
Each class has ONE reason to change:

- **FollowController**: Handle HTTP requests/responses only
- **FollowService**: Manage business logic and rules
- **FollowRepository**: Handle database operations only
- **Model**: Represent data structure

### 2. **O** - Open/Closed Principle (OCP)
The system is open for extension, closed for modification:

- Interfaces allow new implementations without changing existing code
- Example: Can create `CachedFollowRepository` implementing `FollowRepositoryInterface` without modifying existing code

### 3. **L** - Liskov Substitution Principle (LSP)
Any implementation of interfaces can be swapped without breaking functionality:

- `FollowService` depends on `FollowRepositoryInterface`, not concrete implementation
- Any class implementing `FollowRepositoryInterface` can be used

### 4. **I** - Interface Segregation Principle (ISP)
Interfaces are focused and specific:

- `FollowServiceInterface`: Only follow-related business operations
- `FollowRepositoryInterface`: Only follow-related data operations
- No "god interfaces" with unrelated methods

### 5. **D** - Dependency Inversion Principle (DIP)
High-level modules depend on abstractions, not concrete implementations:

- **Controller** depends on `FollowServiceInterface` (not `FollowService`)
- **Service** depends on `FollowRepositoryInterface` (not `FollowRepository`)
- Dependencies are injected through constructor (Dependency Injection)

---

## File Structure

```
app/
├── Contracts/
│   ├── FollowServiceInterface.php       # Service contract
│   └── FollowRepositoryInterface.php    # Repository contract
│
├── Services/
│   └── FollowService.php                # Business logic implementation
│
├── Repositories/
│   └── FollowRepository.php             # Database operations implementation
│
├── Http/Controllers/
│   └── FollowController.php             # HTTP layer (thin controller)
│
├── Models/
│   └── Follow.php                       # Eloquent model
│
└── Providers/
    └── FollowServiceProvider.php        # Dependency injection bindings
```

---

## Layer Responsibilities

### 1. Controller Layer (`FollowController.php`)
**Responsibility**: Handle HTTP requests and responses

```php
class FollowController extends Controller
{
    public function __construct(
        private FollowServiceInterface $followService
    ) {}

    public function follow(User $user): JsonResponse
    {
        try {
            $result = $this->followService->follow(Auth::user(), $user);
            return response()->json($result);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
```

**What it does:**
- Receives HTTP request
- Validates route model binding (User)
- Calls service layer
- Returns JSON response
- Handles exceptions and converts to HTTP responses

**What it does NOT do:**
- Business logic (delegated to Service)
- Database queries (delegated to Repository)
- Data transformation logic (delegated to Service)

---

### 2. Service Layer (`FollowService.php`)
**Responsibility**: Business logic and orchestration

```php
class FollowService implements FollowServiceInterface
{
    public function __construct(
        private FollowRepositoryInterface $followRepository
    ) {}

    public function follow(User $follower, User $following): array
    {
        // Business rule: Can't follow yourself
        if ($follower->id === $following->id) {
            throw new InvalidArgumentException('You cannot follow yourself');
        }

        // Business rule: Check if already following
        if ($this->followRepository->isFollowing($follower->id, $following->id)) {
            throw new InvalidArgumentException('Already following this user');
        }

        // Execute operation
        $this->followRepository->create($follower->id, $following->id);

        // Check mutual follow status
        $isMutual = $this->followRepository->isMutualFollow($follower->id, $following->id);

        // Return result
        return [
            'message' => 'User followed successfully',
            'is_following' => true,
            'is_mutual' => $isMutual,
        ];
    }
}
```

**What it does:**
- Validates business rules
- Orchestrates multiple repository calls
- Transforms data for presentation
- Contains domain logic

**What it does NOT do:**
- HTTP concerns (no Request/Response objects)
- Direct database queries (uses Repository)
- Model instantiation for queries

---

### 3. Repository Layer (`FollowRepository.php`)
**Responsibility**: Database operations only

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

    public function isFollowing(int $followerId, int $followingId): bool
    {
        return Follow::where('follower_id', $followerId)
            ->where('following_id', $followingId)
            ->exists();
    }
}
```

**What it does:**
- CRUD operations
- Database queries
- Data retrieval and persistence
- Eloquent model interactions

**What it does NOT do:**
- Business logic validation
- Data transformation for presentation
- HTTP concerns

---

### 4. Service Provider (`FollowServiceProvider.php`)
**Responsibility**: Dependency injection bindings

```php
class FollowServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind Repository Interface to Implementation
        $this->app->bind(
            FollowRepositoryInterface::class,
            FollowRepository::class
        );

        // Bind Service Interface to Implementation
        $this->app->bind(
            FollowServiceInterface::class,
            FollowService::class
        );
    }
}
```

**What it does:**
- Maps interfaces to concrete implementations
- Configures dependency injection container
- Registered in `bootstrap/providers.php`

---

## Benefits of This Architecture

### 1. **Testability**
Each layer can be tested independently:

```php
// Test Service with mocked Repository
$mockRepo = Mockery::mock(FollowRepositoryInterface::class);
$service = new FollowService($mockRepo);

// Test Controller with mocked Service
$mockService = Mockery::mock(FollowServiceInterface::class);
$controller = new FollowController($mockService);
```

### 2. **Maintainability**
- Clear separation of concerns
- Easy to locate and fix bugs
- Changes in one layer don't affect others

### 3. **Extensibility**
Add new features without modifying existing code:

```php
// Add caching without changing existing code
class CachedFollowRepository implements FollowRepositoryInterface
{
    public function __construct(
        private FollowRepository $repository,
        private CacheInterface $cache
    ) {}

    public function isFollowing(int $followerId, int $followingId): bool
    {
        return $this->cache->remember("follow_{$followerId}_{$followingId}", function() {
            return $this->repository->isFollowing($followerId, $followingId);
        });
    }
}
```

### 4. **Flexibility**
Swap implementations easily:

```php
// Use different storage mechanism
class RedisFollowRepository implements FollowRepositoryInterface
{
    // Same interface, different implementation
}
```

---

## Blueprint for Future Features

Use this structure for new features:

### Step 1: Create Interfaces
```
app/Contracts/
├── {Feature}ServiceInterface.php
└── {Feature}RepositoryInterface.php
```

### Step 2: Create Implementations
```
app/Services/
└── {Feature}Service.php

app/Repositories/
└── {Feature}Repository.php
```

### Step 3: Create Controller
```
app/Http/Controllers/
└── {Feature}Controller.php
```

### Step 4: Create Service Provider
```
app/Providers/
└── {Feature}ServiceProvider.php
```

### Step 5: Register Provider
Add to `bootstrap/providers.php`:
```php
App\Providers\{Feature}ServiceProvider::class,
```

---

## Example: Apply to Message Feature

Following the blueprint, you would create:

```
app/
├── Contracts/
│   ├── MessageServiceInterface.php
│   └── MessageRepositoryInterface.php
├── Services/
│   └── MessageService.php
├── Repositories/
│   └── MessageRepository.php
├── Http/Controllers/
│   └── MessageController.php (refactored)
└── Providers/
    └── MessageServiceProvider.php
```

---

## Key Takeaways

1. **Thin Controllers**: Only handle HTTP concerns
2. **Business Logic in Services**: All domain rules and orchestration
3. **Data Access in Repositories**: All database operations
4. **Interfaces Everywhere**: Program to interfaces, not implementations
5. **Dependency Injection**: Constructor injection for all dependencies
6. **Service Providers**: Bind interfaces to implementations

---

## Testing Strategy

### Unit Tests
- **Repository**: Test database operations with in-memory database
- **Service**: Test business logic with mocked repository
- **Controller**: Test HTTP layer with mocked service

### Integration Tests
- Test full stack with real database

### Example Service Test
```php
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
```

---

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy testing at every layer
- ✅ Simple to extend without modifying existing code
- ✅ Flexible to swap implementations
- ✅ Maintainable codebase that scales

Use this **Follow Feature** as your blueprint for implementing other features with SOLID principles!
