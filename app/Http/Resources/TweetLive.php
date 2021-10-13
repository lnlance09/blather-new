<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TweetLive extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $qFavCount = 0;
        $qRtCount = 0;
        $qCreatedAt = '';
        $qEntities = '';
        $qExtEntities = '';
        $qFullText = '';
        $qTweetId = '';
        $qUserImg = '';
        $qUserName = '';
        $qUserUsername = '';
        $isQuoted = false;

        if (isset($this->quoted_status)) {
            $q = $this->quoted_status;
            $qFavCount = $q->favorite_count;
            $qRtCount = $q->retweet_count;
            $qCreatedAt = $q->created_at;
            $qEntities = $q->entities;
            $qExtEntities = isset($q->extended_entities) ? $q->extended_entities : null;
            $qFullText = $q->full_text;
            $qTweetId = $q->id_str;
            $qUserImg = $q->user->profile_image_url_https;
            $qUserName = $q->user->name;
            $qUserUsername = $q->user->screen_name;
            $isQuoted = true;
        }

        $rFavCount = 0;
        $rRtCount = 0;
        $rCreatedAt = '';
        $rEntities = '';
        $rExtEntities = '';
        $rFullText = '';
        $rTweetId = '';
        $rUserImg = '';
        $rUserName = '';
        $rUserUsername = '';
        $isRetweeted = false;

        if (isset($this->retweeted_status)) {
            $r = $this->retweeted_status;
            $rFavCount = $r->favorite_count;
            $rRtCount = $r->retweet_count;
            $rCreatedAt = $r->created_at;
            $rEntities = $r->entities;
            $rExtEntities = isset($r->extended_entities) ? $r->extended_entities : null;
            $rFullText = $r->full_text;
            $rTweetId = $r->id_str;
            $rUserImg = $r->user->profile_image_url_https;
            $rUserName = $r->user->name;
            $rUserUsername = $r->user->screen_name;
            $isRetweeted = true;

            if (isset($r->quoted_status)) {
                $q = $r->quoted_status;
                $qFavCount = $q->favorite_count;
                $qRtCount = $q->retweet_count;
                $qCreatedAt = $q->created_at;
                $qEntities = $q->entities;
                $qExtEntities = isset($q->extended_entities) ? $q->extended_entities : null;
                $qFullText = $q->full_text;
                $qTweetId = $q->id_str;
                $qUserImg = $q->user->profile_image_url_https;
                $qUserName = $q->user->name;
                $qUserUsername = $q->user->screen_name;
                $isQuoted = true;
            }
        }

        return [
            'id' => $this->id,
            'counts' => [
                'favorites' => $this->favorite_count,
                'retweets' => $this->retweet_count
            ],
            'entities' => json_encode($this->entities, true),
            'extendedEntities' => isset($this->extended_entities) ? $this->extended_entities : null,
            'fullText' => $this->full_text,
            'quoted' => [
                'counts' => [
                    'favorites' => $qFavCount,
                    'retweets' => $qRtCount
                ],
                'createdAt' => $qCreatedAt,
                'entities' =>  $qEntities,
                'extendedEntities' => $qExtEntities,
                'fullText' => $qFullText,
                'isQuoted' => $isQuoted,
                'tweetId' => $qTweetId,
                'user' => [
                    'image' => $qUserImg,
                    'name' => $qUserName,
                    'username' => $qUserUsername,
                ]
            ],
            'retweeted' => [
                'counts' => [
                    'favorites' => $rFavCount,
                    'retweets' => $rRtCount
                ],
                'createdAt' => $rCreatedAt,
                'entities' => $rEntities,
                'extendedEntities' => $rExtEntities,
                'fullText' => $rFullText,
                'isRetweeted' => $isRetweeted,
                'tweetId' => $rTweetId,
                'user' => [
                    'image' => $rUserImg,
                    'name' => $rUserName,
                    'username' => $rUserUsername,
                ]
            ],
            'tweetId' => $this->id_str,
            'user' => [
                'image' => $this->user->profile_image_url_https,
                'name' => $this->user->name,
                'username' => $this->user->screen_name,
            ],
            'createdAt' => $this->created_at
        ];
    }
}
