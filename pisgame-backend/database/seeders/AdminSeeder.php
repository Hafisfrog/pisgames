<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@sportsday.com');
        $password = env('ADMIN_PASSWORD');

        if (!$password && app()->environment('production')) {
            throw new \RuntimeException('ADMIN_PASSWORD must be set before seeding the production admin user.');
        }

        $user = User::firstOrNew(['email' => $email]);
        $user->fill([
            'name' => env('ADMIN_NAME', 'Administrator'),
            'role' => 'admin',
            'user_type' => null,
        ]);

        if ($password || !$user->exists) {
            $user->password = Hash::make($password ?? Str::random(32));
        }

        $user->save();
    }
}
