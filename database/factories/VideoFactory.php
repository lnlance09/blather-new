<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;

class VideoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Video::class;

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

        return [
            'description' => $faker->sentence(5),
            'dislike_count' => $faker->numberBetween(1000, 99999),
            'like_count' => $faker->numberBetween(1000, 99999),
            'page_id' => $page['id'],
            's3_link' => null,
            'thumbnail' => '',
            'title' => $faker->sentence(2),
            'video_id' => '',
            'view_count' => $faker->numberBetween(1000, 99999)
        ];
    }
}
