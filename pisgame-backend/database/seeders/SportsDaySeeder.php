<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Result;
use App\Models\Sport;
use App\Models\Team;
use Illuminate\Database\Seeder;

class SportsDaySeeder extends Seeder
{
    public function run(): void
    {
        $teams = collect([
            ['name' => 'สีแดง', 'color' => '#dc2626'],
            ['name' => 'สีฟ้า', 'color' => '#2563eb'],
            ['name' => 'สีเขียว', 'color' => '#16a34a'],
            ['name' => 'สีเหลือง', 'color' => '#eab308'],
        ])->mapWithKeys(function (array $team) {
            $model = Team::updateOrCreate(
                ['name' => $team['name']],
                ['color' => $team['color']]
            );

            return [$team['name'] => $model];
        });

        $sports = collect([
            ['name' => 'ฟุตบอล', 'description' => 'การแข่งขันฟุตบอลกีฬาสี'],
            ['name' => 'วอลเลย์บอล', 'description' => 'การแข่งขันวอลเลย์บอลกีฬาสี'],
            ['name' => 'กรีฑา', 'description' => 'การแข่งขันวิ่งและลู่ลาน'],
        ])->mapWithKeys(function (array $sport) {
            $model = Sport::updateOrCreate(
                ['name' => $sport['name']],
                ['description' => $sport['description']]
            );

            return [$sport['name'] => $model];
        });

        $events = [
            [
                'sport' => 'ฟุตบอล',
                'name' => 'ฟุตบอลชาย',
                'category' => 'มัธยม',
                'gender' => 'ชาย',
                'event_date' => '2026-08-20',
                'results' => [
                    ['team' => 'สีแดง', 'medal' => 'gold'],
                    ['team' => 'สีฟ้า', 'medal' => 'silver'],
                    ['team' => 'สีเขียว', 'medal' => 'bronze'],
                ],
            ],
            [
                'sport' => 'วอลเลย์บอล',
                'name' => 'วอลเลย์บอลหญิง',
                'category' => 'มัธยม',
                'gender' => 'หญิง',
                'event_date' => '2026-08-20',
                'results' => [
                    ['team' => 'สีฟ้า', 'medal' => 'gold'],
                    ['team' => 'สีเหลือง', 'medal' => 'silver'],
                    ['team' => 'สีแดง', 'medal' => 'bronze'],
                ],
            ],
            [
                'sport' => 'กรีฑา',
                'name' => 'วิ่ง 100 เมตร',
                'category' => 'มัธยม',
                'gender' => 'รวม',
                'event_date' => '2026-08-20',
                'results' => [
                    ['team' => 'สีเขียว', 'medal' => 'gold'],
                    ['team' => 'สีแดง', 'medal' => 'silver'],
                    ['team' => 'สีฟ้า', 'medal' => 'bronze'],
                ],
            ],
        ];

        foreach ($events as $eventData) {
            $event = Event::updateOrCreate(
                [
                    'sport_id' => $sports[$eventData['sport']]->id,
                    'name' => $eventData['name'],
                    'category' => $eventData['category'],
                    'gender' => $eventData['gender'],
                ],
                [
                    'event_date' => $eventData['event_date'],
                    'status' => 'completed',
                ]
            );

            foreach ($eventData['results'] as $resultData) {
                Result::updateOrCreate(
                    [
                        'event_id' => $event->id,
                        'team_id' => $teams[$resultData['team']]->id,
                    ],
                    [
                        'medal' => $resultData['medal'],
                    ]
                );
            }
        }
    }
}
