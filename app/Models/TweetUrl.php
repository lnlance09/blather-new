<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TweetUrl extends Model
{
    use HasFactory;

    protected $table = 'tweets_urls';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tweet_id',
        'url',
        'description',
        'image',
        'title'
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
    protected $casts = [];

    public function tweet()
    {
        return $this->hasOne(Tweet::class, 'id', 'tweet_id');
    }
}
