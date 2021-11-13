<?php

namespace App\Http\Resources;

use App\Http\Resources\Group as GroupResource;
use App\Http\Resources\FallacyTwitter as FallacyTwitterResource;
use App\Http\Resources\FallacyYouTube as FallacyYouTubeResource;
use App\Http\Resources\Page as PageResource;
use App\Http\Resources\Reference as ReferenceResource;
use App\Http\Resources\User as UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Fallacy extends JsonResource
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
            'commentCount' => isset($this->comments_count) ? $this->comments_count : 0,
            'contradictionTwitter' => new FallacyTwitterResource($this->contradictionTwitter),
            'contradictionYouTube' => new FallacyYouTubeResource($this->contradictionYouTube),
            'explanation' => $this->explanation,
            'group' => new GroupResource($this->group),
            'page' => new PageResource($this->page),
            'reference' => new ReferenceResource($this->reference),
            'retracted' => $this->retracted,
            's3Link' => env('AWS_URL', 'https://blather-new.s3.us-west-2.amazonaws.com/') . $this->s3_link,
            'slug' => $this->slug,
            'status' => $this->status,
            'title' => $this->title,
            'twitter' => new FallacyTwitterResource($this->twitter),
            'user' => new UserResource($this->user),
            'views' => $this->views,
            'youtube' => new FallacyYouTubeResource($this->youtube),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
