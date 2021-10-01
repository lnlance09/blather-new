<?php

namespace App\Http\Resources;

use App\Http\Resources\Page as PageResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Video extends JsonResource
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
            'counts' => [
                'dislikes' => $this->dislike_count,
                'likes' => $this->like_count,
                'views' => $this->view_count
            ],
            'description' => $this->description,
            'page' => new PageResource($this->page),
            's3Link' => $this->s3_link,
            'thumbnail' => $this->thumbnail,
            'title' => $this->title,
            'videoId' => $this->video_id,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
