<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ArgumentOption extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $text = isset($this->contradiction) ? $this->contradiction->description : $this->description;

        return [
            'key' => $this->id,
            'name' => $text,
            'text' => $text,
            'value' => $this->id
        ];
    }
}
