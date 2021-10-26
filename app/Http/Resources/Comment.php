<?php

namespace App\Http\Resources;

use App\Http\Resources\Fallacy as FallacyResource;
use App\Http\Resources\CommentLikeCollection as LikeCollection;
use App\Http\Resources\CommentResponseCollection as ResponseCollection;
use App\Http\Resources\User as UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Comment extends JsonResource
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
            'likeCount' => $this->likes_count,
            'likes' => new LikeCollection($this->likes),
            'msg' => $this->msg,
            'responseCount' => $this->responses_count,
            'responses' => new ResponseCollection($this->responses),
            'user' => new UserResource($this->user),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
