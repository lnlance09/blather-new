<?php

namespace Database\Factories;

use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Page::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        $firstName = $faker->firstNameMale();
        $lastName = $faker->lastName();
        $name = $firstName . ' ' . $lastName;
        $username = $firstName . '-' . $lastName . '' . mt_rand(10, 9999);

        return [
            'bio' => $faker->sentence(2),
            'image' => '',
            'name' => $name,
            'network' => $faker->randomElement(['twitter', 'youtube']),
            'social_media_id' => $faker->numberBetween(1000, 99999),
            'username' => $username
        ];
    }
}
