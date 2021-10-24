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
use App\Models\Page;
use App\Models\Reference;
use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FallacyController extends Controller
{
    const DEFAULT_WITH = [
        'group',
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

    public function addImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image',
        ]);
        $file = $request->file('file');

        $img = 'uploads/' . Str::random(24) . '.jpg';
        Storage::disk('s3')->put($img, file_get_contents($file));

        return response()->json([
            'image' => env('AWS_URL', 'https://blather-new.s3.us-west-2.amazonaws.com/') . $img
        ]);
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
            'group_id' => $groupId,
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
