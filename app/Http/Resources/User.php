<?php

namespace App\Http\Resources;

use App\Http\Resources\CommentCollection as CommentCollection;
use App\Http\Resources\CommentLikeCollection as LikeCollection;
use App\Http\Resources\CommentResponseCollection as ResponseCollection;
use App\Http\Resources\FallacyCollection as FallacyCollection;
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
        return [
            'id' => $this->id,
            'bio' => empty($this->bio) ? 'Apparently, this trader prefers to keep an air of mystery about them.' : $this->bio,
            // 'comments' => new CommentCollection($this->comments),
            // 'fallacies' => new FallacyCollection($this->fallacies),
            'image' => env('AWS_URL', 'https://preditc.s3.us-west-2.amazonaws.com/') . $this->image,
            // 'likes' => new LikeCollection($this->likes),
            'name' => $this->name,
            // 'responses' => new ResponseCollection($this->responses),
            // 'retractedFallacies' => new FallacyCollection($this->retracted_fallacies),
            'username' => $this->username
        ];
    }
}
