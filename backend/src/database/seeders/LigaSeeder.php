<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Database\Seeder;

class LigaSeeder extends Seeder
{
    public function run(): void
    {
        User::all()->each(function(User $user) {
            if(! Liga::where('user_id', $user->id)->exists()) {
                Liga::create([
                    'user_id' => $user->id,
                    'points' => rand(0, 100),
                ]);
            }
        });
    }
}