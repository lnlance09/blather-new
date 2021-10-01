<?php

namespace App\Http\Resources;

use App\Http\Resources\Tweet as TweetResource;
use Illuminate\Http\Resources\Json\JsonResource;

class FallacyTwitter extends JsonResource
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
            'fallacyId' => $this->fallacy_id,
            'highlightedText' => $this->highlighted_text,
            'tweet' => new TweetResource($this->tweet),
        ];
    }
}
