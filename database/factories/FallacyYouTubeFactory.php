<?php

namespace Database\Factories;

use App\Models\Fallacy;
use App\Models\FallacyYouTube;
use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FallacyYouTubeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FallacyYouTube::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        $fallacies = Fallacy::all()->random(1);
        $fallacy = current($fallacies->toArray());

        $videos = Video::all()->random(1);
        $video = current($videos->toArray());

        $startTime = $faker->numberBetween(2, 12);
        $endTime = $startTime + 3;

        return [
            'end_time' => $endTime,
            'fallacy_id' => $fallacy['id'],
            'start_time' => $startTime,
            'video_id' => $video['id']
        ];
    }
}
