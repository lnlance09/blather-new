<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Tweet extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // dump($request);
        return [
            'id' => $this->id,
            'counts' => [
                'favorites' => $this->favorite_count,
                'retweets' => $this->retweet_count
            ],
            'entities' => $this->entities,
            'extendedEntities' => $this->extended_entities,
            'fullText' => $this->full_text,
            // 'page' => new PageResource($this->page),
            'quoted' => [
                'counts' => [
                    'favorites' => $this->quoted_favorite_count,
                    'retweets' => $this->quoted_retweet_count
                ],
                'entities' => $this->quoted_entities,
                'extendedEntities' => $this->quoted_extended_entities,
                'fullText' => $this->quoted_full_text,
                // 'page' => new PageResource($this->quoted_page),
                'tweetId' => $this->quoted_tweet_id,
            ],
            'retweeted' => [
                'counts' => [
                    'favorites' => $this->retweeted_favorite_count,
                    'retweets' => $this->retweeted_retweet_count
                ],
                'entities' => $this->retweeted_entities,
                'extendedEntities' => $this->retweeted_extended_entities,
                'fullText' => $this->retweeted_full_text,
                // 'page' => new PageResource($this->retweeted_page),
                'tweetId' => $this->retweeted_tweet_id,
            ],
            'tweetId' => $this->tweet_id,
            'tweetJson' => $this->tweet_json,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
