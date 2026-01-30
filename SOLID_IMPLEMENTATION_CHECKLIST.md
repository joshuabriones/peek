# SOLID Implementation Checklist

Use this checklist when implementing SOLID principles for a new feature.

---

## 📋 Implementation Steps

### Phase 1: Planning

- [ ] Identify the feature to refactor
- [ ] Review current controller code
- [ ] Identify business logic vs HTTP logic
- [ ] Identify database queries
- [ ] List all methods needed in service
- [ ] List all methods needed in repository

---

### Phase 2: Create Interfaces

#### Service Interface
- [ ] Create `app/Contracts/{Feature}ServiceInterface.php`
- [ ] Define public methods for business operations
- [ ] Add PHPDoc comments for each method
- [ ] Define parameter types and return types
- [ ] Review: Does each method represent a business operation?

```php
<?php

namespace App\Contracts;

interface {Feature}ServiceInterface
{
    /**
     * Description of what this does
     *
     * @param Type $param
     * @return Type
     */
    public function methodName(Type $param): Type;
}
```

#### Repository Interface
- [ ] Create `app/Contracts/{Feature}RepositoryInterface.php`
- [ ] Define public methods for data operations
- [ ] Add PHPDoc comments for each method
- [ ] Define parameter types and return types
- [ ] Review: Does each method represent a database operation?

```php
<?php

namespace App\Contracts;

interface {Feature}RepositoryInterface
{
    /**
     * Description of what this does
     *
     * @param Type $param
     * @return Type
     */
    public function methodName(Type $param): Type;
}
```

---

### Phase 3: Create Repository Implementation

- [ ] Create `app/Repositories/{Feature}Repository.php`
- [ ] Implement `{Feature}RepositoryInterface`
- [ ] Move all database queries from controller
- [ ] Use Eloquent models for queries
- [ ] Add proper return types
- [ ] Review: No business logic in repository?
- [ ] Review: Only database operations?

```php
<?php

namespace App\Repositories;

use App\Contracts\{Feature}RepositoryInterface;

class {Feature}Repository implements {Feature}RepositoryInterface
{
    public function methodName(Type $param): Type
    {
        // Database operations only
        return Model::query()->get();
    }
}
```

**Repository Checklist:**
- [ ] ✅ Only database queries
- [ ] ✅ No business logic
- [ ] ✅ No HTTP concerns
- [ ] ✅ Returns models or collections
- [ ] ✅ Simple, focused methods

---

### Phase 4: Create Service Implementation

- [ ] Create `app/Services/{Feature}Service.php`
- [ ] Implement `{Feature}ServiceInterface`
- [ ] Inject `{Feature}RepositoryInterface` in constructor
- [ ] Move all business logic from controller
- [ ] Add validation logic
- [ ] Orchestrate repository calls
- [ ] Transform data for response
- [ ] Review: No HTTP concerns in service?
- [ ] Review: No direct database queries?

```php
<?php

namespace App\Services;

use App\Contracts\{Feature}ServiceInterface;
use App\Contracts\{Feature}RepositoryInterface;

class {Feature}Service implements {Feature}ServiceInterface
{
    public function __construct(
        private {Feature}RepositoryInterface $repository
    ) {}

    public function methodName(Type $param): Type
    {
        // 1. Validate business rules
        if (/* validation */) {
            throw new InvalidArgumentException('Error message');
        }

        // 2. Call repository
        $result = $this->repository->methodName($param);

        // 3. Transform data
        return [
            'key' => 'value',
        ];
    }
}
```

**Service Checklist:**
- [ ] ✅ Contains business logic
- [ ] ✅ Validates business rules
- [ ] ✅ Orchestrates repository calls
- [ ] ✅ No HTTP concerns
- [ ] ✅ No direct database queries
- [ ] ✅ Returns arrays or DTOs

---

### Phase 5: Refactor Controller

