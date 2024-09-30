<?php

use Illuminate\Database\Seeder;

class StudentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $blocks = App\Block::where('flex', 0)->get();
        $staff_ids = App\Staff::pluck('id');
        // $faker =  Faker\Factory::create();

        factory(App\Student::class, 30)->create()->each(function ($student) use ($blocks, $staff_ids) {
            $blocks->each(function($block) use ($student, $staff_ids) {
                $course = $block->courses()->get()->random(1)->first();
                $staff_id = $staff_ids->random(1)->first();
            });
        });
    }
}
