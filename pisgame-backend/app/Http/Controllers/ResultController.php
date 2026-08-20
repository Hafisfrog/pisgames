<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $results = Result::with(['event.sport', 'team'])
            ->when($request->event_id, fn ($query) => $query->where('event_id', $request->event_id))
            ->when($request->team_id, fn ($query) => $query->where('team_id', $request->team_id))
            ->when($request->medal, fn ($query) => $query->where('medal', $request->medal))
            ->latest()
            ->get();

        return response()->json([
            'results' => $results,
        ]);
    }

    public function show(Result $result)
    {
        return response()->json([
            'result' => $result->load(['event.sport', 'team']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateResult($request);

        $result = Result::create($validated);
        $this->markEventCompleted($result);

        return response()->json([
            'message' => 'Result created successfully.',
            'result' => $result->load(['event.sport', 'team']),
        ], 201);
    }

    public function update(Request $request, Result $result)
    {
        $validated = $this->validateResult($request, $result);

        $result->update($validated);
        $this->markEventCompleted($result);

        return response()->json([
            'message' => 'Result updated successfully.',
            'result' => $result->load(['event.sport', 'team']),
        ]);
    }

    public function destroy(Result $result)
    {
        $result->delete();

        return response()->json([
            'message' => 'Result deleted successfully.',
        ]);
    }

    private function validateResult(Request $request, ?Result $result = null): array
    {
        return $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'team_id' => [
                'required',
                'exists:teams,id',
                Rule::unique('results', 'team_id')
                    ->where(fn ($query) => $query->where('event_id', $request->event_id))
                    ->ignore($result?->id),
            ],
            'medal' => ['required', Rule::in(['gold', 'silver', 'bronze'])],
            'note' => ['nullable', 'string'],
        ]);
    }

    private function markEventCompleted(Result $result): void
    {
        Event::where('id', $result->event_id)->update(['status' => 'completed']);
    }
}
