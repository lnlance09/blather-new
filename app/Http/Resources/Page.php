<?php

namespace App\Http\Resources;

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
        $network = $this->network;
        $username = $this->username;
        $socialMediaId = $this->social_media_id;
        $externalLink = 'https://twitter.com/' . $username;
        if ($network === 'youtube') {
            $externalLink = 'https://www.youtube.com/channel/' . $socialMediaId;
        }

        return [
            'id' => $this->id,
            'bio' => empty($this->bio) ? 'Not much is known about this page...' : $this->bio,
            'contradictionCount' => $this->contradictions_count,
            'fallacyCount' => $this->fallacies_count,
            'externalLink' => $externalLink,
            'image' => env('AWS_URL', 'https://blather-new.s3.us-west-2.amazonaws.com/') . $this->image,
            'name' => $this->name,
            'network' => $network,
            'socialMediaId' => $socialMediaId,
            'tweetCount' => $this->tweets_count, // NOTE: for the tweets by argument count
            'username' => $username
        ];
    }
}
