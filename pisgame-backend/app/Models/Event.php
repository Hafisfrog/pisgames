<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'sport_id',
        'name',
        'category',
        'gender',
        'event_date',
        'status',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function sport(): BelongsTo
    {
        return $this->belongsTo(Sport::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }
}
