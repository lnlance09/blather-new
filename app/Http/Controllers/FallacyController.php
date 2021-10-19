<?php

namespace App\Http\Controllers;

use App\Http\Resources\Fallacy as FallacyResource;
use App\Http\Resources\FallacyCollection;

use App\Models\ContradictionTwitter;
use App\Models\ContradictionYouTube;
use App\Models\Fallacy;
use App\Models\FallacyTwitter;
use App\Models\FallacyYouTube;
use App\Models\GroupMember;
use App\Models\Reference;
use App\Models\Tweet;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $_q = $q;
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
                $query->where('tweet_id', $tweetId);
            });
        }

        if (!empty($q)) {
            $fallacies = $fallacies->where('explanation', 'LIKE', '%' . $q . '%');
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
        $user = $request->user();
        $userId = $user ? $user->id : 6;

        $request->validate([
            'tweet' => 'bail|required|exists:tweets,id',
            'explanation' => 'bail|required',
            'refId' => 'bail|required|exists:reference,id'
        ]);

        $refId = $request->input('refId');
        $explanation = $request->input('explanation');
        $groupId = $request->input('groupId', null);

        $tweetId = $request->input('tweet', null);
        $highlightedText = $request->input('highlightedText', null);

        $videoId = $request->input('video', null);
        $startTime = $request->input('startTime', null);
        $endTime = $request->input('endTime', null);

        $cTweetId = $request->input('cTweet', null);
        $cHighlightedText = $request->input('cHighlightedText', null);

        $cVideoId = $request->input('cVideo', null);
        $cStartTime = $request->input('cStartTime', null);
        $cEndTime = $request->input('cEndTime', null);

        $isContradiction = $refId == 21;

        $page = null;
        $pageId = null;

        if ($tweetId) {
            $tweet = Tweet::with(['page'])
                ->where('id', $tweetId)
                ->first();
            $page = $tweet->page;
            $pageId = $page->id;
        }

        $cPage = null;
        $cPageId = null;

        if ($isContradiction && $cTweetId) {
            $cTweet = Tweet::with(['page'])
                ->where('id', $tweetId)
                ->first();
            $cPage = $cTweet->page;
            $cPageId = $cPage->id;

            if ($groupId) {
                $pageIsMember = GroupMember::where([
                    'group_id' => $groupId,
                    'page_id' => $pageId
                ])->count();

                if (!$pageIsMember) {
                    return response([
                        'message' => $page->name . ' is not a member of that group'
                    ], 404);
                }

                $cPageIsMember = GroupMember::where([
                    'group_id' => $groupId,
                    'page_id' => $cPageId
                ])->count();

                if (!$cPageIsMember) {
                    return response([
                        'message' => $cPage->name . ' is not a member of that group'
                    ], 404);
                }
            } else {
                if ($cPageId !== $pageId) {
                    return response([
                        'message' => 'Contradictions must be from the same page'
                    ], 404);
                }
            }
        }

        $ref = Reference::where('id', $refId)->first();
        $title = $ref->name . ' by ' . $page->name;

        $fallacy = Fallacy::create([
            'explanation' => $explanation,
            'slug' => Str::slug($title, '-'),
            'title' => $title,
            'page_id' => $pageId,
            'ref_id' => $refId,
            'user_id' => $userId
        ]);
        $fallacy->refresh();

        $fallacy->slug = Str::slug($title . ' ' . $fallacy->id, '-');
        $fallacy->save();
        $fallacy->refresh();

        if ($tweetId) {
            FallacyTwitter::create([
                'fallacy_id' => $fallacy->id,
                'highlighted_text' => $highlightedText,
                'tweet_id' => $tweetId
            ]);
        }

        if ($cTweetId) {
            ContradictionTwitter::create([
                'fallacy_id' => $fallacy->id,
                'highlighted_text' => $cHighlightedText,
                'tweet_id' => $cTweetId
            ]);
        }

        if ($videoId) {
            FallacyYouTube::create([
                'end_time' => $endTime,
                'fallacy_id' => $fallacy->id,
                'start_time' => $startTime,
                'video_id' => $videoId
            ]);
        }

        if ($cVideoId) {
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
        /*
        $json = Storage::disk('local')->get('public/arguments.json');
        $json = json_decode($json, true);
        // dd($json);

        $tweetController = new TweetController;

        for ($i = 0; $i < count($json); $i++) {
            $item = $json[$i];

            $description = $item['description'];
            $explanation = implode('. ', $item['tips']);
            $slug = $item['argument'];
            $meme = $item['meme'];
            $images = $item['images'];
            $examples =  $item['examples'];
            $contradictions = $item['contradictions'];

            $argData = [
                'description' => $description,
                'explanation' => $explanation,
                'slug' => $slug
            ];
            $arg = Argument::create($argData);
            $arg->refresh();

            if (is_array($meme)) {
                $images = array_merge($images, $meme);
            } else {
                $image[] = $meme;
            }

            for ($x = 0; $x < count($images); $x++) {
                $contents = file_get_contents($images[$x]);
                $img = 'arguments/' . Str::random(24) . '.jpg';
                Storage::disk('s3')->put($img, $contents);

                ArgumentImage::create([
                    'argument_id' => $arg->id,
                    'caption' => '',
                    's3_link' => $img
                ]);
            }

            for ($x = 0; $x < count($examples); $x++) {
                $url = parse_url($examples[$x]);
                if (!array_key_exists('host', $url)) {
                    continue;
                }

                if ($url['host'] === 'twitter.com') {
                    $segs = explode('/', $url['path']);
                    $tweetId = end($segs);
                    $tweet = $tweetController->show($tweetId);

                    if ($tweet) {
                        ArgumentExampleTweet::create([
                            'argument_id' => $arg->id,
                            'tweet_id' => $tweet->id
                        ]);
                    }
                }
            }
        }

        for ($i = 0; $i < count($json); $i++) {
            $item = $json[$i];
            $slug = $item['argument'];
            $contradictions = $item['contradictions'];

            $arg = Argument::where('slug', $slug)->first();
            if (empty($arg)) {
                continue;
            }

            for ($x = 0; $x < count($contradictions); $x++) {
                $c = $contradictions[$x];

                $cArg = Argument::where('slug', $c['argument'])->first();
                if (empty($cArg)) {
                    continue;
                }

                ArgumentContradiction::create([
                    'argument_id' => $arg->id,
                    'contradicting_argument_id' => $cArg->id,
                    'explanation' => $c['description']
                ]);
            }
        }
        */
        die;

        /*
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

            // $contradiction = $entry['contradiction'];
            $pageId = $entry['page_id'];
            $startTime = $entry['start_time'];
            $endTime = $entry['end_time'];
            $highlightedText = $entry['highlighted_text'];
            $mediaId = $entry['media_id'];
            $network = $entry['network'];

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
        }
        */
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
     * @param  String  $slug
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $fallacy = Fallacy::where('slug', $slug)
            ->with(self::DEFAULT_WITH)
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
