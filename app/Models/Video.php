<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class Video extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date_created',
        'description',
        'dislike_count',
        'like_count',
        'page_id',
        's3_link',
        'thumbnail',
        'title',
        'video_id',
        'view_count'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        // 'date_created' => 'datetime'
    ];

    public function fallacies()
    {
        return $this->hasMany(FallacyYouTube::class, 'video_id', 'id');
    }

    public function page()
    {
        return $this->hasOne(Page::class, 'id', 'page_id');
    }

    public static function getVideoInfo($id)
    {
        $headers = [
            'Content-Type: application/json'
        ];

        $key = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
        $data = [
            'context' => [
                'client' => [
                    'hl' => 'en',
                    'clientName' => 'WEB',
                    'clientVersion' => '2.20210721.00.00',
                    'clientFormFactor' => 'UNKNOWN_FORM_FACTOR',
                    'clientScreen' => 'WATCH',
                    'mainAppWebInfo' => [
                        'graftUrl' => '/watch?v=' . $id,
                    ],
                ],
                'user' => [
                    'lockedSafetyMode' => false,
                ],
                'request' => [
                    'useSsl' => true,
                    'internalExperimentFlags' => [],
                    'consistencyTokenJars' => [],
                ],
            ],
            'videoId' => $id,
            'playbackContext' => [
                'contentPlaybackContext' => [
                    'vis' => 0,
                    'splay' => false,
                    'autoCaptionsDefaultOn' => false,
                    'autonavState' => 'STATE_NONE',
                    'html5Preference' => 'HTML5_PREF_WANTS',
                    'lactMilliseconds' => '-1',
                ],
            ],
            'racyCheckOk' => false,
            'contentCheckOk' => false,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.youtube.com/youtubei/v1/player?key=' . $key);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        // curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);

        if (curl_errno($ch)) {
            // echo 'Error:' . curl_error($ch);
            return false;
        }

        curl_close($ch);

        $decode = @json_decode($result, true);
        if (!array_key_exists('videoDetails', $decode)) {
            return false;
        }

        if (!array_key_exists('microformat', $decode)) {
            return false;
        }

        $microformat = $decode['microformat'];
        $dateCreated = $microformat['playerMicroformatRenderer']['uploadDate'];

        $details = $decode['videoDetails'];
        $details['dateCreated'] = $dateCreated;

        return $details;
    }
}
