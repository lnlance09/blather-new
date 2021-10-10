<?php

namespace App\Http\Controllers;

use App\Http\Resources\Argument as ArgumentResource;
use App\Http\Resources\ArgumentCollection;
use App\Models\Argument;
use Illuminate\Http\Request;

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
            ->with(['contradictions', 'images', 'tweets'])
            ->withCounts(['contradictions', 'images', 'tweets'])
            ->first();

        if (empty($arg)) {
            return response([
                'message' => 'That page does not exist'
            ], 404);
        }

        return new ArgumentResource($arg);
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
     * @param  \App\Models\Argument  $argument
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Argument $argument)
    {
        //
    }
}
