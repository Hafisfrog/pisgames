<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id', 'desc')->get();

        return response()->json([
            'users' => $users
        ]);
    }

    public function show(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => 'required|string|min:8',

            'role' => [
                'required',
                Rule::in(['admin', 'user']),
            ],

            'user_type' => [
                'nullable',
                Rule::in(['teacher', 'staff', 'student']),
            ],
        ]);

        if ($validated['role'] === 'admin') {
            $validated['user_type'] = null;
        }

        $validated['password'] = Hash::make(
            $validated['password']
        );

        $user = User::create($validated);

        return response()->json([
            'message' => 'เพิ่มผู้ใช้งานสำเร็จ',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($user->id),
            ],

            'password' => 'nullable|string|min:8',

            'role' => [
                'required',
                Rule::in(['admin', 'user']),
            ],

            'user_type' => [
                'nullable',
                Rule::in(['teacher', 'staff', 'student']),
            ],
        ]);

        if ($validated['role'] === 'admin') {
            $validated['user_type'] = null;
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make(
                $validated['password']
            );
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'แก้ไขผู้ใช้งานสำเร็จ',
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'ไม่สามารถลบบัญชีของตัวเองได้'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'ลบผู้ใช้งานสำเร็จ'
        ]);
    }
}