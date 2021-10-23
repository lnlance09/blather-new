<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReferenceCollection;
use App\Http\Resources\ReferenceOptionCollection;
use App\Models\Reference;
use Illuminate\Http\Request;

class ReferenceController extends Controller
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
        $ref = Reference::withCount(['fallacies'])
            ->orderBy('name')
            ->paginate(100);
        return new ReferenceCollection($ref);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return 
     * @param  \Illuminate\Http\Request  $request
     */
    public function create(Request $request)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Reference  $reference
     * @return \Illuminate\Http\Response
     */
    public function destroy(Reference $reference)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Reference  $reference
     * @return \Illuminate\Http\Response
     */
    public function edit(Reference $reference)
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
    }

    public function showOptions(Request $request)
    {
        $pageIds = $request->input('pageIds', null);

        $refs = Reference::orderBy('name', 'asc')->get();

        if ($pageIds) {
            $refs = Reference::where('id', '!=', 21)
                ->whereHas('fallacies', function ($query) use ($pageIds) {
                    $query->whereIn('page_id', $pageIds);
                })->withCount(['fallacies' => function ($query) use ($pageIds) {
                    $query->whereIn('page_id', $pageIds);
                }])->orderBy('fallacies_count', 'desc')->get();
        }

        return new ReferenceOptionCollection($refs);
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
        $value = $request->input('value', null);

        if ($user->id !== 1) {
            return response([
                'message' => 'Unauthorized'
            ], 403);
        }

        $ref = Reference::where('id', $id)->first();

        if (empty($ref)) {
            return response([
                'message' => 'Reference does not exist'
            ], 404);
        }

        $ref->description = $value;
        $ref->save();

        $refs = Reference::withCount(['fallacies'])
            ->orderBy('name')
            ->paginate(100);

        return new ReferenceCollection($refs);
    }
}
