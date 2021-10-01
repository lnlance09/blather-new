<?php

use App\Models\Coin;
use App\Models\Prediction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

$awsUrl = env('AWS_URL', 'https://preditc.s3.us-west-2.amazonaws.com/');
$baseUrl = env('APP_URL', 'https://preditc.com/');
$siteName = env('APP_NAME', 'Preditc');
$twitterHandle = env('TWITTER_HANDLE', '@preditcapp');

$seo = [
    'author' => null,
    'authorUrl' => null,
    'awsUrl' => $awsUrl,
    'baseUrl' => $baseUrl,
    'description' => $siteName . ' is a social network that is used to share ideas and opinions about cryptocurrencies and their future performances',
    'img' => [
        'height' => 313,
        'width' => 313,
        'src' => $awsUrl . 'public/blockchain.png'
    ],
    'keywords' => 'cryptocurrency,coins,tokens,predictions,bitcoin,ethereum,influencers,technical analysis,wall street',
    'schema' => '',
    'siteName' => $siteName,
    'title' => $siteName,
    'twitterHandle' => $twitterHandle,
    'url' => $baseUrl
];

Route::get('/', function () use ($seo) {
    $seo['title'] = 'Home - ' . $seo['siteName'];
    return view('index', $seo);
});

Route::get('/about', function () use ($seo) {
    $seo['title'] = 'About - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'about';
    return view('index', $seo);
});

Route::get('/applications', function () use ($seo) {
    $seo['title'] = 'Applications - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'applications';
    return view('index', $seo);
});

Route::get('/coins/{slug}', function ($slug) use ($seo) {
    $coin = Coin::where('slug', $slug)->first();

    if (empty($coin)) {
        return view('index', $seo);
    }

    $img = $seo['awsUrl'] . $coin->logo;
    $imgData = getimagesize($img);
    $width = $imgData[0];
    $height = $imgData[1];

    $seo['description'] = $coin->description;
    $seo['img'] = [
        'height' => $height,
        'src' => $img,
        'width' => $width
    ];
    $seo['title'] = $coin->name . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'coins/' . $slug;

    return view('index', $seo);
});

Route::get('/coins', function () use ($seo) {
    $seo['description'] = 'Browse cryptocurrencies, tokens and coins on preditc.com';
    $seo['title'] = 'Coins - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'coins';
    return view('index', $seo);
});

Route::get('/contact', function () use ($seo) {
    $seo['title'] = 'Contact - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'contact';
    return view('index', $seo);
});

Route::get('/predictions/{id}', function ($id) use ($seo) {
    $prediction = Prediction::where('id', $id)->with(['coin', 'user'])->first();

    if (empty($prediction)) {
        return view('index', $seo);
    }

    $user = $prediction->user;
    $coin = $prediction->coin;
    $price = $prediction->prediction_price > 1 ? round($prediction->prediction_price, 2) : round($prediction->prediction_price, 6);
    $date = date_format($prediction->target_date, 'M d, Y');

    $img = $seo['awsUrl'] . $user->img;
    $imgData = getimagesize($img);
    $width = $imgData[0];
    $height = $imgData[1];

    $seo['description'] = $prediction->explanation;
    $seo['img'] = [
        'height' => $height,
        'src' => $img,
        'width' => $width
    ];
    $seo['title'] = $coin->name . ' to $' . $price . ' on ' . $date . ' - ' . $user->name . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'predictions/' . $id;

    return view('index', $seo);
});

Route::get('/predictions', function () use ($seo) {
    $seo['description'] = 'Browse cryptocurrency predictions on preditc.com';
    $seo['title'] = 'Predictions - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'predictions';
    return view('index', $seo);
});

Route::get('/privacy', function () use ($seo) {
    $seo['title'] = 'Privacy - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'sitemap';
    return view('index', $seo);
});

Route::get('/rules', function () use ($seo) {
    $seo['title'] = 'Rules - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'rules';
    return view('index', $seo);
});

Route::get('/settings', function () use ($seo) {
    $seo['title'] = 'Settings - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'settings';
    return view('index', $seo);
});