- [ ] Open `app/Http/Controllers/{Feature}Controller.php`
- [ ] Add constructor with `{Feature}ServiceInterface` injection
- [ ] Replace business logic with service calls
- [ ] Remove direct database queries
- [ ] Keep only HTTP concerns
- [ ] Handle exceptions appropriately
- [ ] Return JSON responses
- [ ] Review: Controller is thin?

```php
<?php

namespace App\Http\Controllers;

use App\Contracts\{Feature}ServiceInterface;
use Illuminate\Http\JsonResponse;

class {Feature}Controller extends Controller
{
    public function __construct(
        private {Feature}ServiceInterface $service
    ) {}

    public function methodName(Type $param): JsonResponse
    {
        try {
            $result = $this->service->methodName($param);
            return response()->json($result);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
```

**Controller Checklist:**
- [ ] ✅ Only HTTP concerns
- [ ] ✅ No business logic
- [ ] ✅ No database queries
- [ ] ✅ Catches exceptions
- [ ] ✅ Returns JSON responses
- [ ] ✅ Thin and simple

---

### Phase 6: Create Service Provider

- [ ] Create `app/Providers/{Feature}ServiceProvider.php`
- [ ] Bind repository interface to implementation
- [ ] Bind service interface to implementation
- [ ] Review: Both bindings present?

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class {Feature}ServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            {Feature}RepositoryInterface::class,
            {Feature}Repository::class
        );

        $this->app->bind(
            {Feature}ServiceInterface::class,
            {Feature}Service::class
        );
    }
}
```

---

### Phase 7: Register Service Provider

- [ ] Open `bootstrap/providers.php`
- [ ] Add `App\Providers\{Feature}ServiceProvider::class` to array
- [ ] Save file

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Providers\{Feature}ServiceProvider::class, // Add this
];
```

---

### Phase 8: Testing

#### Test Repository
- [ ] Create `tests/Feature/Repositories/{Feature}RepositoryTest.php`
- [ ] Test each public method
- [ ] Use real database (RefreshDatabase)
- [ ] Test edge cases
- [ ] Run tests: `php artisan test --filter={Feature}Repository`

```php
class {Feature}RepositoryTest extends TestCase
{
    use RefreshDatabase;

    private {Feature}Repository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new {Feature}Repository();
    }

    /** @test */
    public function it_does_something()
    {
        // Arrange
        // Act
        // Assert
    }
}
```

#### Test Service
- [ ] Create `tests/Feature/Services/{Feature}ServiceTest.php`
- [ ] Test each public method
- [ ] Mock repository dependencies
- [ ] Test business logic
- [ ] Test validation rules
- [ ] Test edge cases
- [ ] Run tests: `php artisan test --filter={Feature}Service`

```php
class {Feature}ServiceTest extends TestCase
{
    private {Feature}RepositoryInterface $mockRepository;
    private {Feature}Service $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->mockRepository = Mockery::mock({Feature}RepositoryInterface::class);
        $this->service = new {Feature}Service($this->mockRepository);
    }

    /** @test */
    public function it_validates_business_rule()
    {
        // Arrange
        // Assert
        $this->expectException(InvalidArgumentException::class);
        // Act
    }
}
```

#### Test Controller
- [ ] Create or update `tests/Feature/{Feature}Test.php`
- [ ] Test HTTP endpoints
- [ ] Test status codes
- [ ] Test JSON responses
- [ ] Run tests: `php artisan test --filter={Feature}`

```php
class {Feature}Test extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_returns_json_response()
    {
        $this->actingAs(User::factory()->create());
        
        $response = $this->postJson('/api/endpoint');
        
        $response->assertStatus(200)
                ->assertJson([...]);
    }
}
```

---

### Phase 9: Verification

#### Code Quality
- [ ] Run linter: `./vendor/bin/pint`
- [ ] Check for linter errors
- [ ] Fix any errors
- [ ] Review code for SOLID violations

#### Functionality
- [ ] Test all API endpoints manually
- [ ] Verify responses match previous behavior
- [ ] Check for breaking changes
- [ ] Test edge cases

#### Tests
- [ ] Run all tests: `php artisan test`
- [ ] Ensure all tests pass
- [ ] Check test coverage
- [ ] Add missing tests

