<?php

namespace App\Http\Resources;

use App\Http\Resources\GroupMemberCollection;
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
        $members = $this->members ? new GroupMemberCollection($this->members) : null;
        return [
            'id' => $this->id,
            'description' => $this->description,
            'members' => $members,
            'name' => $this->name
        ];
    }
}
