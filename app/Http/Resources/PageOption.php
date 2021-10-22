<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PageOption extends JsonResource
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
            $text .= ' (' . number_format($this->fallacies_count) . ')';
        }

        return [
            /*
            'image' => [
                'avatar' => true,
                'src' => env('AWS_URL', 'https://s3.amazonaws.com/blather22/') . $this->image
            ],
            */
            'key' => $this->id,
            'name' => $this->name,
            'text' => $text,
            'value' => $this->id
        ];
    }
}
