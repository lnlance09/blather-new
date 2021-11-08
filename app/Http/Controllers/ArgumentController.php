<?php

namespace App\Http\Controllers;

use App\Http\Resources\Argument as ArgumentResource;
use App\Http\Resources\ArgumentImage as ArgumentImageResource;
use App\Http\Resources\ArgumentCollection;
use App\Http\Resources\ArgumentOptionCollection;
use App\Http\Resources\FallacyCollection;
use App\Http\Resources\PageCollection;
use App\Models\Argument;
use App\Models\ArgumentContradiction;
use App\Models\ArgumentImage;
use App\Models\Fallacy;
use App\Models\Page;
use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArgumentController extends Controller
{
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
        $args = Argument::with(['contradictions.contradiction', 'images', 'tweets.tweet'])
            ->withCount(['contradictions', 'images', 'tweets'])
            ->get();
        return new ArgumentCollection($args);
    }

    public function addImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image',
        ]);

        $id = $request->input('id', null);
        $file = $request->file('file');

        $img = 'arguments/' . Str::random(24) . '.jpg';
        Storage::disk('s3')->put($img, file_get_contents($file));

        $image = ArgumentImage::create([
            'argument_id' => $id,
            's3_link' => $img
        ]);

        return response([
            'image' => new ArgumentImageResource($image),
            's3Link' => $img
        ]);
        return new ArgumentImageResource($image);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return PredictionResource
     * @param  \Illuminate\Http\Request  $request
     */
    public function create(Request $request)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Argument  $argument
     * @return \Illuminate\Http\Response
     */
    public function destroy(Argument $argument)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Argument  $argument
     * @return \Illuminate\Http\Response
     */
    public function edit(Argument $argument)
    {
        //
    }

    public function getArgumentsByFallacy(Request $request)
    {
        $id = $request->input('id', null);
        $pageId = $request->input('pageId', null);

        $args = Argument::whereHas('tweets', function ($query) use ($id) {
            $query->whereHas('tweet', function ($query) use ($id) {
                $query->whereHas('fallacies', function ($query) use ($id) {
                    $query->whereHas('fallacy', function ($query) use ($id) {
                        $query->where('id', $id);
                    });
                })->orWhere(function ($query) use ($id) {
                    $query->whereHas('contradictions', function ($query) use ($id) {
                        $query->where('fallacy_id', $id);
                    });
                });
            });
        });

        if ($pageId) {
            $args = $args->withCount(['tweets' => function ($query) use ($pageId) {
                $tweetIds = Tweet::where('page_id', $pageId)->pluck('id')->toArray();
                $query->whereIn('tweet_id', $tweetIds);
            }]);
        }

        $args = $args->get();

        return new ArgumentCollection($args);
    }

    public function getFallaciesByArg(Request $request)
    {
        $id = $request->input('id', null);

        $fallacies = Fallacy::whereHas('twitter.tweet.arguments', function ($query) use ($id) {
            $query->where('argument_id', $id);
        })
            ->paginate(15);

        return new FallacyCollection($fallacies);
    }

    public function getPagesByArg(Request $request)
    {
        $id = $request->input('id', null);

        $pages = Page::whereHas('tweets.arguments', function ($query) use ($id) {
            $query->where('argument_id', $id);
        })
            ->withCount(['tweets' => function ($query) use ($id) {
                $query->whereHas('arguments', function ($query) use ($id) {
                    $query->where('argument_id', $id);
                });
            }])
            ->orderBy('tweets_count', 'desc')
            ->limit(5)
            ->get();

        return new PageCollection($pages);
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $slug
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $arg = Argument::where([
            'slug' => $slug
        ])
            ->with(['contradictions', 'images'])
            ->withCount(['contradictions', 'images', 'tweets'])
            ->first();

        if (empty($arg)) {
            return response([
                'message' => 'That page does not exist'
            ], 404);
        }

        return new ArgumentResource($arg);
    }

    public function showOptions(Request $request)
    {
        $args = Argument::orderBy('description', 'asc')->get();
        return new ArgumentOptionCollection($args);
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
     * @param  Int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $user = $request->user();

        $description = $request->input('description', null);
        $explanation = $request->input('explanation', null);
        $contradictions = $request->input('contradictions', []);

        if ($user->id !== 1) {
            return response([
                'message' => 'Unauthorized'
            ], 403);
        }

        $arg = Argument::find($id);

        if (empty($arg)) {
            return response([
                'message' => 'Argument does not exist'
            ], 404);
        }

        $arg->description = $description;
        $arg->explanation = $explanation;
        $arg->slug = Str::slug($description);
        $arg->save();

        foreach ($contradictions as $c) {
            $cExists = ArgumentContradiction::where([
                'argument_id' => $id,
                'contradicting_argument_id' => $c
            ])->count() == 1;

            if (!$cExists) {
                ArgumentContradiction::create([
                    'argument_id' => $id,
                    'contradicting_argument_id' => $c
                ]);
            }
        }

        ArgumentContradiction::where('id', $id)
            ->whereNotIn('contradicting_argument_id', $contradictions)
            ->delete();

        $args = Argument::with(['contradictions.contradiction', 'images', 'tweets.tweet'])
            ->withCount(['contradictions', 'images', 'tweets'])
            ->get();

        return new ArgumentCollection($args);
    }
}
