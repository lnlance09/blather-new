<?php

namespace Database\Factories;

use App\Models\Fallacy;
use App\Models\FallacyTwitter;
use App\Models\Tweet;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FallacyTwitterFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FallacyTwitter::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $fallacies = Fallacy::all()->random(1);
        $fallacy = current($fallacies->toArray());

        $tweets = Tweet::all()->random(1);
        $tweet = current($tweets->toArray());

        return [
            'fallacy_id' => $fallacy['id'],
            'highlighted_text' => 'test',
            'tweet_id' => $tweet['id']
        ];
    }
}
