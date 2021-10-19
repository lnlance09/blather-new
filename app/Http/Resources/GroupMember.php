<?php

namespace App\Http\Resources;

use App\Http\Resources\Page as PageResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupMember extends JsonResource
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
            'page' => new PageResource($this->page),
        ];
    }
}
