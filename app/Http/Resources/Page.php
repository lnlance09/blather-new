<?php

namespace App\Http\Resources;

use App\Http\Resources\FallacyCollection as FallacyCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class Page extends JsonResource
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
            'bio' => $this->bio,
            // 'fallacies' => new FallacyCollection($this->fallacies),
            'image' => $this->image,
            'name' => $this->name,
            'network' => $this->network,
            'socialMediaId' => $this->social_media_id,
            'username' => $this->username
        ];
    }
}
