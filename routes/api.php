<?php

use App\Http\Controllers\ArgumentController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FallacyController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ReferenceController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TweetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/arguments', [ArgumentController::class, 'index']);
Route::get('/arguments/getArgumentsByFallacy', [ArgumentController::class, 'getArgumentsByFallacy']);
Route::get('/arguments/getArgumentsByPage', [ArgumentController::class, 'getArgumentsByPage']);
Route::get('/arguments/getFallaciesByArg', [ArgumentController::class, 'getFallaciesByArg']);
Route::get('/arguments/getPagesByArg', [ArgumentController::class, 'getPagesByArg']);
Route::get('/arguments/showOptions', [ArgumentController::class, 'showOptions']);
Route::get('/arguments/{slug}', [ArgumentController::class, 'show']);
Route::post('/arguments/addImage', [ArgumentController::class, 'addImage'])->middleware(['auth:api', 'verified']);
Route::post('/arguments/{id}/update', [ArgumentController::class, 'update'])->middleware(['auth:api', 'verified']);

Route::get('/comments', [CommentController::class, 'index'])->middleware('api');
Route::post('/comments/create', [CommentController::class, 'create'])->middleware('api');
Route::post('/comments/like', [CommentController::class, 'like'])->middleware(['auth:api', 'verified']);
Route::post('/comments/unlike', [CommentController::class, 'unlike'])->middleware(['auth:api', 'verified']);

Route::post('/contact', [UserController::class, 'contact']);

Route::get('/fallacies', [FallacyController::class, 'index']);
// Route::get('/fallacies/migrate', [FallacyController::class, 'migrate']);
Route::get('/fallacies/related', [FallacyController::class, 'getRelated']);
Route::get('/fallacies/{slug}', [FallacyController::class, 'show']);
Route::post('/fallacies/addImage', [FallacyController::class, 'addImage']);
Route::post('/fallacies/create', [FallacyController::class, 'create'])->middleware('api');
Route::post('/fallacies/saveScreenshot', [FallacyController::class, 'saveScreenshot']);
Route::post('/fallacies/update', [FallacyController::class, 'update'])->middleware(['auth:api', 'verified']);

Route::get('/groups', [GroupController::class, 'index']);
Route::get('/groups/getGroupsByMember', [GroupController::class, 'getGroupsByMember']);
Route::get('/groups/showOptions', [GroupController::class, 'showOptions']);

Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/countByNetwork', [PageController::class, 'countByNetwork']);
Route::get('/pages/showOptions', [PageController::class, 'showOptions']);
Route::get('/pages/{network}/{username}', [PageController::class, 'show']);

Route::get('/reference', [ReferenceController::class, 'index']);
Route::get('/reference/showOptions', [ReferenceController::class, 'showOptions']);
Route::post('/reference/{id}/update', [ReferenceController::class, 'update'])->middleware(['auth:api', 'verified']);

Route::get('/search/counts', [SearchController::class, 'counts']);

Route::get('/tweets', [TweetController::class, 'index']);
Route::get('/tweets/showTwitterFeed', [TweetController::class, 'showTwitterFeed'])->middleware('api');
Route::get('/tweets/showTwitterList', [TweetController::class, 'showTwitterList'])->middleware('api');
Route::get('/tweets/{id}', [TweetController::class, 'show'])->middleware('api');
Route::post('/tweets/{id}/addArguments', [TweetController::class, 'addArguments'])->middleware(['auth:api', 'verified']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/getTargets', [UserController::class, 'getTargets']);
Route::get('/users/getTwitterInfo', [UserController::class, 'getTwitterInfo'])->middleware(['auth:api']);
Route::get('/users/twitterRequestToken', [UserController::class, 'twitterRequestToken']);
Route::get('/users/verifyForgotCode', [UserController::class, 'verifyForgotCode']);
Route::get('/users/{username}', [UserController::class, 'show']);
Route::post('/users/changePassword', [UserController::class, 'changePassword'])->middleware(['auth:api', 'verified']);
Route::post('/users/checkUsername', [UserController::class, 'checkUsername'])->middleware(['auth:api', 'verified']);
Route::post('/users/create', [UserController::class, 'create']);
Route::post('/users/forgot', [UserController::class, 'forgot']);
Route::post('/users/login', [UserController::class, 'login']);
Route::post('/users/profilePic', [UserController::class, 'changeProfilePic'])->middleware(['auth:api', 'verified']);
Route::post('/users/recoverPassword', [UserController::class, 'recoverPassword']);
Route::post('/users/registerTwitterUser', [UserController::class, 'registerTwitterUser']);
Route::post('/users/update', [UserController::class, 'update'])->middleware(['auth:api', 'verified']);
Route::post('/users/verify', [UserController::class, 'verify'])->middleware('auth:api');

Route::get('/videos/{id}', [VideoController::class, 'show']);
