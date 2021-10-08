<?php

namespace App\Http\Resources;

use App\Http\Resources\Page as PageResource;
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
        $tweetJson = $this->tweet_json;
        $tweet = @json_decode($tweetJson, true);

        $userName = '';
        $userUsername = '';
        $userImg = '';
        $text = $tweet['full_text'];

        if (array_key_exists('user', $tweet)) {
            $userName = $tweet['user']['name'];
            $userUsername = $tweet['user']['screen_name'];
            $userImg = env('AWS_URL', 'https://s3.amazonaws.com/blather22/') . $this->page->image;
        }

        $isQuoted = false;
        $userNameQ = '';
        $userUsernameQ = '';
        $userImgQ = '';

        if ($this->quoted_tweet_id) {
            $isQuoted = true;
            $hasQUser = array_key_exists('user', $tweet['quoted_status']);
            if ($hasQUser) {
                $userNameQ = $tweet['quoted_status']['user']['name'];
                $userUsernameQ = $tweet['quoted_status']['user']['screen_name'];
                $userImgQ = $tweet['quoted_status']['user']['profile_image_url_https'];
            }
        }

        $isRetweeted = false;
        $userNameR = '';
        $userUsernameR = '';
        $userImgR = '';

        if ($this->retweeted_tweet_id) {
            $isRetweeted = true;
            $hasRUser = array_key_exists('user', $tweet['retweeted_status']);
            if ($hasRUser) {
                $userNameR = $tweet['retweeted_status']['user']['name'];
                $userUsernameR = $tweet['retweeted_status']['user']['screen_name'];
                $userImgR = $tweet['retweeted_status']['user']['profile_image_url_https'];
            }
        }

        return [
            'id' => $this->id,
            'contradictionCount' => $this->contradictions_count,
            'counts' => [
                'fallacies' => $this->fallacies_count,
                'favorites' => $this->favorite_count,
                'retweets' => $this->retweet_count
            ],
            'entities' => $this->entities,
            'extendedEntities' => $this->extended_entities,
            'fallacyCount' => $this->fallacies_count,
            'fullText' => $this->full_text,
            'text' => $text,
            'page' => new PageResource($this->page),
            'quoted' => [
                'counts' => [
                    'favorites' => $this->quoted_favorite_count,
                    'retweets' => $this->quoted_retweet_count
                ],
                'createdAt' => $this->quoted_created_at,
                'entities' => $this->quoted_entities,
                'extendedEntities' => $this->quoted_extended_entities,
                'fullText' => $this->quoted_full_text,
                'isQuoted' => $isQuoted,
                'tweetId' => $this->quoted_tweet_id,
                'user' => [
                    'image' => $userImgQ,
                    'name' => $userNameQ,
                    'username' => $userUsernameQ,
                ]
            ],
            'retweeted' => [
                'counts' => [
                    'favorites' => $this->retweeted_favorite_count,
                    'retweets' => $this->retweeted_retweet_count
                ],
                'createdAt' => $this->retweeted_created_at,
                'entities' => $this->retweeted_entities,
                'extendedEntities' => $this->retweeted_extended_entities,
                'fullText' => $this->retweeted_full_text,
                'isRetweeted' => $isRetweeted,
                'tweetId' => $this->retweeted_tweet_id,
                'user' => [
                    'image' => $userImgR,
                    'name' => $userNameR,
                    'username' => $userUsernameR,
                ]
            ],
            'tweetId' => $this->tweet_id,
            'user' => [
                'image' => $userImg,
                'name' => $userName,
                'username' => $userUsername,
            ],
            'createdAt' => $this->created_at
        ];
    }
}
