<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Fallacy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Comment::class;

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

        $users = User::all()->random(1);
        $user = current($users->toArray());

        return [
            'fallacy_id' => $fallacy['id'],
            'msg' => $faker->sentence(3),
            'user_id' => $user['id']
        ];
    }
}