---

### Phase 10: Documentation

- [ ] Update feature documentation
- [ ] Document new architecture
- [ ] Add inline code comments
- [ ] Update API documentation if needed
- [ ] Note any breaking changes

---

## 🎯 SOLID Principles Verification

After completing implementation, verify each principle:

### ✅ Single Responsibility Principle (SRP)
- [ ] Controller only handles HTTP?
- [ ] Service only handles business logic?
- [ ] Repository only handles database?
- [ ] Each class has one reason to change?

### ✅ Open/Closed Principle (OCP)
- [ ] Can add new implementations without modifying existing code?
- [ ] Interfaces allow extension points?
- [ ] New features can be added without changing current classes?

### ✅ Liskov Substitution Principle (LSP)
- [ ] Any implementation can be swapped?
- [ ] Service works with any repository implementation?
- [ ] Controller works with any service implementation?

### ✅ Interface Segregation Principle (ISP)
- [ ] Interfaces are focused and specific?
- [ ] No "god interfaces" with unrelated methods?
- [ ] Each interface represents a cohesive set of operations?

### ✅ Dependency Inversion Principle (DIP)
- [ ] Controller depends on service interface (not concrete class)?
- [ ] Service depends on repository interface (not concrete class)?
- [ ] Dependencies injected via constructor?
- [ ] Laravel container handles dependency injection?

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
- [ ] Don't put business logic in controller
- [ ] Don't query database directly in service
- [ ] Don't depend on concrete classes
- [ ] Don't mix HTTP concerns with business logic
- [ ] Don't create "god classes" with too many responsibilities
- [ ] Don't forget to register service provider
- [ ] Don't skip writing tests
- [ ] Don't modify existing interfaces (create new ones)

### ✅ DO:
- [ ] Keep controllers thin
- [ ] Isolate business logic in services
- [ ] Isolate database logic in repositories
- [ ] Depend on interfaces
- [ ] Use dependency injection
- [ ] Write tests for each layer
- [ ] Follow naming conventions
- [ ] Add PHPDoc comments

---

## 📁 File Structure Checklist

After implementation, verify this structure exists:

```
app/
├── Contracts/
│   ├── {Feature}ServiceInterface.php       ✅
│   └── {Feature}RepositoryInterface.php    ✅
│
├── Services/
│   └── {Feature}Service.php                ✅
│
├── Repositories/
│   └── {Feature}Repository.php             ✅
│
├── Http/Controllers/
│   └── {Feature}Controller.php             ✅ (refactored)
│
└── Providers/
    └── {Feature}ServiceProvider.php        ✅

tests/
├── Feature/
│   ├── Services/
│   │   └── {Feature}ServiceTest.php        ✅
│   └── Repositories/
│       └── {Feature}RepositoryTest.php     ✅

bootstrap/
└── providers.php                            ✅ (updated)
```

---

## 🎉 Completion Checklist

- [ ] All interfaces created
- [ ] All implementations created
- [ ] Controller refactored
- [ ] Service provider created and registered
- [ ] Repository tests written and passing
- [ ] Service tests written and passing
- [ ] Controller tests written and passing
- [ ] All linter errors fixed
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] SOLID principles verified
- [ ] Code reviewed
- [ ] Ready to deploy

---

## 📚 Reference Documents

- `SOLID_ARCHITECTURE_BLUEPRINT.md` - Comprehensive guide
- `SOLID_QUICK_REFERENCE.md` - Quick reference
- `SOLID_BEFORE_AFTER_COMPARISON.md` - Visual comparison
- `SOLID_IMPLEMENTATION_SUMMARY.md` - Implementation summary
- Follow Feature Code - Working example

---

## 🚀 Next Features to Refactor

Priority order:

1. [ ] Message Feature (high complexity)
2. [ ] User Profile Feature (medium complexity)
3. [ ] Map/Location Feature (medium complexity)
4. [ ] Settings Features (low complexity)

---

**Remember**: Use the Follow feature as your reference implementation! 💡
