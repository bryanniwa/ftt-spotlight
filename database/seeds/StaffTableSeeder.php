<?php

use Illuminate\Database\Seeder;

class StaffTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Staff::class, 20)->create();
        factory(App\Staff::class)->create([
            'staff_type' => 'administrator',
            'administrator' => true,
            'title' => 'Mr.',
            'first_name' => 'Bryan',
            'last_name' => 'Niwa',
            'initials' => 'BN',
            'email' => 'thebryanniwa@gmail.com'
        ]);
    }
}
