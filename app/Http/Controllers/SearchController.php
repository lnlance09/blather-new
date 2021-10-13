<?php

namespace App\Http\Controllers;


use App\Models\Fallacy;
use App\Models\Page;
use App\Models\Tweet;
use App\Models\Video;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function counts(Request $request)
    {
        $q = $request->input('q', null);
        $network = $request->input('network', 'all');
        $pageIds = $request->input('pageIds', null);
        $refIds = $request->input('refIds', null);
        $userId = $request->input('userId', null);
        $retracted = $request->input('retracted', null);
        $status = $request->input('status', null);

        $_q = $q;

        // Page count
        $where = [];
        if ($network !== 'all') {
            $where = [
                'network' => $network
            ];
        }

        $pageCount = Page::all()->count();
        if (!empty($q)) {
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
            $pageCount = $pages->count();
        }

        // Fallacy count
        $where = [];

        if ($userId) {
            $where['user_id'] = $userId;
        }

        if ($status) {
            $where['status'] = $status;
        }

        if ($retracted) {
            $where['retracted'] = $retracted;
        }

        $fallacies = Fallacy::where($where)->whereNotIn('ref_id', [21]);
        if (!empty($q)) {
            $fallacies = $fallacies->where('explanation', 'LIKE', '%' . $_q . '%');
        }
        $fallacyCount = $fallacies->count();

        // Contradiction count
        $contradictionCount = Fallacy::where($where)
            ->where('ref_id', 21)
            ->where('explanation', 'LIKE', '%' . $_q . '%')
            ->count();

        // Tweet count
        $tweets = Tweet::where(function ($q) use ($_q) {
            $q->where(function ($query) use ($_q) {
                $query->where('full_text', 'LIKE', '%' . $_q . '%');
            })->orWhere(function ($query) use ($_q) {
                $query->where('retweeted_full_text', 'LIKE', '%' . $_q . '%');
            })->orWhere(function ($query) use ($_q) {
                $query->where('quoted_full_text', 'LIKE', '%' . $_q . '%');
            });
        });

        if (is_array($pageIds)) {
            //    $tweets = $tweets->whereIn('page_id', $pageIds);
        }

        $tweetCount = $tweets->count();

        return response([
            'contradictions' => $contradictionCount,
            'fallacies' => $fallacyCount,
            'pages' => $pageCount,
            'tweets' => $tweetCount
        ]);
    }
}
