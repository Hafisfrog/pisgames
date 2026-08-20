<?php

namespace App\Http\Controllers;

use App\Models\Sport;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SportController extends Controller
{
    public function index()
    {
        return response()->json([
            'sports' => Sport::withCount('events')->orderBy('name')->get(),
        ]);
    }

    public function show(Sport $sport)
    {
        return response()->json([
            'sport' => $sport->load(['events.results.team']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sports,name'],
            'description' => ['nullable', 'string'],
        ]);

        $sport = Sport::create($validated);

        return response()->json([
            'message' => 'Sport created successfully.',
            'sport' => $sport,
        ], 201);
    }

    public function update(Request $request, Sport $sport)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sports', 'name')->ignore($sport->id),
            ],
            'description' => ['nullable', 'string'],
        ]);

        $sport->update($validated);

        return response()->json([
            'message' => 'Sport updated successfully.',
            'sport' => $sport,
        ]);
    }

    public function destroy(Sport $sport)
    {
        $sport->delete();

        return response()->json([
            'message' => 'Sport deleted successfully.',
        ]);
    }
}
