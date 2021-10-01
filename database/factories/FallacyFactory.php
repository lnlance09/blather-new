<?php

namespace Database\Factories;

use App\Models\Fallacy;
use App\Models\FallacyTwitter;
use App\Models\FallacyYouTube;
use App\Models\Page;
use App\Models\Reference;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FallacyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Fallacy::class;

    const STATUSES = [
        0,
        1,
        2
    ];

    const TYPES = [
        'twitter',
        'youtube'
    ];

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        $faker = $this->faker;
    
        return $this->afterMaking(function (Fallacy $fallacy) {
        })->afterCreating(function (Fallacy $fallacy) use ($faker) {
            $useTwitter = $faker->randomElement([0, 1]);

            if ($useTwitter) {
                FallacyTwitter::factory()->create([
                    'fallacy_id' => $fallacy['id']
                ]);
            } else {
                FallacyYouTube::factory()->create([
                    'fallacy_id' => $fallacy['id']
                ]);
            }
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        $refs = Reference::all()->random(1);
        $ref = current($refs->toArray());

        $pages = Page::all()->random(1);
        $page = current($pages->toArray());

        $users = User::all()->random(1);
        $user = current($users->toArray());

        $explanation = $faker->sentence(3);
        $title = $faker->sentence(1);
        $slug = Str::slug($title, '-');

        return [
            'explanation' => $explanation,
            'page_id' => $page['id'],
            'ref_id' => $ref['id'],
            'retracted' => $faker->randomElement([0, 1]),
            's3_link' => null,
            'slug' => $slug,
            'status' => $faker->randomElement(self::STATUSES),
            'views' => $faker->numberBetween(1000, 99999),
            'title' => $title,
            'user_id' => $user['id']
        ];
    }
}
