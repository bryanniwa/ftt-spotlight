<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    protected $table = 'guardians';

    protected $fillable = [
        'first_name',
        'last_name',
        'email'
    ];

    public static function createUser(array $attributes)
    {
        $user = User::create([
            'first_name' => $attributes['first_name'],
            'last_name' => $attributes['last_name'],
            'username' => $attributes['email'],
            'account_type' => 'guardian'
        ]);

        $guardian = Guardian::create([
            'user_id' => $user->id
        ]);

        return $guardian;
    }

    public function students()
    {
        return $this->belongsToMany('App\Student', 'guardians_students')
            ->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
