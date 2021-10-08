<?php

namespace App\Http\Controllers;

use App\Http\Resources\Tweet as TweetResource;
use App\Http\Resources\TweetCollection;
use App\Models\Page;
use App\Models\Tweet;
use Atymic\Twitter\Facade\Twitter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TweetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $_q = $request->input('q');
        $pageIds = $request->input('pageIds', null);
        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'asc');

        $tweets = Tweet::where(function ($q) use ($_q) {
            $q->where(function ($query) use ($_q) {
                $query->where('full_text', 'LIKE', '%' . $_q . '%');
            })->orWhere(function ($query) use ($_q) {
                $query->where('retweeted_full_text', 'LIKE', '%' . $_q . '%');
            })->orWhere(function ($query) use ($_q) {
                $query->where('quoted_full_text', 'LIKE', '%' . $_q . '%');
            });
        });

        if (is_array($pageIds)) {
            $tweets = $tweets->whereIn('page_id', $pageIds);
        }

        $tweets = $tweets->with(['page'])
            ->withCount(['fallacies'])
            // ->whereHas('page', function ($query) use ($q) {
            //    $query->where('coin_id', $coinId)->where('status', 'Correct');
            // })
            ->orderBy($sort, $dir)
            ->paginate(15);
        return new TweetCollection($tweets);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tweet  $tweet
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tweet $tweet)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Tweet  $tweet
     * @return \Illuminate\Http\Response
     */
    public function edit(Tweet $tweet)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $id
     * @return TweetResource
     */
    public function show($id)
    {
        $tweet = null;

        // Get the tweet from twitter's api
        try {
            $tweet = Twitter::getTweet($id, ['response_format' => 'array']);
            $tweetDb = Tweet::where('tweet_id', $tweet['id_str'])->first();

            if ($tweetDb) {
                $tweet = $tweetDb;
            } else {
                $user = $tweet['user'];
                $isQuoted = $tweet['is_quote_status'];
                $isRetweeted = array_key_exists('retweeted_status', $tweet) ? $tweet['retweeted_status'] : false;

                $contents = file_get_contents($user['profile_image_url_https']);
                $img = 'pages/twitter/' . $user['name'] . '-' . $user['id_str'] . '-' . time() . '.jpg';
                Storage::disk('s3')->put($img, $contents);

                $page = Page::updateOrCreate(
                    [
                        'network' => 'twitter',
                        'social_media_id' => $user['id_str']
                    ],
                    [
                        'bio' => $user['description'],
                        'image' => $img,
                        'name' => $user['name'],
                        'network' => 'twitter',
                        'username' => $user['screen_name']
                    ],
                );

                $newTweet = $tweet;
                $newTweet['full_text'] = $tweet['text'];
                unset($newTweet['text']);

                $data = [
                    'full_text' => $tweet['text'],
                    'page_id' => $page->id,
                    'tweet_id' => $tweet['id_str'],
                    'entities' => json_encode($tweet['entities'], true),
                    'extended_entities' => array_key_exists('extended_entities', $tweet) ? json_encode($tweet['extended_entities'], true) : null,
                    'favorite_count' => $tweet['favorite_count'],
                    'retweet_count' => $tweet['retweet_count'],
                    // 'tweet_json' => json_encode($tweet, true),
                    'created_at' => $tweet['created_at'],
                ];

                if ($isQuoted) {
                    $quoted = $tweet['quoted_status'];
                    $contents = file_get_contents($quoted['user']['profile_image_url_https']);
                    $img = 'pages/twitter/' . $quoted['user']['name'] . '-' . $quoted['user']['id_str'] . '-' . time() . '.jpg';
                    Storage::disk('s3')->put($img, $contents);

                    $qPage = Page::updateOrCreate(
                        [
                            'network' => 'twitter',
                            'social_media_id' => $quoted['user']['id_str']
                        ],
                        [
                            'bio' => $quoted['user']['description'],
                            'image' => $img,
                            'name' => $quoted['user']['name'],
                            'network' => 'twitter',
                            'username' => $quoted['user']['screen_name']
                        ],
                    );

                    $data['quoted_full_text'] = $quoted['text'];
                    $data['quoted_page_id'] = $qPage->id;
                    $data['quoted_entities'] = json_encode($quoted['entities'], true);
                    $data['quoted_extended_entities'] = array_key_exists('extended_entities', $quoted) ? json_encode($quoted['extended_entities'], true) : null;
                    $data['quoted_favorite_count'] = $quoted['favorite_count'];
                    $data['quoted_retweet_count'] = $quoted['retweet_count'];
                    $data['quoted_created_at'] = $quoted['created_at'];

                    $newTweet['quoted_status']['full_text'] = $quoted['text'];
                    unset($newTweet['quoted_status']['text']);
                }

                if ($isRetweeted) {
                    $retweeted = $tweet['retweeted_status'];
                    $contents = file_get_contents($retweeted['user']['profile_image_url_https']);
                    $img = 'pages/twitter/' . $retweeted['user']['name'] . '-' . $retweeted['user']['id_str'] . '-' . time() . '.jpg';
                    Storage::disk('s3')->put($img, $contents);

                    $rPage = Page::updateOrCreate(
                        [
                            'network' => 'twitter',
                            'social_media_id' => $retweeted['user']['id_str']
                        ],
                        [
                            'bio' => $retweeted['user']['description'],
                            'image' => $img,
                            'name' => $retweeted['user']['name'],
                            'network' => 'twitter',
                            'username' => $retweeted['user']['screen_name']
                        ],
                    );

                    $data['retweeted_full_text'] = $retweeted['text'];
                    $data['retweeted_page_id'] = $rPage->id;
                    $data['retweeted_entities'] = json_encode($retweeted['entities'], true);
                    $data['retweeted_extended_entities'] = array_key_exists('extended_entities', $retweeted) ? json_encode($retweeted['extended_entities'], true) : null;
                    $data['retweeted_favorite_count'] = $retweeted['favorite_count'];
                    $data['retweeted_retweet_count'] = $retweeted['retweet_count'];
                    $data['retweeted_created_at'] = $retweeted['created_at'];

                    $newTweet['retweeted_status']['full_text'] = $retweeted['text'];
                    unset($newTweet['retweeted_status']['text']);
                }

                $data['tweet_json'] = json_encode($newTweet, true);

                Tweet::create($data);
                // $tweet->refresh();
            }
        } catch (\Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
        }

        $tweet = Tweet::where('tweet_id', $id)
            ->withCount(['fallacies'])
            ->first();

        if (empty($tweet)) {
            return response([
                'message' => 'That tweet does not exist'
            ], 404);
        }

        return new TweetResource($tweet);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tweet  $tweet
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tweet $tweet)
    {
        //
    }
}
