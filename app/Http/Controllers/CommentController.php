<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentCollection;
use App\Http\Resources\Comment as CommentResource;
use App\Http\Resources\CommentResponse as CommentResponseResource;
use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\CommentResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $userIds = $request->input('userIds');
        $sort = $request->input('sort', 'created_at');
        $dir = $request->input('dir', 'desc');

        $user = auth('api')->user();
        $userId = $user ? $user->id : null;

        $comments = Comment::with([
            'likes',
            'responses' => function ($query) use ($userId) {
                $query->withCount(['likes', 'likedByMe']);
            },
            'user'
        ])->withCount([
            'likedByMe' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            },
            'likes',
            'responses'
        ]);

        if ($fallacyId) {
            $comments = $comments->where('fallacy_id', $fallacyId);
        }

        if ($userIds) {
            $comments = $comments->whereIn('user_id', $userIds);
        }

        $comments = $comments->orderBy($sort, $dir)
            ->paginate(15);

        Log::info($comments);

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
            'responseTo' => 'sometimes|nullable|exists:comments,id'
        ]);

        $fallacyId = $request->input('fallacyId');
        $msg = $request->input('msg');
        $responseTo = $request->input('responseTo');

        $user = auth('api')->user();
        $userId = $user ? $user->id : 6;

        if ($responseTo) {
            $comment = CommentResponse::create([
                'response_to' => $responseTo,
                'msg' => $msg,
                'user_id' => $userId
            ]);
            return new CommentResponseResource($comment);
        }

        $comment = Comment::create([
            'fallacy_id' => $fallacyId,
            'msg' => $msg,
            'user_id' => $userId
        ]);

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

    public function like(Request $request)
    {
        $request->validate([
            'commentId' => 'bail|required|exists:comments,id',
            'responseId' => 'sometimes|nullable|exists:comments_responses,id'
        ]);

        $commentId = $request->input('commentId');
        $responseId = $request->input('responseId', null);

        $data = [
            'comment_id' => $commentId,
            'response_id' => $responseId,
            'user_id' => $request->user()->id
        ];
        Log::info($data);
        $count = CommentLike::where($data)->count();

        if ($count == 0) {
            CommentLike::create($data);
        }

        return response([
            'success' => true
        ]);
    }

    public function unlike(Request $request)
    {
        $request->validate([
            'commentId' => 'bail|required|exists:comments,id',
            'responseId' => 'sometimes|nullable|exists:comments_responses,id'
        ]);

        $commentId = $request->input('commentId');
        $responseId = $request->input('responseId', null);

        $data = [
            'comment_id' => $commentId,
            'response_id' => $responseId,
            'user_id' => $request->user()->id
        ];
        $comment = CommentLike::where($data)->first();

        if (!empty($comment)) {
            $comment->delete();
        }

        return response([
            'success' => true
        ]);
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
