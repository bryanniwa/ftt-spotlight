<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// @TODO add names for routes
Route::post('login', 'AuthController@login');

// Authenticated Routes
Route::middleware('auth:api')->group(function() {
    // Auth
    Route::post('logout', 'AuthController@logout');
});

// COMPLETE

// Staff
Route::get('staff', 'StaffController@index');
Route::get('staff/{id}', 'StaffController@show');
Route::post('staff', 'StaffController@store');
Route::delete('staff/{id}', 'StaffController@destroy');
Route::put('staff', 'StaffController@store');

// Students
Route::get('students', 'StudentsController@index');
Route::get('students/{id}', 'StudentsController@show');
Route::post('students', 'StudentsController@store');
Route::put('students', 'StudentsController@store');
Route::delete('students/{id}', 'StudentsController@destroy');

// INCOMPLETE

// Students

Route::get('students/disabled', 'StudentsController@fetchDisabled');
Route::get('student/sn/{student_number}', 'StudentsController@fetchBySN');


Route::delete('student/{id}/disable', 'StudentsController@disable');

// Blocks
Route::get('blocks', 'BlockController@index');
    // Route::get('block/{time}', 'BlockController@show');
Route::post('blocks', 'BlockController@store');
Route::put('blocks', 'BlockController@store');
Route::delete('block/{id}', 'BlockController@destroy');
// Ledger
// Route::get('ledger', 'LedgerController@index');
Route::post('check-in', 'LedgerController@store');

// Search
Route::get('search', 'SearchController@search');

// Student Schedule
Route::get('student-schedule', 'StudentScheduleController@index');