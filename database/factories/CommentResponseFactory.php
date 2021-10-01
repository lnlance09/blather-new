<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\CommentResponse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentResponseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CommentResponse::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        $comments = Comment::all()->random(1);
        $comment = current($comments->toArray());

        $users = User::all()->random(1);
        $user = current($users->toArray());

        return [
            'msg' => $faker->sentence(3),
            'response_to' => $comment['id'],
            'user_id' => $user['id']
        ];
    }
}
