<?php

namespace App\Http\Controllers;

use App\Http\Resources\Tweet as TweetResource;
use App\Http\Resources\TweetCollection;
use App\Http\Resources\UserCollection;
use App\Models\Tweet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TweetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = $request->input('q');
        $pageId = $request->input('pageId', null);
        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'asc');

        $tweets = Tweet::where('full_text', 'LIKE', '%' . $q . '%')
            // ->where('page_id', $pageId)
            ->orWhere('retweeted_full_text', 'LIKE', '%' . $q . '%')
            ->orWhere('quoted_full_text', 'LIKE', '%' . $q . '%')
            ->with(['page'])
            ->withCount(['fallacies'])
            ->whereHas('page')
            // ->whereHas('page', function ($query) use ($q) {
            //    $query->where('coin_id', $coinId)->where('status', 'Correct');
            // })
            ->orderBy($sort, $dir)
            ->paginate(15);
        return new TweetCollection($tweets);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tweet  $tweet
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tweet $tweet)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Tweet  $tweet
     * @return \Illuminate\Http\Response
     */
    public function edit(Tweet $tweet)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $id
     * @return CoinResource
     */
    public function show($id)
    {
        $tweet = Tweet::where('tweet_id', $id)->first();
        if (empty($tweet)) {
            return response([
                'message' => 'That tweet does not exist'
            ], 404);
        }

        return new TweetResource($tweet);
    }

    /**
     * 
     *
     * @param  Object  $coin
     * @return \App\Models\Coin $info
     */
    public function setLatestCoinInfo($coin)
    {
        $info = Tweet::getExtendedInfo($coin->cmc_id);

        if ($info) {
            $quote = current($info['quote']);
            $coin->circulating_supply = $info['circulating_supply'];
            $coin->last_price = $quote['price'];
            $coin->market_cap = $quote['market_cap'];
            $coin->max_supply = $info['max_supply'];
            $coin->percent_change_1h = $quote['percent_change_1h'];
            $coin->percent_change_24h = $quote['percent_change_24h'];
            $coin->percent_change_7d = $quote['percent_change_7d'];
            $coin->percent_change_30d = $quote['percent_change_30d'];
            $coin->percent_change_60d = $quote['percent_change_60d'];
            $coin->percent_change_90d = $quote['percent_change_90d'];
            $coin->total_supply = $info['total_supply'];
            $coin->volume_24h = $quote['volume_24h'];
            $coin->save();
            $coin->refresh();
        }

        return $coin;
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
     * @param  \App\Models\Tweet  $tweet
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tweet $tweet)
    {
        //
    }
}
