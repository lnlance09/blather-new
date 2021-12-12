<?php

namespace App\Http\Controllers;

use App\Http\Resources\Video as VideoResource;
use App\Models\Page;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VideoController extends Controller
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
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return PredictionResource
     * @param  \Illuminate\Http\Request  $request
     */
    public function create(Request $request)
    {
        $video = Video::create([
            'description' => '',
            'dislike_count' => '',
            'like_count' => '',
            's3_link' => '',
            'thumbnail' => '',
            'title' => '',
            'video_id' => '',
            'view_count' => ''
        ]);
        $video->refresh();

        return response([
            'video' => $video
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Video  $video
     * @return \Illuminate\Http\Response
     */
    public function destroy(Video $video)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Video  $video
     * @return \Illuminate\Http\Response
     */
    public function edit(Video $video)
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
        $video = Video::where('video_id', $id)->first();

        if ($video) {
            return response([
                'video' => new VideoResource($video)
            ]);
        }

        $videoLive = Video::getVideoInfo($id);

        if (!$videoLive) {
            return response([
                'message' => 'Not found'
            ], 404);
        }

        $dateCreated = $videoLive['dateCreated'];
        $channelId = $videoLive['channelId'];
        $description = $videoLive['shortDescription'];
        $author = $videoLive['author'];
        $title = $videoLive['title'];
        $thumbnail = end($videoLive['thumbnail']['thumbnails'])['url'];
        $viewCount = $videoLive['viewCount'];

        $page = Page::updateOrCreate(
            [
                'network' => 'youtube',
                'social_media_id' => $channelId
            ],
            [
                'bio' => '',
                'image' => '',
                'name' => $author,
                'username' => ''
            ],
        );

        $video = Video::create([
            'date_created' => $dateCreated,
            'description' => $description,
            'page_id' => $page->id,
            's3_link' => '',
            'thumbnail' => $thumbnail,
            'title' => $title,
            'video_id' => $id,
            'view_count' => $viewCount
        ]);

        return response([
            'video' => new VideoResource($video)
        ]);
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
    }
}
