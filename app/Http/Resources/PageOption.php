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
        $network = $this->network;

        if ($network === 'twitter') {
            $text .= ' @' . $this->username;
        }

        if ($request->input('showCounts') == 1) {
            $text .= ' (' . number_format($this->fallacies_count) . ')';
        }

        return [
            /*
            'image' => [
                'avatar' => true,
                'src' => env('AWS_URL', 'https://blather-new.s3.us-west-2.amazonaws.com/') . $this->image
            ],
            */
            'icon' => [
                'className' => $network . 'Icon',
                'name' => $network
            ],
            'key' => $this->id,
            'name' => $this->name,
            'text' => $text,
            'value' => $this->id
        ];
    }
}
