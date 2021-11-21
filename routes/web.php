<?php

use App\Models\Argument;
use App\Models\Fallacy;
use App\Models\Page;
use App\Models\Tweet;
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

$awsUrl = env('AWS_URL', 'https://blather-new.s3.us-west-2.amazonaws.com/');
$baseUrl = env('APP_URL', 'https://blather.io/');
$siteName = env('APP_NAME', 'Blather');
$twitterHandle = env('TWITTER_HANDLE', '@blatherio');

$seo = [
    'author' => null,
    'authorUrl' => null,
    'awsUrl' => $awsUrl,
    'baseUrl' => $baseUrl,
    'description' => $siteName . ' is a website and application that lets users assign logical fallacies to tweets. You can make political memes out of tweets and fallacies.',
    'img' => [
        'height' => 100,
        'width' => 100,
        'src' => 'public/logo512.png'
    ],
    'keywords' => 'politics,logical fallacies,conservatives,trump,sycophants,critical thinking',
    'schema' => '',
    'siteName' => $siteName,
    'title' => $siteName,
    'twitterHandle' => $twitterHandle,
    'url' => $baseUrl
];

Route::get('/', function () use ($seo) {
    $seo['title'] = 'Assign a Logical Fallacy - ' . $seo['siteName'];
    return view('index', $seo);
});

Route::get('/about', function () use ($seo) {
    $seo['title'] = 'About - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'about';
    return view('index', $seo);
});

Route::get('/activity', function () use ($seo) {
    $seo['title'] = 'Activity - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'activity';
    return view('index', $seo);
});

Route::get('/arguments', function () use ($seo) {
    $seo['title'] = 'Arguments - ' . $seo['siteName'];
    $seo['description'] = "These are some of the most ubiquitous right-wing talking points. These aren't particularly good arguments but they're certainly some of the most common. Plenty of people have crafted personal brands and built entire careers as pundits by doing nothing more than repeating a handful of these tired talking points.";
    $seo['url'] = $seo['baseUrl'] . 'arguments';
    return view('index', $seo);
});

Route::get('/arguments/{slug}', function ($slug) use ($seo) {
    $arg = Argument::where('slug', $slug)->first();
    if (empty($arg)) {
        return view('index', $seo);
    }

    $seo['description'] = $arg->explanation;
    $seo['title'] = $arg->description . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'arguments/' . $slug;

    return view('index', $seo);
});

Route::get('/auth', function () use ($seo) {
    $seo['title'] = 'Sign In - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'auth';
    return view('index', $seo);
});

Route::get('/contact', function () use ($seo) {
    $seo['title'] = 'Contact Us - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'contact';
    return view('index', $seo);
});

Route::get('/fallacies/{slug}', function ($slug) use ($seo) {
    $fallacy = Fallacy::where('slug', $slug)->orWhere('id', $slug)->first();
    if (empty($fallacy)) {
        return view('index', $seo);
    }

    $seo['description'] = $fallacy->explanation;
    $seo['title'] = $fallacy->title . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'fallacies/' . $slug;

    return view('index', $seo);
});

Route::get('/grifters', function () use ($seo) {
    $seo['title'] = 'Grifters - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'grifters';
    return view('index', $seo);
});

Route::get('/groups', function () use ($seo) {
    $seo['title'] = 'Groups - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'groups';
    return view('index', $seo);
});

Route::get('/pages/{network}/{username}', function ($network, $username) use ($seo) {
    $page = Page::where([
        'network' => $network,
        'username' => $username
    ])->first();
    if (empty($page)) {
        return view('index', $seo);
    }

    $img = $seo['awsUrl'] . $page->image;
    $imgData = getimagesize($img);
    $width = $imgData[0];
    $height = $imgData[1];

    $seo['img'] = [
        'height' => $height,
        'src' => $img,
        'width' => $width
    ];
    $seo['description'] = $page->bio;
    $seo['title'] = $page->name . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'pages/' . $network . '/' . $username;

    return view('index', $seo);
});

Route::get('/privacy', function () use ($seo) {
    $seo['title'] = 'Privacy - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'privacy';
    return view('index', $seo);
});

Route::get('/reference', function () use ($seo) {
    $seo['title'] = 'Reference - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'reference';
    return view('index', $seo);
});

Route::get('/rules', function () use ($seo) {
    $seo['title'] = 'Rules - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'rules';
    return view('index', $seo);
});

Route::get('/saved/tweets', function () use ($seo) {
    $seo['title'] = 'Saved Tweets - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'saved/tweets';
    return view('index', $seo);
});

Route::get('/search', function () use ($seo) {
    $seo['title'] = 'Search - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'search';
    return view('index', $seo);
});

