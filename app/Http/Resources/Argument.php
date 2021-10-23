<?php

namespace App\Http\Resources;

use App\Http\Resources\ArgumentExampleTweetCollection as ExampleTweetCollection;
use App\Http\Resources\ArgumentContradictionCollection as ContradictionCollection;
use App\Http\Resources\ArgumentImageCollection as ImageCollection;
use App\Http\Resources\TweetCollection as TweetCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class Argument extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'contradictionCount' => $this->contradictions_count,
            'contradictions' => new ContradictionCollection($this->contradictions),
            'contradictionOptions' => array_column($this->contradictions->toArray(), 'id'),
            'description' => $this->description,
            'explanation' => $this->explanation,
            'imageCount' => $this->images_count,
            'images' => new ImageCollection($this->images),
            'slug' => $this->slug,
            'tweetCount' => $this->tweets_count,
            'tweets' => new ExampleTweetCollection($this->tweets),
        ];
    }
}
