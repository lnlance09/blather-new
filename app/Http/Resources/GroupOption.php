<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GroupOption extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $text = $this->name;

        if ($request->input('showCounts') == 1) {
            $text .= ' - ' . number_format($this->members_count) . ' members';
        }

        return [
            'key' => $this->id,
            'name' => $this->name,
            'text' => $text,
            'value' => $this->id
        ];
    }
}
