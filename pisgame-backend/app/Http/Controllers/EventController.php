<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::with(['sport', 'results.team'])
            ->when($request->sport_id, fn ($query) => $query->where('sport_id', $request->sport_id))
            ->when($request->status, fn ($query) => $query->where('status', $request->status))
            ->orderByRaw('event_date is null')
            ->orderBy('event_date')
            ->orderBy('name')
            ->get();

        return response()->json([
            'events' => $events,
        ]);
    }

    public function show(Event $event)
    {
        return response()->json([
            'event' => $event->load(['sport', 'results.team']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateEvent($request);

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $event->load('sport'),
        ], 201);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $this->validateEvent($request, $event);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event->load(['sport', 'results.team']),
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully.',
        ]);
    }

    private function validateEvent(Request $request, ?Event $event = null): array
    {
        return $request->validate([
            'sport_id' => ['required', 'exists:sports,id'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:50'],
            'event_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['scheduled', 'completed'])],
        ]);
    }
}
