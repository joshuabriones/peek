<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nickname',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_message_date' => 'date',
        ];
    }

    // Relationships
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function messageReads(): HasMany
    {
        return $this->hasMany(MessageRead::class);
    }

    public function unlockedProfiles(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'unlocked_profiles',
            'user_id',
            'unlocked_user_id'
        )->withTimestamps();
    }

    public function unlockedBy(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'unlocked_profiles',
            'unlocked_user_id',
            'user_id'
        )->withTimestamps();
    }

    // Methods
    public function canPostMessageToday(): bool
    {
        $today = now()->toDateString();
        $messagesPostedToday = $this->messages()
            ->whereDate('created_at', $today)
            ->count();

        return $messagesPostedToday < 2;
    }

    public function messagesTodayRemaining(): int
    {
        $today = now()->toDateString();
        $messagesPostedToday = $this->messages()
            ->whereDate('created_at', $today)
            ->count();

        return max(0, 2 - $messagesPostedToday);
    }

    public function hasReadUsersMessages(User $user): int
    {
        return $this->messageReads()
            ->whereHas('message', fn($q) => $q->where('user_id', $user->id))
            ->distinct('message_id')
            ->count();
    }
}