Route::get('sitemap', function () {
    $sitemap = App::make('sitemap');
    $sitemap->setCache('laravel.sitemap', 60);

    if (!$sitemap->isCached()) {
        // static pages
        $sitemap->add(URL::to('/'), Carbon::now(), '1.0', 'monthly'); // home/assign page
        $sitemap->add(URL::to('/activity'), null, '0.7', 'daily');
        $sitemap->add(URL::to('/auth'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/grifters'), null, '0.8', 'monthly');
        $sitemap->add(URL::to('/groups'), null, '0.6', 'monthly');
        $sitemap->add(URL::to('/reference'), null, '0.7', 'monthly');
        $sitemap->add(URL::to('/search'), null, '0.6', 'monthly');
        $sitemap->add(URL::to('/search?q=&type=fallacies'), null, '0.6', 'monthly');
        $sitemap->add(URL::to('/search?q=&type=tweets'), null, '0.6', 'monthly');
        $sitemap->add(URL::to('/search?q=&type=contradictions'), null, '0.6', 'monthly');
        $sitemap->add(URL::to('/search?q=&type=pages'), null, '0.6', 'monthly');

        // arguments
        $args = DB::table('args')->orderBy('id', 'asc')->get();
        foreach ($args as $a) {
            $sitemap->add(URL::to('/arguments/' . $a->slug), $a->updated_at, '0.9', 'weekly');
        }
        $sitemap->add(URL::to('/arguments'), null, '0.9', 'monthly');

        // fallacies
        $fallacies = DB::table('fallacies')->orderBy('id', 'asc')->get();
        foreach ($fallacies as $f) {
            $sitemap->add(URL::to('/fallacies/' . $f->slug), $f->updated_at, '0.9', 'weekly');
        }

        // pages
        $pages = DB::table('pages')->orderBy('id', 'asc')->get();
        foreach ($pages as $p) {
            $sitemap->add(URL::to('/pages/' . $p->network . '/' . $p->username), $p->updated_at, '0.7', 'weekly');
        }

        // tweets
        $tweets = DB::table('tweets')->orderBy('id', 'asc')->get();
        foreach ($tweets as $t) {
            $sitemap->add(URL::to('/tweets/' . $t->tweet_id), $t->updated_at, '0.6', 'weekly');
        }
        $sitemap->add(URL::to('/tweets'), null, '0.7', 'monthly');

        // users
        $users = DB::table('users')->orderBy('id', 'asc')->get();
        foreach ($users as $u) {
            $sitemap->add(URL::to('/' . $u->username), $u->updated_at, '0.6', 'weekly');
        }

        // filler pages
        $sitemap->add(URL::to('/contact'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/rules'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/about'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/privacy'), null, '0.4', 'monthly');
    }

    return $sitemap->render('xml');
});

Route::get('/tweet/{id}', function ($id) use ($seo) {
    $tweet = Tweet::where('tweet_id', $id)
        ->with(['page'])
        ->first();

    if (empty($tweet)) {
        return view('index', $seo);
    }

    $seo['description'] = $tweet->full_text;
    $seo['title'] = 'Tweet by ' . $tweet->page->name . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'tweets/' . $id;

    return view('index', $seo);
});

Route::get('/tweets', function () use ($seo) {
    $seo['title'] = 'Tweets - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'tweets';
    return view('index', $seo);
});

Route::get('/tweets/{id}', function ($id) use ($seo) {
    $tweet = Tweet::where('tweet_id', $id)
        ->with(['page'])
        ->first();

    if (empty($tweet)) {
        return view('index', $seo);
    }

    $seo['description'] = $tweet->full_text;
    $seo['title'] = 'Tweet by ' . $tweet->page->name . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl'] . 'tweets/' . $id;

    return view('index', $seo);
});

Route::get('/{username}', function ($username) use ($seo) {
    $user = User::where('username', $username)->withCount([
        'fallacies',
        'contradictions'
    ])->first();

    if (empty($user)) {
        return view('index', $seo);
    }

    $img = $seo['awsUrl'] . $user->image;
    $imgData = getimagesize($img);
    $width = $imgData[0];
    $height = $imgData[1];

    $seo['img'] = [
        'height' => $height,
        'src' => $img,
        'width' => $width
    ];

    $defaultBio = $user->name . ' has ' . $user->fallacies_count . ' fallacies and ' . $user->contradictions_count . ' contradictions';
    $seo['description'] = empty($user->bio) ? $defaultBio : $user->bio;
    $seo['title'] = $user->name . ' - ' . $seo['siteName'];
    $seo['url'] = $seo['baseUrl']  . $username;

    return view('index', $seo);
});
