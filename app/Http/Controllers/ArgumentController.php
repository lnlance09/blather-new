<?php

namespace App\Http\Controllers;

use App\Http\Resources\Argument as ArgumentResource;
use App\Http\Resources\ArgumentCollection;
use App\Http\Resources\ArgumentOptionCollection;
use App\Models\Argument;
use App\Models\ArgumentContradiction;
use Illuminate\Http\Request;
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

        $arg = Argument::where('id', $id)->first();

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
