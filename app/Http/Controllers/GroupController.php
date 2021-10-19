<?php

namespace App\Http\Controllers;

use App\Http\Resources\Group as GroupResourece;
use App\Http\Resources\GroupCollection;
use App\Http\Resources\GroupOptionCollection;
use App\Models\Group;
use App\Models\GroupMember;
use Illuminate\Http\Request;

class GroupController extends Controller
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
        $groups = Group::withCount(['pages'])
            ->with(['pages'])
            ->orderBy('name')
            ->paginate(100);
        return new GroupCollection($groups);
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
     * @param  \App\Models\Group  $group
     * @return \Illuminate\Http\Response
     */
    public function destroy(Group $group)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Group  $group
     * @return \Illuminate\Http\Response
     */
    public function edit(Group $group)
    {
        //
    }

    public function getGroupsByMember(Request $request)
    {
        $request->validate([
            'page' => 'bail|required|exists:pages,id',
        ]);

        $page = $request->input('page', null);
        $groups = Group::with(['members.page'])
            ->whereHas('members', function ($query) use ($page) {
                $query->where('page_id', $page);
            })
            ->get();
        return new GroupCollection($groups);
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
        $groups = Group::withCount(['members'])
            ->orderBy('id', 'asc')
            ->get();
        return new GroupOptionCollection($groups);
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
