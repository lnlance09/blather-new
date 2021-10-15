<?php

namespace App\Http\Resources;

use App\Http\Resources\PageCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class Group extends JsonResource
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
            'description' => $this->description,
            'name' => $this->name,
            'pages' => new PageCollection($this->pages)
        ];
    }
}
