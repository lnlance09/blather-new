<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\CommentResponse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentLikeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CommentLike::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        $useResponse = $faker->randomElement([0, 1]);

        $comments = Comment::all()->random(1);
        $comment = current($comments->toArray());
        $commentId = $comment['id'];
        $responseId = null;

        if ($useResponse) {
            $responses = CommentResponse::all()->random(1);
            $response = current($responses->toArray());
            $commentId = $response['response_to'];
            $responseId = $response['id'];
        }

        $users = User::all()->random(1);
        $user = current($users->toArray());

        return [
            'comment_id' => $commentId,
            'response_id' => $responseId,
            'user_id' => $user['id']
        ];
    }
}
