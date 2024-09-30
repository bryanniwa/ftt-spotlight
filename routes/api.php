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

// Unauthenticates Routes
Route::post('login', 'AuthController@login');
Route::get('settings/unauthenticated', 'SettingsController@getUnauthenticated');
Route::post('check-user', 'AuthController@getUsername');

Route::get('test-email', 'JobsController@processQueue');

// App Start-up
Route::middleware('auth:api')->group(function() {
    // Authentication
    Route::post('logout', 'AuthController@logout');
    Route::get('user', 'AuthController@user');
    Route::post('verify-user', 'AuthController@verify');
    Route::post('change-password', 'AuthController@changePassword');

    // Settings
    Route::get('settings', 'SettingsController@index');
});

// All Users
Route::middleware(['auth:api', 'expired-password'])->group(function() {
    // Topics
    Route::get('topics', 'TopicsController@index');

    // Staff
    Route::get('staff', 'StaffController@index');
    Route::get('staff/administrators', 'StaffController@getAllAdministrators');
    Route::get('staff/profile/{id}', 'StaffController@profile');
    Route::get('staff/{id}', 'StaffController@show');

    // Search
    Route::get('search', 'SearchController@search');

    // Student Schedule
    Route::post('students/staff-list', 'StudentScheduleController@listStaff');
    Route::post('students/schedule-plan', 'StudentScheduleController@setPlan');
});

// Student Routes
Route::middleware(['auth:api', 'expired-password', 'scopes:student'])->group(function() {
    // Schedule
    Route::get('students/self/schedule', 'StudentScheduleController@indexProfile');
    Route::get('students/self/schedule/{timestamp}', 'StudentScheduleController@indexProfile');

    // Profile
    Route::get('students/profile/self', 'StudentsController@authProfile');
});

// Teacher and Administrator Routes
Route::middleware(['auth:api', 'expired-password', 'scope:teacher,admin'])->group(function() {
    //Amendments
    Route::post('amendment', 'AmendmentsController@create');

    // Appointments
    Route::post('appointments/create', 'AppointmentsController@create');
    
    // Starred
    Route::get('starred', 'StarController@index');
    Route::post('star', 'StarController@star');
    Route::post('unstar', 'StarController@unstar');

    // Topics
    Route::post('topics', 'TopicsController@store');
    Route::delete('topics/{id}', 'TopicsController@destroy');
    Route::post('topics/schedule', 'TopicsController@createTopicSchedule');
    Route::delete('topics/schedule/{id}', 'TopicsController@deleteTopicSchedule');

    // Ledger
    Route::post('check-in', 'LedgerController@checkIn');
    Route::get('check-in/status', 'LedgerController@status');
    Route::get('check-in/status/{datetime}', 'LedgerController@status');
    Route::get('check-in/student-number/{id}', 'StudentsController@getChipByStudentNumber');
    Route::post('check-in/air/enable', 'LedgerController@enableAir');
    Route::post('check-in/air/disable', 'LedgerController@disableAir');

    // Notifications
    Route::get('notifications/inbox', 'NotificationsController@inbox');
    Route::get('notifications/outbox', 'NotificationsController@outbox');
    Route::put('notifications/archive/all', 'NotificationsController@archiveAllNotifications');
    Route::put('notifications/read/all', 'NotificationsController@markAllNotificationsRead');
    Route::put('notifications/archive/{id}', 'NotificationsController@archiveNotification');
    Route::put('notifications/unarchive/{id}', 'NotificationsController@unarchiveNotification');
    Route::put('notifications/read/{id}', 'NotificationsController@markNotificationRead');
    Route::put('notifications/unread/{id}', 'NotificationsController@markNotificationUnread');
    Route::post('notifications', 'NotificationsController@sendNotification');

    // Power Scheduler
    Route::post('power-scheduler', 'PowerSchedulerController@schedule');

    // Staff Capacity
    Route::post('staff/capacity', 'StaffController@setCapacity');
});

// Teacher, Administrator and SysAdmin Routes
Route::middleware(['auth:api', 'expired-password', 'scope:teacher,admin,sysadmin'])->group(function() {
    
    // Appointments
    Route::get('appointments/{id}', 'AppointmentsController@find');
    Route::delete('appointments/{id}', 'AppointmentsController@delete');
 
    // Feedback
    Route::post('feedback', 'FeedbackController@create');

    // Staff
    Route::post('staff', 'StaffController@create');
    Route::post('staff/upload', 'StaffController@upload');

    // Students
    Route::get('students', 'StudentsController@index');
    Route::get('students/{id}', 'StudentsController@show');
    Route::get('students/student-number/{id}', 'StudentsController@getByStudentNumber');
    Route::get('students/profile/{id}', 'StudentsController@profile');
    Route::post('students', 'StudentsController@create');
    Route::post('students/upload', 'StudentsController@upload');
    Route::put('students', 'StudentsController@update');
    Route::delete('students/{id}', 'StudentsController@destroy');

    // Staff Schedule
    Route::get('staff/{id}/schedule', 'StaffScheduleController@index');
    Route::get('staff/{id}/schedule/{timestamp}', 'StaffScheduleController@index');

    // Student Schedule
    Route::get('students/{id}/schedule', 'StudentScheduleController@index');
    Route::get('students/{id}/schedule/{timestamp}', 'StudentScheduleController@index');

    // Users
    Route::get('users', 'UsersController@getAllUsers');
    Route::get('users/administrators', 'UsersController@getAllAdministrators');

    // Wiki
    Route::get('wiki/groups', 'BlogController@getGroups');
    Route::get('wiki/groups/{id}', 'BlogController@getPostsByGroup');
    Route::get('wiki/posts/{id}', 'BlogController@getPostById');
    Route::get('wiki/{id}', 'BlogController@getPostById');
});

// Administrator and SysAdmin Routes
Route::middleware(['auth:api', 'expired-password', 'scope:admin,sysadmin'])->group(function() {
    // Auth
    Route::post('users/reset-passwords/', 'AuthController@resetPasswords');
    Route::post('users/invalidate-passwords/', 'AuthController@invalidatePasswords');
    Route::post('users/disable-users/', 'AuthController@disableAccounts');
    Route::post('users/reenable-users/', 'AuthController@reenableAccounts');

    // Staff
    Route::delete('staff/{id}', 'StaffController@destroy');

    // Settings
    Route::put('settings', 'SettingsController@update');
});

// SysAdmin Routes
Route::middleware(['auth:api', 'expired-password', 'scopes:sysadmin'])->group(function() {
    Route::post('sysadmins', 'SysAdminController@create');
});

// Incomplete
// Clusters
Route::post('clusters/students', 'ClustersController@attach');
Route::delete('clusters/students', 'ClustersController@detach');
Route::get('clusters', 'ClustersController@index');
Route::post('clusters', 'ClustersController@store');
Route::put('clusters', 'ClustersController@store');
Route::delete('clusters/{id}', 'ClustersController@delete');
Route::get('clusters/{id}', 'ClustersController@show');

// Blocks
Route::get('blocks', 'BlockController@index');
Route::post('blocks', 'BlockController@store');
Route::put('blocks', 'BlockController@store');
Route::delete('block/{id}', 'BlockController@destroy');

// Attendance
Route::get('attendance/{id}', 'AttendanceController@attendance');
