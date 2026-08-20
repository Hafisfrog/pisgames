<?php

namespace App\Http\Controllers;

use App\Models\Team;

class StandingController extends Controller
{
    public function index()
    {
        $teams = Team::with('results')->orderBy('name')->get();

        $standings = $teams->map(function (Team $team) {
            $gold = $team->results->where('medal', 'gold')->count();
            $silver = $team->results->where('medal', 'silver')->count();
            $bronze = $team->results->where('medal', 'bronze')->count();

            return [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'color' => $team->color,
                'gold' => $gold,
                'silver' => $silver,
                'bronze' => $bronze,
                'total' => $gold + $silver + $bronze,
            ];
        })->sortBy([
            ['gold', 'desc'],
            ['silver', 'desc'],
            ['bronze', 'desc'],
            ['team_name', 'asc'],
        ])->values();

        return response()->json([
            'standings' => $standings,
        ]);
    }
}
