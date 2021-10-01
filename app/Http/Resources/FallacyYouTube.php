<?php

namespace App\Http\Resources;

use App\Http\Resources\Video as VideoResource;
use Illuminate\Http\Resources\Json\JsonResource;

class FallacyYouTube extends JsonResource
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
            'fallacyId' => $this->fallacy_id,
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
            'video' => new VideoResource($this->video),
        ];
    }
}
