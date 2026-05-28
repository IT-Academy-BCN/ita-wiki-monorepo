<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\LanguageEnum;
use App\Enums\LigaStatusEnum;
use App\Enums\LeagueTypeEnum;   
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
                    'user_id'       => $user->id,
                    'points'        => fake()->numberBetween(0, 100),
                    'points_weekly' => fake()->numberBetween(0, 100),
                    'language'      => fake()->randomElement(LanguageEnum::values()),
                    'status'        => fake()->randomElement(LigaStatusEnum::values()),
                    'league_id'     => fake()->randomElement(LeagueTypeEnum::values()),                
                    ]);

            }
        });

        Liga::factory()->count(5)->create();
    }
}