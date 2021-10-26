<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentCollection;
use App\Http\Resources\Comment as CommentResource;
use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\CommentResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
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
        $fallacyId = $request->input('fallacyId');
        $userId = $request->input('userId');
        $sort = $request->input('sort', 'created_at');
        $dir = $request->input('dir', 'desc');

        $comments = Comment::with([
            'likes',
            'responses',
            'user'
        ])->withCount(['likes', 'responses']);

        if ($fallacyId) {
            $comments = $comments->where('fallacy_id', $fallacyId);
        }

        if ($userId) {
            $comments = $comments->where('user_id', $userId);
        }

        $comments = $comments->orderBy($sort, $dir)
            ->paginate(15);
        return new CommentCollection($comments);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $request->validate([
            'fallacyId' => 'bail|required|exists:fallacies,id',
            'msg' => 'bail|required',
            'responseTo' => 'exists:comments,id'
        ]);

        $fallacyId = $request->input('fallacyId');
        $msg = $request->input('msg');
        $responseTo = $request->input('responseTo');

        $user = $request->user();
        $userId = $user ? $user->id : 6;

        if ($responseTo) {
            $comment = CommentResponse::create([
                'response_to' => $responseTo,
                'msg' => $msg,
                'user_id' => $userId
            ]);
        } else {
            $comment = Comment::create([
                'fallacy_id' => $fallacyId,
                'msg' => $msg,
                'user_id' => $userId
            ]);
        }

        return new CommentResource($comment);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $id
     * @return CommentResource
     */
    public function show($id)
    {
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
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }
}
