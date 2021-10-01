<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\Tweet;
use Illuminate\Database\Eloquent\Factories\Factory;

class TweetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Tweet::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        $pages = Page::all()->random(1);
        $page = current($pages->toArray());

        $isQuoted = $faker->randomElement([0, 1]);
        $isRetweeted = $faker->randomElement([0, 1]);

        $tweet = [
            'entities' => '',
            'extended_entities' => '',
            'favorite_count' => $faker->numberBetween(1000, 99999),
            'full_text' => $faker->sentence(2),
            'page_id' => $page['id'],
            'retweet_count' => $faker->numberBetween(1000, 99999),
            'tweet_id' => '',
            'tweet_json' => ''
        ];

        if ($isQuoted) {
            $tweet['quoted_entities'] = '';
            $tweet['quoted_extended_entities'] = '';
            $tweet['quoted_favorite_count'] = $faker->numberBetween(1000, 99999);
            $tweet['quoted_full_text'] = $faker->sentence(2);
            $tweet['quoted_page_id'] = $page['id'];
            $tweet['quoted_retweet_count'] = $faker->numberBetween(1000, 99999);
            $tweet['quoted_tweet_id'] = '';
        }

        if ($isRetweeted) {
            $tweet['retweeted_entities'] = '';
            $tweet['retweeted_extended_entities'] = '';
            $tweet['retweeted_favorite_count'] = $faker->numberBetween(1000, 99999);
            $tweet['retweeted_full_text'] = $faker->sentence(2);
            $tweet['retweeted_page_id'] = $page['id'];
            $tweet['retweeted_retweet_count'] = $faker->numberBetween(1000, 99999);
            $tweet['retweeted_tweet_id'] = '';
        }

        return $tweet;
    }
}
