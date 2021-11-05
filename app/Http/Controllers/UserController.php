<?php

namespace App\Http\Controllers;

// use App\Events\ApplicationSent;
use App\Http\Controllers\Controller;
use App\Http\Resources\PageCollection;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;
use App\Mail\ForgotPassword;
use App\Mail\VerificationCode;
use App\Models\Page;
use App\Models\User;
use App\Models\UserTwitter;
use App\Rules\MatchOldPassword;
use Atymic\Twitter\Facade\Twitter;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Intervention\Image\ImageManagerStatic as Image;

class UserController extends Controller
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
        $q = $request->input('q');
        $sort = $request->input('sort', 'accuracy');
        $dir = $request->input('dir', 'desc');

        if (!in_array($dir, ['asc', 'desc'])) {
            return response([
                'message' => 'Invalid sort direction'
            ], 422);
        }

        $users = User::where('name', 'LIKE', '%' . $q . '%')
            ->withCount([
                'comments',
                'fallacies'
            ]);

        $users = $users->paginate(15);
        return new UserCollection($users);
    }

    public function all(Request $request)
    {
        $count = User::all()->count();
        return response([
            'count' => $count
        ]);
    }

    /**
     * Login
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'currentPassword' => ['required', new MatchOldPassword],
            'newPassword' => ['required', Password::min(8)],
            'confirmPassword' => ['same:newPassword']
        ]);

        $password = $request->input('newPassword');
        $user = $request->user();
        $user->password = $password;
        $user->save();
        $user->refresh();

        return response([
            'success' => true
        ]);
    }

    public function changeProfilePic(Request $request)
    {
        $request->validate([
            'file' => 'required|image',
        ]);

        $userId = $request->user()->id;
        $file = $request->file('file');

        $img = Image::make($file);
        $img->resize(320, 320);
        $img->save($file);

        $img = 'users/' . Str::random(24) . '.jpg';
        Storage::disk('s3')->put($img, file_get_contents($file));

        $user = User::find($userId);
        $user->image = $img;
        $user->save();

        $user = User::where('id', $userId)
            ->withCount([
                'comments',
                'contradictions',
                'fallacies',
                'likes',
                'responses',
                'retractedFallacies'
            ])
            ->first();

        return new UserResource($user);
    }

    public function checkUsername(Request $request)
    {
        $username = $request->input('username', null);
        $user = $request->user();

        if ($username == $user->username) {
            return response([
                'available' => true
            ]);
        }

        $request->validate([
            'username' => 'bail|required|max:20|unique:users,username|alpha_dash'
        ]);

        return response([
            'available' => true
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'bail|required|email|unique:users',
            'name' => 'bail|required|min:3|max:30|regex:/^[a-zA-Z\s]*$/',
            'password' => ['bail', 'required', Password::min(8)],
            'username' => 'bail|required|max:20|unique:users,username|alpha_dash'
        ]);

        $email = $request->input('email');
        $name = $request->input('name');
        $password = $request->input('password');
        $username = $request->input('username');

        if (in_array(strtolower($username), User::PROTECTED_USERNAMES)) {
            return response([
                'errors' => [
                    'username' => [
                        'That username is invalid'
                    ]
                ]
            ], 422);
        }

        $user = User::create([
            'api_token' => Str::random(60),
            'email' => $email,
            'name' => $name,
            'password' => $password,
            'remember_token' => Str::random(10),
            'username' => $username,
            'verification_code' => mt_rand(1000, 9999)
        ]);
        $user->refresh();

        try {
            Mail::to($email)->send(new VerificationCode($user));
        } catch (\Exception $e) {
            return response([
                'message' => 'Error sending confirmation email'
            ], 401);
        }

        return response([
            'bearer' => $user->api_token,
            'user' => new UserResource($user),
            'verify' => true
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Forgot
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function forgot(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        if (empty($user)) {
            return response([
                'message' => 'No user found'
            ], 401);
        }

        $forgotCode = Str::random(12);
        $user->forgot_code = $forgotCode;
        $user->save();
        $user->refresh();

        try {
            Mail::to($email)->send(new ForgotPassword($user));
        } catch (\Exception $e) {
            return response([
                'message' => 'Error sending recovery email'
            ], 401);
        }

        return response([
            'message' => 'Success'
        ]);
    }

    public function getTargets(Request $request)
    {
        $id = $request->input('id');

        $request->validate([
            'id' => 'bail|required|exists:users,id'
        ]);

        $pages = Page::withCount(['contradictions', 'fallacies'])
            ->whereHas('fallacies', function ($query) use ($id) {
                $query->where('user_id', $id);
            })
            ->orderBy('fallacies_count', 'desc')
            ->paginate(15);

        return new PageCollection($pages);
    }

    public function getTwitterInfo(Request $request)
    {
        $userId = $request->user()->id;

        $twitter = UserTwitter::where('user_id', $userId)->first();

        if (empty($twitter)) {
            return response([
                'message' => 'No Twitter account'
            ], 404);
        }

        return response([
            'createdAt' => $twitter->created_at,
            'secret' => $twitter->secret,
            'token' => $twitter->token,
            'username' => $twitter->username
        ]);
    }

    /**
     * Login
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'bail|required|email',
            'password' => 'required',
        ]);

        $user = User::where([
            'email' => $request->input('email'),
            'password' => sha1($request->input('password'))
        ])
            ->first();

        if (!$user) {
            return response([
                'message' => 'Incorrect password'
            ], 401);
        }

        $user->api_token = Str::random(60);
        $user->save();

        $user = User::where('id', $user->id)
            ->withCount([
                'comments',
                'contradictions',
                'fallacies',
                'likes',
                'responses',
                'retractedFallacies',
                'twitter'
            ])
            ->first();

        return response([
            'bearer' => $user->api_token,
            'user' => new UserResource($user),
            'verify' => $user->email_verified_at === null
        ]);
    }

    public function recoverPassword(Request $request)
    {
        $request->validate([
            'reset' => 'required',
            'newPassword' => ['required', Password::min(8)],
            'confirmPassword' => ['same:newPassword']
        ]);

        $password = $request->input('newPassword');
        $reset = $request->input('reset');

        $user = User::where('forgot_code', $reset)->first();
        if (empty($user)) {
            return response([
                'message' => 'Incorrect token'
            ], 401);
        }

        $user->password = $password;
        $user->forgot_code = null;
        $user->save();
        $user->refresh();

        return response([
            'success' => true
        ]);
    }

    public function twitterRequestToken(Request $request)
    {
        $token = Twitter::getRequestToken('http://127.0.0.1:3000/');

        if (isset($token['oauth_token_secret'])) {
            $url = Twitter::getAuthenticateUrl($token['oauth_token']);
            return response([
                'secret' => $token['oauth_token_secret'],
                'token' => $token['oauth_token'],
                'url' => $url
            ]);
        }

        return response([
            'message' => 'There was an error'
        ], 401);
    }

    public function registerTwitterUser(Request $request)
    {
        $token = $request->input('token');
        $verifier = $request->input('verifier');
        $requestToken = $request->input('requestToken');
        $requestTokenSecret = $request->input('requestTokenSecret');

        $twitter = Twitter::usingCredentials($requestToken, $requestTokenSecret);

        try {
            $token = $twitter->getAccessToken($verifier);
        } catch (\Exception $e) {
            return response([
                'message' => 'Error getting token'
            ], 401);
        }

        if (!isset($token['oauth_token_secret'])) {
            return response([
                'message' => 'There was an error'
            ], 401);
        }

        $twitter = Twitter::usingCredentials($token['oauth_token'], $token['oauth_token_secret']);
        $credentials = $twitter->getCredentials();

        if (!is_object($credentials) || isset($credentials->error)) {
            if (!isset($token['oauth_token_secret'])) {
                return response([
                    'message' => 'There was an error'
                ], 401);
            }
        }

        $bio = $credentials->description;
        $name = $credentials->name;
        $username = $credentials->screen_name . '1';
        $imgFile = str_replace('_normal', '', $credentials->profile_image_url_https);
        $twitterId = $credentials->id;

        if (in_array(strtolower($username), User::PROTECTED_USERNAMES)) {
            return response([
                'errors' => [
                    'username' => [
                        'That username is invalid'
                    ]
                ]
            ], 422);
        }

        $user = User::whereHas('twitter', function ($query) use ($twitterId, $username) {
            $query->where(['twitter_id' => $twitterId, 'username' => $username]);
        })
            ->with(['twitter'])
            ->first();

        if ($user) {
            $user->api_token = Str::random(60);
            $user->save();
            $user->refresh();

            return response([
                'bearer' => $user->api_token,
                'user' => new UserResource($user)
            ]);
        }

        $user = User::where('username', $username)->first();
        if (empty($user)) {
            $image = 'users/' . Str::random(24) . '.jpg';
            Storage::disk('s3')->put($image, file_get_contents($imgFile));

            $user = User::create([
                'api_token' => Str::random(60),
                'bio' => $bio,
                'image' => $image,
                'name' => $name,
                'password' => '',
                'raw_password' => '',
                'username' => $username,
            ]);
            $user->refresh();
        }

        UserTwitter::create([
            'secret' => $token['oauth_token_secret'],
            'token' => $token['oauth_token'],
            'twitter_id' => $twitterId,
            'username' => $username,
            'user_id' => $user->id
        ]);

        $user = User::with(['twitter'])
            ->where('id', $user->id)
            ->first();

        return response([
            'bearer' => $user->api_token,
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $username
     * @return \Illuminate\Http\Response
     */
    public function show($username)
    {
        $user = User::where('username', $username)
            ->withCount([
                'comments',
                'contradictions',
                'fallacies',
                'likes',
                'responses',
                'retractedFallacies'
            ])
            ->first();

        if (empty($user)) {
            return response([
                'message' => 'That user does not exist'
            ], 404);
        }

        return new UserResource($user);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $user = $request->user();
        $input = $request->all();

        $username = $request->input('username', null);
        if ($username ? $username != $user->username : false) {
            $request->validate([
                'username' => 'bail|required|max:20|unique:users,username|alpha_dash'
            ]);
        }

        $user->fill($input)->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Verify
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|numeric',
        ]);

        $user = $request->user();
        $code = $request->input('code');

        if ($user->verification_code != $code) {
            return response([
                'message' => 'That code is incorrect'
            ], 401);
        }

        $user->email_verified_at = now();
        $user->save();

        return response()->json([
            'verify' => false
        ]);
    }

    public function verifyForgotCode(Request $request)
    {
        $request->validate([
            'code' => 'required',
        ]);

        $code = $request->input('code');
        $user = User::where('forgot_code', $code)->first();

        if (empty($user)) {
            return response([
                'message' => 'Invalid code'
            ], 401);
        }

        return response([
            'message' => 'Success'
        ]);
    }
}
