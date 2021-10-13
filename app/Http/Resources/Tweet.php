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

        $isQuoted = isset($this->quoted_tweet_id) ? true : false;
        $quoted = [
            'counts' => [
                'favorites' => $this->quoted_favorite_count,
                'retweets' => $this->quoted_retweet_count
            ],
            'createdAt' => $this->quoted_created_at,
            'entities' => $this->quoted_entities,
            'extendedEntities' => json_decode($this->quoted_extended_entities, true),
            'fullText' => $this->quoted_full_text,
            'isQuoted' => $isQuoted,
            'tweetId' => $this->quoted_tweet_id,
            'user' => [
                'image' => '',
                'name' => '',
                'username' => '',
            ]
        ];

        if ($isQuoted && array_key_exists('user', $tweet['quoted_status'])) {
            $q = $tweet['quoted_status'];
            $quoted['user']['image'] = $q['user']['profile_image_url_https'];
            $quoted['user']['name'] = $q['user']['name'];
            $quoted['user']['username'] = $q['user']['screen_name'];
        }

        $isRetweeted = isset($this->retweeted_tweet_id) ? true : false;
        $retweeted = [
            'counts' => [
                'favorites' => $this->retweeted_favorite_count,
                'retweets' => $this->retweeted_retweet_count
            ],
            'createdAt' => $this->retweeted_created_at,
            'entities' => $this->retweeted_entities,
            'extendedEntities' => json_decode($this->retweeted_extended_entities, true),
            'fullText' => $this->retweeted_full_text,
            'isRetweeted' => $isRetweeted,
            'tweetId' => $this->retweeted_tweet_id,
            'user' => [
                'image' => '',
                'name' => '',
                'username' => '',
            ]
        ];


        if ($isRetweeted && array_key_exists('user', $tweet['retweeted_status'])) {
            $rt = $tweet['retweeted_status'];
            $retweeted['user']['image'] = $rt['user']['profile_image_url_https'];
            $retweeted['user']['name'] = $rt['user']['name'];
            $retweeted['user']['username'] = $rt['user']['screen_name'];

            if (array_key_exists('quoted_status', $rt) ? $rt['quoted_status'] : false) {
                $rqt = $rt['quoted_status'];
                $quoted = [
                    'counts' => [
                        'favorites' => $rqt['favorite_count'],
                        'retweets' => $rqt['retweet_count']
                    ],
                    'createdAt' => $rqt['created_at'],
                    'entities' => $rqt['entities'],
                    'extendedEntities' => array_key_exists('extended_entities', $rqt) ? $rqt['extended_entities'] : null,
                    'fullText' => $rqt['full_text'],
                    'isQuoted' => true,
                    'tweetId' => $rqt['id_str'],
                    'user' => [
                        'image' => $rqt['user']['profile_image_url_https'],
                        'name' => $rqt['user']['name'],
                        'username' => $rqt['user']['screen_name'],
                    ]
                ];
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
            // 'entities' => $this->entities,
            'extendedEntities' => json_decode($this->extended_entities, true),
            'fallacyCount' => $this->fallacies_count,
            'fullText' => $this->full_text,
            'page' => new PageResource($this->page),
            'quoted' => $quoted,
            'retweeted' => $retweeted,
            'tweetId' => $this->tweet_id,
            'user' => [
                'image' => env('AWS_URL', 'https://s3.amazonaws.com/blather22/') . $this->page->image,
                'name' => $this->page->name,
                'username' => $this->page->username,
            ],
            'createdAt' => $this->created_at
        ];
    }
}
