<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    public function getImage($age, $gender, $perPage = 1, $page = 1, $order_by = 'latest')
    {
        $response = Http::retry(3, 10000)->withHeaders([
            'Accepts' => 'application/json',
            'Authorization' => 'API-Key Cph30qkLrdJDkjW-THCeyA'
        ])->get('https://api.generated.photos/api/frontend/v1/images', [
            'age' => $age,
            'gender' => $gender,
            'hair_length' => $gender === 'female' ? 'long' : 'short',
            'order_by' => $order_by,
            'page' => $page,
            'per_page' => $perPage
        ]);

        if ($response->ok()) {
            $json = $response->json();
            $images = $json['images'];
            return $images[0]['thumb_url'];
        }

        return null;
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;
        $separator = $faker->randomElement(['-', '_', '.']);
        $createdAt = $faker->dateTimeBetween('-2 months', 'now');
        $verifiedAt = $faker->dateTimeBetween($createdAt, '+35 minutes');
        $firstName = $faker->firstNameMale();
        $lastName = $faker->lastName();
        $name = $firstName . ' ' . $lastName;
        $username = $firstName . $separator . $lastName . '' . mt_rand(10, 9999);
        $password = Str::random(mt_rand(8, 24));

        $profilePic = $this->getImage('young-adult', 'male', 1, mt_rand(1, 250000));
        $contents = file_get_contents($profilePic);
        $img = 'users/' . Str::random(24) . '.jpg';
        Storage::disk('s3')->put($img, $contents);

        return [
            'bio' => '',
            'created_at' => $createdAt,
            'email' => $faker->unique()->safeEmail(),
            'email_verified_at' => $verifiedAt,
            'image' => $img,
            'name' => $name,
            'password' => $password,
            'raw_password' => $password,
            'username' => strtolower($username)
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
