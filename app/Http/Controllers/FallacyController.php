<?php

namespace App\Http\Controllers;

use App\Http\Resources\Fallacy as FallacyResource;
use App\Http\Resources\Reference as ReferenceResource;
use App\Http\Resources\FallacyCollection;
use App\Models\ContradictionTwitter;
use App\Models\ContradictionYouTube;
use App\Models\Fallacy;
use App\Models\FallacyTwitter;
use App\Models\FallacyYouTube;
use App\Models\GroupMember;
use App\Models\Reference;
use App\Models\Tweet;
use App\Models\Video;
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
        $userIds = $request->input('userIds', null);
        $retracted = $request->input('retracted', null);
        $status = $request->input('status', null);
        $includeContradictions = $request->input('includeContradictions', false);
        $tweetId = $request->input('tweetId', null);
        $commentCount = $request->input('commentCount', false);
        $with = $request->input('with', self::DEFAULT_WITH);

        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'desc');

        $_q = $q;
        $where = [];

        if ($status) {
            $where['status'] = $status;
        }

        if ($retracted) {
            $where['retracted'] = $retracted;
        }

        $fallacies = Fallacy::with($with);

        if ($commentCount) {
            $fallacies = $fallacies->withCount(['comments']);
        }

        $fallacies = $fallacies->where($where);

        if (!$includeContradictions) {
            $fallacies = $fallacies->whereNotIn('ref_id', [21]);
        }

        if (is_array($pageIds)) {
            $fallacies = $fallacies->whereIn('page_id', $pageIds);
        }

        if (is_array($refIds)) {
            $fallacies = $fallacies->whereIn('ref_id', $refIds);
        }

        if (is_array($userIds)) {
            $fallacies = $fallacies->whereIn('user_id', $userIds);
        }

        if ($tweetId) {
            $fallacies = $fallacies->where(function ($query) use ($tweetId) {
                $query->whereHas('twitter', function ($query) use ($tweetId) {
                    $query->where('tweet_id', $tweetId);
                })->orWhereHas('contradictionTwitter', function ($query) use ($tweetId) {
                    $query->where('tweet_id', $tweetId);
                });
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

        return response([
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
        $user = auth('api')->user();
        $userId = $user ? $user->id : 6;

        $request->validate([
            'tweet' => 'sometimes|nullable|exists:tweets,id',
            'cTweet' => 'sometimes|nullable|exists:tweets,id',
            'video' => 'sometimes|nullable|exists:videos,id',
            'cVideo' => 'sometimes|nullable|exists:videos,id',
            'explanation' => 'bail|required',
            'refId' => 'bail|required|exists:reference,id',
            'groupId' => 'sometimes|nullable|exists:groups,id'
        ]);

        $refId = $request->input('refId');
        $explanation = $request->input('explanation');
        $groupId = $request->input('groupId', null);

        $tweetId = $request->input('tweet', null);
        $highlightedText = $request->input('highlightedText', null);

        $cTweetId = $request->input('cTweet', null);
        $highlightedTextC = $request->input('highlightedTextC', null);

        $videoId = $request->input('video', null);
        $startTime = $request->input('startTime', null);
        $endTime = $request->input('endTime', null);

        $cVideoId = $request->input('cVideo', null);
        $cStartTime = $request->input('startTimeCont', null);
        $cEndTime = $request->input('endTimeCont', null);

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

        if ($videoId) {
            $video = Video::with(['page'])
                ->where('id', $videoId)
                ->first();
            $page = $video->page;
            $pageId = $page->id;
        }

        $cPage = null;
        $cPageId = null;

        if ($isContradiction) {
            if ($tweetId && $cTweetId) {
                $cTweet = Tweet::with(['page'])
                    ->where('id', $cTweetId)
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
                        ], 401);
                    }

                    $cPageIsMember = GroupMember::where([
                        'group_id' => $groupId,
                        'page_id' => $cPageId
                    ])->count();

                    if (!$cPageIsMember) {
                        return response([
                            'message' => $cPage->name . ' is not a member of that group'
                        ], 401);
                    }
                } else {
                    if ($cPageId !== $pageId) {
                        return response([
                            'message' => 'Contradictions must be from the same page'
                        ], 401);
                    }
                }
            }

            if ($cVideoId) {
                $cVideo = Video::with(['page'])
                    ->where('id', $cVideoId)
                    ->first();
                $cPage = $cVideo->page;
                $cPageId = $cPage->id;
            }
        }

        $ref = Reference::find($refId);
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
                'highlighted_text' => $highlightedTextC,
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
    }

    public function getRelated(Request $request)
    {
        $args = $request->input('args', []);
        $id = $request->input('id', null);
        $network = $request->input('network', 'twitter');
        $tweetIds = $request->input('tweetIds', []);

        if ($network == 'twitter') {
            $fallacies = Fallacy::where(function ($query) use ($args, $tweetIds, $id) {
                $query->whereHas('twitter', function ($query) use ($args, $tweetIds) {
                    $query->whereHas('tweet', function ($query) use ($args, $tweetIds) {
                        $query->where(function ($query) use ($args) {
                            $query->whereHas('arguments', function ($query) use ($args) {
                                $query->whereHas('argument', function ($query) use ($args) {
                                    $query->whereIn('id', $args);
                                });
                            });
                        })->orWhereIn('id', $tweetIds);
                    });
                })->where('id', '!=', $id);;
            })->orWhere(function ($query) use ($args, $tweetIds, $id) {
                $query->whereHas('contradictionTwitter', function ($query) use ($args, $tweetIds) {
                    $query->whereHas('tweet', function ($query) use ($args, $tweetIds) {
                        $query->where(function ($query) use ($args) {
                            $query->whereHas('arguments', function ($query) use ($args) {
                                $query->whereHas('argument', function ($query) use ($args) {
                                    $query->whereIn('id', $args);
                                });
                            });
                        })->orWhereIn('id', $tweetIds);
                    });
                })->where('id', '!=', $id);
            });
        }

        if ($network == 'youtube') {
        }

        $fallacies = $fallacies->get();

        return new FallacyCollection($fallacies);
    }

    public function saveScreenshot(Request $request)
    {
        $request->validate([
            'id' => 'bail|required|exists:fallacies,id',
            'file' => 'required|image',
        ]);

        $id = $request->input('id');
        $file = $request->file('file');

        $img = 'screenshots/' . Str::random(24) . '.png';
        Storage::disk('s3')->put($img, file_get_contents($file));

        $fallacy = Fallacy::find($id);
        $fallacy->s3_link = $img;
        $fallacy->save();

        return response([
            'success' => true
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $slug
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $parts = explode('-', $slug);
        $id = end($parts);

        $fallacy = Fallacy::where('slug', $slug)
            ->orWhere('id', $slug)
            ->orWhere('id', $id)
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
        $request->validate([
            'id' => 'bail|required|exists:fallacies,id',
            'assignee' => 'sometimes|nullable|exists:pages,id',
            'refId' => 'sometimes|nullable|exists:reference,id',
            'explanation' => 'sometimes|nullable|required'
        ]);

        $id = $request->input('id');
        $assignee = $request->input('assignee', null);
        $refId = $request->input('refId', null);
        $explanation = $request->input('explanation', null);
        $highlightedText = $request->input('highlightedText', null);
        $highlightedText2 = $request->input('highlightedText2', null);
        $startTime = $request->input('startTime', null);
        $endTime = $request->input('endTime', null);
        $startTimeCont = $request->input('startTimeCont', null);
        $endTimeCont = $request->input('endTimeCont', null);

        $fallacy = Fallacy::where('id', $id)
            ->with(['page', 'twitter.tweet', 'contradictionTwitter.tweet'])
            ->first();

        if (!empty($explanation)) {
            $fallacy->explanation = $explanation;
        }

        if ($refId) {
            $ref = Reference::find($refId);
            $fallacy->ref_id = $refId;
            $fallacy->title = $ref->name . ' by ' . $fallacy->page->name;
        }

        if ($assignee) {
            $fallacy->page_id = $assignee;
        }

        $changes = $fallacy->getDirty();
        $fallacy->save();

        $data = [];

        if (array_key_exists('explanation', $changes)) {
            $data['explanation'] = $changes['explanation'];
        }

        if (array_key_exists('title', $changes)) {
            $data['title'] = $changes['title'];
        }

        if (array_key_exists('ref_id', $changes)) {
            $data['reference'] = new ReferenceResource($ref);
        }

        if ($highlightedText && isset($fallacy->twitter)) {
            FallacyTwitter::updateOrCreate(
                [
                    'fallacy_id' => $id,
                    'tweet_id' => $fallacy->twitter->tweet->id,
                ],
                [
                    'highlighted_text' => $highlightedText
                ],
            );
        }

        if ($highlightedText2 && isset($fallacy->contradictionTwitter)) {
            ContradictionTwitter::updateOrCreate(
                [
                    'fallacy_id' => $id,
                    'tweet_id' => $fallacy->contradictionTwitter->tweet->id,
                ],
                [
                    'highlighted_text' => $highlightedText2
                ],
            );
        }

        if ($startTime && $endTime && isset($fallacy->youtube)) {
            FallacyYouTube::updateOrCreate(
                [
                    'fallacy_id' => $id,
                    'video_id' => $fallacy->youtube->video->id,
                ],
                [
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ],
            );
        }

        if ($startTimeCont && $endTimeCont && isset($fallacy->contradictionYouTube)) {
            ContradictionYouTube::updateOrCreate(
                [
                    'fallacy_id' => $id,
                    'video_id' => $fallacy->contradictionYouTube->video->id,
                ],
                [
                    'start_time' => $startTimeCont,
                    'end_time' => $endTimeCont,
                ],
            );
        }

        return response($data);
    }
}
