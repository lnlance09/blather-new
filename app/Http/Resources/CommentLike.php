<?php

namespace App\Http\Resources;

use App\Http\Resources\Comment as CommentResource;
use App\Http\Resources\CommentResponse as ResponseResource;
use App\Http\Resources\User as UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentLike extends JsonResource
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
            'comment' => new CommentResource($this->comment),
            'response' => new ResponseResource($this->response),
            'user' => new UserResource($this->user),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
