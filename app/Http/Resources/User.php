<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // dd($this);

        return [
            'id' => $this->id,
            'bio' => empty($this->bio) ? 'Apparently, this trader prefers to keep an air of mystery about them.' : $this->bio,
            'commentsCount' => $this->comments_count,
            'contradictionsCount' => $this->contradictions_count,
            'fallaciesCount' => $this->fallacies_count,
            'image' => env('AWS_URL', 'https://blather-new.s3.us-west-2.amazonaws.com/') . $this->image,
            'likesCount' => $this->likes_count,
            'name' => $this->name,
            'responsesCount' => $this->respones_count,
            'retractedCount' => $this->retracted_fallacies_count,
            'targetsCount' => '',
            'username' => $this->username
        ];
    }
}