Route::get('sitemap', function () {
    $sitemap = App::make('sitemap');
    $sitemap->setCache('laravel.sitemap', 60);

    if (!$sitemap->isCached()) {
        // home page
        $sitemap->add(URL::to('/'), Carbon::now()->subMinutes(52), '1.0', 'daily');

        // create a wallet
        $sitemap->add(URL::to('/wallet/create'), null, '0.9', 'monthly');
        $coins = DB::table('coins')->where('has_wallet', 1)->orderBy('id', 'asc')->get();
        foreach ($coins as $c) {
            $sitemap->add(URL::to('/wallet/create/' . $c->symbol), $c->updated_at, '0.9', 'd');
        }

        // predictions
        $predictions = DB::table('predictions')->orderBy('id', 'asc')->get();
        foreach ($predictions as $p) {
            $sitemap->add(URL::to('/predictions/' . $p->id), $p->updated_at, '0.9', 'daily');
        }
        $sitemap->add(URL::to('/predictions'), Carbon::now()->subMinutes(29), '0.9', 'hourly');

        // coins
        $coins = DB::table('coins')->orderBy('id', 'asc')->get();
        foreach ($coins as $c) {
            $sitemap->add(URL::to('/coins/' . $c->slug), $c->updated_at, '0.8', 'daily');
        }
        $sitemap->add(URL::to('/coins'), Carbon::now()->subDays(11), '0.8', 'weekly');

        // traders
        $users = DB::table('users')->orderBy('id', 'asc')->get();
        foreach ($users as $u) {
            $sitemap->add(URL::to('/' . $u->username), $u->updated_at, '0.7', 'daily');
        }
        $sitemap->add(URL::to('/traders'), Carbon::now()->subMinutes(48), '0.7', 'hourly');

        // filler pages
        $sitemap->add(URL::to('/contact'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/rules'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/about'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/privacy'), null, '0.4', 'monthly');
    }

    return $sitemap->render('xml');
});

Route::get('/traders', function () use ($seo) {
    $seo['description'] = 'Browse some of the best cryptocurrency traders on preditc.com';
    $seo['title'] = 'Traders - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'traders';
    return view('index', $seo);
});

Route::get('/{username}', function ($username) use ($seo) {
    $user = User::where('username', $username)->withCount([
        'predictions',
        'incorrectPredictions',
        'correctPredictions'
    ])->first();

    if (empty($user)) {
        return view('index', $seo);
    }

    $img = $seo['awsUrl'] . $user->img;
    $imgData = getimagesize($img);
    $width = $imgData[0];
    $height = $imgData[1];

    $total = $user->predictions_count;
    $correct = $user->correct_predictions_count;
    $incorrect = $user->incorrect_predictions_count;
    $defaultBio = $user->name . ' has ' . $total . ' predictions. ' . $correct . ' correct. ' . $incorrect . ' incorrect';
    $seo['description'] = empty($user->bio) ? $defaultBio : $user->bio;
    $seo['img'] = [
        'height' => $height,
        'src' => $img,
        'width' => $width
    ];
    $seo['title'] = $user->name . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl']  . $username;

    return view('index', $seo);
});

Route::get('/wallet/create', function () use ($seo) {
    $seo['title'] = 'Generate Ether Address Online - ' . $seo['siteName'];
    $seo['description'] = 'Generate an ether wallet online that includes address, public key and private key. Fast. Free. Secure.';
    $seo['url'] = $seo['baseUrl'] . 'wallet/create';
    return view('index', $seo);
});

Route::get('/wallet/create/{symbol}', function ($symbol) use ($seo) {
    $coin = Coin::where('symbol', $symbol)->first();
    $seo['title'] = 'Generate ' . $coin->name . ' Address Online - ' . $seo['siteName'];
    $seo['description'] = 'Generate an ' . $coin->name . ' wallet online that includes address, public key and private key. Fast. Free. Secure.';
    $seo['url'] = $seo['baseUrl'] . 'wallet/create/' . $symbol;
    return view('index', $seo);
});
