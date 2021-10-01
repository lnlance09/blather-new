<?php

namespace App\Http\Resources;

use App\Http\Resources\Comment as CommentResource;
use App\Http\Resources\CommentLikeCollection as LikeCollection;
use App\Http\Resources\User as UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResponse extends JsonResource
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
            'likes' => new LikeCollection($this->likes),
            'msg' => $this->msg,
            'responseTo' => new CommentResource($this->response_to),
            'user' => new UserResource($this->user),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
