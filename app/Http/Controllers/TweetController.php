<?php

namespace App\Http\Controllers;

use App\Http\Resources\Tweet as TweetResource;
use App\Http\Resources\TweetCollection;
use App\Http\Resources\TweetLiveCollection;
use App\Models\Argument;
use App\Models\ArgumentExampleTweet;
use App\Models\Page;
use App\Models\Tweet;
use Atymic\Twitter\Facade\Twitter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TweetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = $request->input('q');
        $ids = $request->input('ids');
        $pageIds = $request->input('pageIds', null);
        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'asc');

        $tweets = Tweet::where(function ($query) use ($q) {
            $query->where(function ($query) use ($q) {
                $query->where('full_text', 'LIKE', '%' . $q . '%');
            })->orWhere(function ($query) use ($q) {
                $query->where('retweeted_full_text', 'LIKE', '%' . $q . '%');
            })->orWhere(function ($query) use ($q) {
                $query->where('quoted_full_text', 'LIKE', '%' . $q . '%');
            });
        });

        if (is_array($pageIds)) {
            $tweets = $tweets->whereIn('page_id', $pageIds);
        }

        if (is_array($ids)) {
            $tweets = $tweets->whereIn('tweet_id', $ids);
        }

        $tweets = $tweets->with(['page'])
            ->withCount(['fallacies'])
            ->orderBy($sort, $dir)
            ->paginate(15);
        return new TweetCollection($tweets);
    }

    public function addArguments(Request $request, $id)
    {
        $user = $request->user();
        if ($user->id !== 1) {
            return response([
                'message' => 'Unauthorized'
            ], 401);
        }

        $args = $request->input('args', []);

        $tweet = Tweet::where('id', $id)->first();
        if (!$tweet) {
            return response([
                'message' => 'Invalid tweet'
            ], 404);
        }

        if (!is_array($args)) {
            return response([
                'message' => 'Invalid args'
            ], 422);
        }

        for ($i = 0; $i < count($args); $i++) {
            $argId = $args[$i];
            $count = Argument::where('id', $argId)->count();
            if ($count == 0) {
                continue;
            }

            $count = ArgumentExampleTweet::where([
                'argument_id' => $argId,
                'tweet_id' => $id
            ])->count();
            if ($count == 1) {
                continue;
            }

            ArgumentExampleTweet::create([
                'argument_id' => $argId,
                'tweet_id' => $id
            ]);
        }

        ArgumentExampleTweet::where('tweet_id', $id)
            ->whereNotIn('argument_id', $args)
            ->delete();

        return response([
            'message' => 'Success'
        ]);
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
        $archived = false;

        // Get the tweet from twitter's api
        try {
            $tweet = Twitter::getTweet($id, [
                'response_format' => 'array',
                'tweet_mode' => 'extended'
            ]);
            $tweetDb = Tweet::where('tweet_id', $tweet['id_str'])->first();

            if ($tweetDb) {
                // If the tweet exists in the DB and with the API, update the favorite and RT counts
                $tweetDb->favorite_count = $tweet['favorite_count'];
                $tweetDb->retweet_count = $tweet['retweet_count'];

                $isQuoted = $tweet['is_quote_status'];
                $isRetweeted = array_key_exists('retweeted_status', $tweet) ? $tweet['retweeted_status'] : false;

                if ($isQuoted && array_key_exists('quoted_status', $tweet)) {
                    $quoted = $tweet['quoted_status'];
                    $tweetDb->quoted_favorite_count = $quoted['favorite_count'];
                    $tweetDb->quoted_retweet_count = $quoted['retweet_count'];
                }

                if ($isRetweeted) {
                    $retweeted = $tweet['retweeted_status'];
                    $tweetDb->retweeted_favorite_count = $retweeted['favorite_count'];
                    $tweetDb->retweeted_retweet_count = $retweeted['retweet_count'];
                }

                $tweetDb->save();
                $tweetDb->refresh();
                $tweet = $tweetDb;
            } else {
                $archived = true;

                $user = $tweet['user'];
                $isQuoted = $tweet['is_quote_status'];
                $isRetweeted = array_key_exists('retweeted_status', $tweet) ? $tweet['retweeted_status'] : false;

                $imgUrl = Str::replace('_normal', '', $user['profile_image_url_https']);
                $page = Page::where('social_media_id', $user['id_str'])->first();

                if (empty($page)) {
                    $img = 'pages/twitter/' . Str::random(24) . '.jpg';
                } else {
                    $img = $page->image;
                }

                Storage::disk('s3')->put($img, file_get_contents($imgUrl));

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

                $data = [
                    'full_text' => $tweet['full_text'],
                    'page_id' => $page->id,
                    'tweet_id' => $tweet['id_str'],
                    'entities' => json_encode($tweet['entities'], true),
                    'extended_entities' => array_key_exists('extended_entities', $tweet) ? json_encode($tweet['extended_entities'], true) : null,
                    'favorite_count' => $tweet['favorite_count'],
                    'retweet_count' => $tweet['retweet_count'],
                    'tweet_json' => json_encode($tweet, true),
                    'created_at' => $tweet['created_at'],
                ];

                if ($isQuoted && array_key_exists('quoted_status', $tweet)) {
                    $quoted = $tweet['quoted_status'];
                    $imgUrl = Str::replace('_normal', '', $quoted['user']['profile_image_url_https']);
                    $page = Page::where('social_media_id', $quoted['user']['id_str'])->first();

                    if (empty($page)) {
                        $img = 'pages/twitter/' . Str::random(24) . '.jpg';
                    } else {
                        $img = $page->image;
                    }

                    Storage::disk('s3')->put($img, file_get_contents($imgUrl));

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

                    $data['quoted_tweet_id'] = $quoted['id_str'];
                    $data['quoted_full_text'] = $quoted['full_text'];
                    $data['quoted_page_id'] = $qPage->id;
                    $data['quoted_entities'] = json_encode($quoted['entities'], true);
                    $data['quoted_extended_entities'] = array_key_exists('extended_entities', $quoted) ? json_encode($quoted['extended_entities'], true) : null;
                    $data['quoted_favorite_count'] = $quoted['favorite_count'];
                    $data['quoted_retweet_count'] = $quoted['retweet_count'];
                    $data['quoted_created_at'] = $quoted['created_at'];
                }

                if ($isRetweeted) {
                    $retweeted = $tweet['retweeted_status'];
                    $imgUrl = Str::replace('_normal', '', $retweeted['user']['profile_image_url_https']);
                    $page = Page::where('social_media_id', $retweeted['user']['id_str'])->first();

                    if (empty($page)) {
                        $img = 'pages/twitter/' . Str::random(24) . '.jpg';
                    } else {
                        $img = $page->image;
                    }

                    Storage::disk('s3')->put($img, file_get_contents($imgUrl));


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

                    $data['retweeted_tweet_id'] = $retweeted['id_str'];
                    $data['retweeted_full_text'] = $retweeted['full_text'];
                    $data['retweeted_page_id'] = $rPage->id;
                    $data['retweeted_entities'] = json_encode($retweeted['entities'], true);
                    $data['retweeted_extended_entities'] = array_key_exists('extended_entities', $retweeted) ? json_encode($retweeted['extended_entities'], true) : null;
                    $data['retweeted_favorite_count'] = $retweeted['favorite_count'];
                    $data['retweeted_retweet_count'] = $retweeted['retweet_count'];
                    $data['retweeted_created_at'] = $retweeted['created_at'];
                }

                $data['tweet_json'] = json_encode($tweet, true);
                Tweet::create($data);
            }
        } catch (\Exception $e) {
            // echo 'Caught exception: ',  $e->getMessage(), "\n";
        }

        $tweet = Tweet::where('tweet_id', $id)
            ->with(['arguments.argument'])
            ->withCount(['arguments', 'fallacies'])
            ->first();

        if (empty($tweet)) {
            return response([
                'message' => 'That tweet does not exist'
            ], 404);
        }

        return response([
            'archived' => $archived,
            'tweet' => new TweetResource($tweet)
        ]);
    }

    public function showTwitterList(Request $request)
    {
        $page = $request->input('page', 1);

        $tweets = Twitter::getListStatuses([
            'list_id' => 1095482595847127040,
            'page' => $page,
            'tweet_mode' => 'extended'
        ]);
        return new TweetLiveCollection($tweets);
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
