<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Staff;
use App\User;
use App\Http\Resources\Staff as StaffResource;
use App\Http\Resources\StaffProfile as StaffProfileResource;
use App\Http\Utils;
use App\Http\Traits\Authenticate;

class StaffController extends Controller
{
    
    use Authenticate;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get all staff members
        $staff = Staff::all();
        return StaffResource::collection($staff);
    }

    public function getAllAdministrators()
    {
        $staff = Staff::administrators();
        return StaffResource::collection($staff);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $email = $request->input('email');
        $params = [
            'staff_type' => $request->input('staff_type'),
            'administrator' => $request->input('administrator'),
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'title' => $request->input('title'),
            'initials' => $request->input('initials'),
            'staff_type' => 'teacher',
            'administrator' => $request->input('administrator'),
            'email' => $email,
            'color' => Utils::topicColor()
        ];
        
        $verification_response = $this->verify($request);
        if ($verification_response->status() === 200) { 
            if (User::userExists($email))
                abort(409, 'A staff by that email address already exists');

            $staff = Staff::create($params);
        } else {
            return $verification_response;
        }

        return new StaffResource($staff);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $staff = Staff::findOrFail($id);
        // Return staff as resource
        return new StaffResource($staff);
    }

    public function destroy($id)
    {
        $staff = Staff::findOrFail($id);
    
        if ($staff->delete()) {
            return new StaffResource($staff);
        }
    }

    /**
     * Retreive a collection of data about the staff member
     */
    public function profile($id)
    {
        $staff = Staff::findOrFail($id);

        return new StaffProfileResource($staff);
    }

    public function setCapacity(Request $request)
    {
        $capacity = $request->input('capacity');
        $staff = auth()->user()->staff();
        $staff->setCapacity($capacity);
        return new StaffResource($staff);
    }

    public function upload(Request $request)
    {
        $verification_response = $this->verify($request);
        if ($verification_response->status() === 200) {
            $file_path = $request->file('file')->store('staff-uploads');

            return $file_path;
        } else {
            return $verification_response;
        }
    }
}
