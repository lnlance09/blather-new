<?php

namespace App\Models;

use App\Models\FallacyTwitter;
use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

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
        'quoted_page_id',
        'quoted_tweet_id',
        'quoted_entities',
        'quoted_extended_entities',
        'quoted_favorite_count',
        'quoted_retweet_count',
        'quoted_created_at',

        'retweeted_full_text',
        'retweeted_page_id',
        'retweeted_tweet_id',
        'retweeted_entities',
        'retweeted_extended_entities',
        'retweeted_favorite_count',
        'retweeted_retweet_count',
        'retweeted_created_at',

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
    protected $casts = [
        'quoted_created_at' => 'datetime',
        'retweeted_created_at' => 'datetime'
    ];

    public static function getMetaTags($url)
    {
        $meta = get_meta_tags($url);
        $description = '';
        $image = '';
        $title = '';

        foreach ($meta as $key => $val) {
            Log::info('meta key ' . $key . ' = ' . $val);
            if (str_contains($key, 'title')) {
                $title = $val;
            }

            if (str_contains($key, 'description')) {
                $description = $val;
            }

            if (str_contains($key, 'image') || str_contains($key, 'thumbnail')) {
                $image = $val;
            }
        }

        return [
            'description' => $description,
            'image' => $image,
            'title' => $title
        ];
    }

    public function arguments()
    {
        return $this->hasMany(ArgumentExampleTweet::class);
    }

    public function contradictions()
    {
        return $this->hasMany(ContradictionTwitter::class);
    }

    public function fallacies()
    {
        return $this->hasMany(FallacyTwitter::class);
    }

    public function page()
    {
        return $this->hasOne(Page::class, 'id', 'page_id');
    }

    public function urls()
    {
        return $this->hasMany(TweetUrl::class);
    }
}
