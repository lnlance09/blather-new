<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class FallacyTwitter extends Model
{
    use HasFactory;

    protected $table = 'fallacies_twitter';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fallacy_id',
        'highlighted_text',
        'tweet_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        
    ];

    public function fallacy()
    {
        return $this->belongsTo(Fallacy::class, 'id', 'fallacy_id');
    }

    public function tweet()
    {
        return $this->hasOne(Tweet::class, 'id', 'tweet_id');
    }
}
