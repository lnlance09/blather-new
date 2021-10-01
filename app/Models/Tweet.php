<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tweet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_text',
        'page_id',
        'tweet_id',
        'entities',
        'extended_entities',
        'favorite_count',
        'retweet_count',

        'quoted_full_text',
        'quoted_fpage_id',
        'quoted_ftweet_id',
        'quoted_fentities',
        'quoted_fextended_entities',
        'quoted_ffavorite_count',
        'quoted_fretweet_count',

        'retweeted_full_text',
        'retweeted_fpage_id',
        'retweeted_ftweet_id',
        'retweeted_fentities',
        'retweeted_fextended_entities',
        'retweeted_ffavorite_count',
        'retweeted_fretweet_count',

        'tweet_json'
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

    public function fallacies()
    {
        return $this->hasMany(FallacyTwitter::class);
    }
}
