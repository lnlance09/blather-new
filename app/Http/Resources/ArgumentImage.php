<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ArgumentImage extends JsonResource
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
            'caption' => $this->caption,
            's3Link' => env('AWS_URL', 'https://blather-new.s3.us-west-2.amazonaws.com/') . $this->s3_link,
        ];
    }
}
