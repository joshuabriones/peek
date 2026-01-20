<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Message extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'latitude',
        'longitude',
        'tag',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reads(): HasMany
    {
        return $this->hasMany(MessageRead::class);
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', now()->toDateString());
    }

    public function scopeTopToday(Builder $query, int $limit = 10): Builder
    {
        return $query->today()
            ->withCount('reads')
            ->orderByDesc('reads_count')
            ->limit($limit);
    }
}

