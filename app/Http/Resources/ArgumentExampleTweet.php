<?php

namespace App\Http\Resources;

use App\Http\Resources\Argument as ArgumentResource;
use App\Http\Resources\Tweet as TweetResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ArgumentExampleTweet extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $argument = [];
        if ($request->input('argument') == 1) {
            $argument = new ArgumentResource($this->argument);
        }

        $tweet = [];
        if ($request->input('tweet') == 1) {
            $tweet = new TweetResource($this->tweet);
        }

        return [
            'id' => $this->id,
            'argument' => $argument,
            'tweet' => $tweet,
        ];
    }
}
