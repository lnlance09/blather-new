<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Http\Resources\Page as PageResource;
use App\Http\Resources\PageCollection;
use App\Http\Resources\PageOptionCollection;
use Illuminate\Http\Request;

class PageController extends Controller
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
        $q = $request->input('q', null);
        $network = $request->input('network', 'all');
        $fallacyCount = $request->input('fallacyCount', 0);

        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'desc');

        $_q = $q;
        $where = [];
        if ($network !== 'all') {
            $where = [
                'network' => $network
            ];
        }

        $pages = Page::where(function ($q) use ($_q) {
            $q->where(function ($query) use ($_q) {
                $query->where('name', 'LIKE', '%' . $_q . '%');
            })->orWhere(function ($query) use ($_q) {
                $query->where('username', 'LIKE', '%' . $_q . '%');
            })->orWhere(function ($query) use ($_q) {
                $query->where('bio', 'LIKE', '%' . $_q . '%');
            });
        })
            ->where($where);

        if ($fallacyCount) {
            $pages = $pages->withCount([
                'fallacies',
            ]);
        }

        $pages = $pages->orderBy($sort, $dir)
            ->paginate(15);
        return new PageCollection($pages);
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
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\Response
     */
    public function destroy(Page $page)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\Response
     */
    public function edit(Page $page)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $id
     * @return \Illuminate\Http\Response
     */
    public function show($network, $username)
    {
        $page = Page::where([
            'network' => $network,
            'username' => $username
        ])
            ->withCount([
                'fallacies',
                'contradictions'
            ])
            ->first();

        if (empty($page)) {
            return response([
                'message' => 'That page does not exist'
            ], 404);
        }

        return new PageResource($page);
    }

    public function showOptions(Request $request)
    {
        $pages = Page::withCount(['fallacies'])
            ->orderBy('fallacies_count', 'desc')
            ->get();
        return new PageOptionCollection($pages);
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

    public function twitterCount()
    {
        $count = Page::where('network', 'twitter')->count();
        return response([
            'count' => $count
        ]);
    }

    public function youtubeCount()
    {
        $count = Page::where('network', 'youtube')->count();
        return response([
            'count' => $count
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Page $page)
    {
        //
    }
}
