<?php

namespace App\Http\Controllers;

use App\Models\FallacyEntry;
use App\Models\Page;
use App\Models\Tweet;
use App\Models\Video;

use App\Http\Resources\Fallacy as FallacyResource;
use App\Http\Resources\FallacyCollection;
use App\Models\ContradictionTwitter;
use App\Models\ContradictionYouTube;
use App\Models\Fallacy;
use App\Models\FallacyTwitter;
use App\Models\FallacyYouTube;
use Illuminate\Http\Request;

class FallacyController extends Controller
{
    const DEFAULT_WITH = [
        'page',
        'reference',
        'user',
        'twitter.tweet',
        'youtube.video',
        'contradictionTwitter.tweet',
        'contradictionYouTube.video'
    ];

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = $request->input('q', null);
        $pageIds = $request->input('pageIds', null);
        $refIds = $request->input('refIds', null);
        $userId = $request->input('userId', null);
        $retracted = $request->input('retracted', null);
        $status = $request->input('status', null);
        $includeContradictions = $request->input('includeContradictions', false);
        $tweetId = $request->input('tweetId', null);
        $with = $request->input('with', self::DEFAULT_WITH);

        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'desc');

        $where = [];

        if ($userId) {
            $where['user_id'] = $userId;
        }

        if ($status) {
            $where['status'] = $status;
        }

        if ($retracted) {
            $where['retracted'] = $retracted;
        }

        if (!empty($q)) {
            $where['explanation'] = ['LIKE', '%' . $q . '%'];
        }

        $fallacies = Fallacy::with($with)->where($where);

        if (!$includeContradictions) {
            $fallacies = $fallacies->whereNotIn('ref_id', [21]);
        }

        if (is_array($pageIds)) {
            $fallacies = $fallacies->whereIn('page_id', $pageIds);
        }

        if (is_array($refIds)) {
            $fallacies = $fallacies->whereIn('ref_id', $refIds);
        }

        if ($tweetId) {
            $fallacies = $fallacies->whereHas('twitter', function ($query) use ($tweetId) {
                $query->where('tweet_id', 4079);
            });
        }

        $fallacies = $fallacies->orderBy($sort, $dir)
            ->paginate(15);
        return new FallacyCollection($fallacies);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return PredictionResource
     * @param  \Illuminate\Http\Request  $request
     */
    public function create(Request $request)
    {
        $request->validate([
            'explanation' => 'bail|required',
            'refId' => 'bail|required|exists:reference,id',
            'type' => 'bail|required',
        ]);

        $explanation = $request->input('explanation');
        $highlightedText = $request->input('highlightedText', null);
        $refId = $request->input('refId');
        $tweetId = $request->input('tweetId', null);
        $videoId = $request->input('videoId', null);
        $cTweetId = $request->input('cTweetId', null);
        $cVideoId = $request->input('cVideoId', null);

        $user = $request->user();

        $fallacy = Fallacy::create([
            'explanation' => $explanation,
            'page_id' => '',
            'ref_id' => $refId,
            'slug' => '',
            'title' => '',
            'user_id' => $user->id
        ]);
        $fallacy->refresh();

        if ($tweetId) {
            FallacyTwitter::create([
                'fallacy_id' => $fallacy->id,
                'highlighted_text' => $highlightedText,
                'tweet_id' => $tweetId
            ]);
        }

        if ($videoId) {
            $startTime = $request->input('startTime', null);
            $endTime = $request->input('endTime', null);

            FallacyYouTube::create([
                'end_time' => $endTime,
                'fallacy_id' => $fallacy->id,
                'start_time' => $startTime,
                'video_id' => $videoId
            ]);
        }

        if ($cTweetId) {
            ContradictionTwitter::create([
                'fallacy_id' => $fallacy->id,
                'highlighted_text' => $highlightedText,
                'tweet_id' => $cTweetId
            ]);
        }

        if ($cVideoId) {
            $cStartTime = $request->input('startTime', null);
            $cEndTime = $request->input('endTime', null);

            ContradictionYouTube::create([
                'end_time' => $cEndTime,
                'fallacy_id' => $fallacy->id,
                'start_time' => $cStartTime,
                'video_id' => $cVideoId
            ]);
        }

        $fallacy->refresh();

        return new FallacyResource($fallacy);
    }

    public function migrate()
    {
        $all = Tweet::all()->toArray();
        for ($i = 0; $i < count($all); $i++) {
            $entry = $all[$i];
            // dump($entry);

            $data = [];
            $tweetJson = @json_decode($entry['tweet_json'], true);
            $realFullText = $tweetJson['full_text'];
            // dd($tweetJson);

            $data['full_text'] = $realFullText;
            $data['tweet_id'] = $tweetJson['id_str'];

            if ($entry['retweeted_tweet_id'] && array_key_exists('retweeted_status', $tweetJson)) {
                $realRtText = $tweetJson['retweeted_status']['full_text'];
                $data['retweeted_full_text'] = $realRtText;
                $data['retweeted_tweet_id'] = $tweetJson['retweeted_status']['id_str'];
            }

            if ($entry['quoted_tweet_id'] && array_key_exists('quoted_status', $tweetJson)) {
                $realQtText = $tweetJson['quoted_status']['full_text'];
                $data['quoted_full_text'] = $realQtText;
                $data['quoted_tweet_id'] = $tweetJson['quoted_status']['id_str'];
            }

            // dump($data);
            Tweet::where('id', $entry['id'])->update($data);

            /*
            // $contradiction = $entry['contradiction'];
            $pageId = $entry['page_id'];
            $startTime = $entry['start_time'];
            $endTime = $entry['end_time'];
            $highlightedText = $entry['highlighted_text'];
            $mediaId = $entry['media_id'];
            $network = $entry['network'];
            */

            /*
            unset($entry['contradiction']);
            unset($entry['start_time']);
            unset($entry['end_time']);
            unset($entry['highlighted_text']);
            unset($entry['media_id']);
            unset($entry['network']);

            $page = Page::where('social_media_id', $pageId)->first();
            if (empty($page)) {
                continue;
            }

            $entry['page_id'] = $page['id'];

            $fallacy = Fallacy::create($entry);
            $fallacy->refresh();
            */

            /*
            if ($network === 'twitter') {
                $twitter = Tweet::where('tweet_id', $mediaId)->first();
                if (empty($twitter)) {
                    continue;
                }

                FallacyTwitter::create([
                    'fallacy_id' => $entry['id'],
                    'highlighted_text' => $highlightedText,
                    'tweet_id' => $twitter['id'],
                ]);
            }

            if ($network === 'youtube') {
                $video = Video::where('video_id', $mediaId)->first();
                if (empty($video)) {
                    continue;
                }

                FallacyYouTube::create([
                    'end_time' => $endTime,
                    'fallacy_id' => $entry['id'],
                    'start_time' => $startTime,
                    'video_id' => $video['id'],
                ]);
            }
            */

            /*
            if ($contradiction) {
                if ($contradiction['network'] === 'twitter') {
                    $tweet = Tweet::where('tweet_id', $contradiction['media_id'])->first();

                    if (empty($tweet)) {
                        continue;
                    }
                
                    ContradictionTwitter::create([
                        'fallacy_id' => $contradiction['fallacy_entry_id'],
                        'highlighted_text' => $contradiction['highlighted_text'],
                        'tweet_id' => $tweet['id'],
                    ]);
                }

                if ($contradiction['network'] === 'youtube') {
                    $video = Video::where('video_id', $contradiction['media_id'])->first();

                    if (empty($video)) {
                        continue;
                    }

                    ContradictionYouTube::create([
                        'start_time' => $contradiction['start_time'],
                        'end_time' => $contradiction['end_time'],
                        'fallacy_id' => $contradiction['fallacy_entry_id'],
                        'video_id' => $video['id'],
                    ]);
                }
            }
            */
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Fallacy  $fallacy
     * @return \Illuminate\Http\Response
     */
    public function destroy(Fallacy $fallacy)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Fallacy  $fallacy
     * @return \Illuminate\Http\Response
     */
    public function edit(Fallacy $fallacy)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $fallacy = Fallacy::where('id', $id)
            ->with([
                'contradiction_twitter',
                'contradiction_youtube',
                'tweet',
                'video',
                'page',
                'user',
                'reference'
            ])
            ->first();

        if (empty($fallacy)) {
            return response([
                'message' => 'That fallacy does not exist'
            ], 404);
        }

        return new FallacyResource($fallacy);
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
     * @param  \App\Models\Fallacy  $fallacy
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Fallacy $fallacy)
    {
        //
    }
}
