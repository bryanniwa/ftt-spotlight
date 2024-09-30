<?php 

use Illuminate\Database\Seeder;

class LedgerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $students = App\Student::all();

        $students->each(function($student, $index) {
            $time = time() === strtotime('sunday') ? strtotime('sunday -14 days') : strtotime('previous sunday -14 days');
            $block_time = date('H:i:s', $time);
            do {
                $day_number = date('w', $time) + 1; // Sun = 1, Sat = 7
                $blocks = $student->getBlocks();
                $blocks->each(function($block) use (&$block_time, $day_number, $student, $time) {
                    if ($block->flex == false) {
                        $staff = App\Course::find($block->pivot->course_id)->staff();
                    } else {
                        $staff = App\Staff::all()->random();
                    }
                    $schedule_blocks = $block->schedule()->where('day_of_week', $day_number)->get();
                    $schedule_blocks->each(function($schedule_block) use ($block, &$block_time, $staff, $student, $time) {
                        if (rand(1, 14) !== 1) { // 1 in 14 chance of missing the block
                            $block_time = $schedule_block->start;
                            $date = date('Y-m-d', $time);
                            $params = [
                                'date' => $date,
                                'checked_in_at' => date('Y-m-d H:i:s', $time),
                                'block_id' => $block->id,
                                'staff_id' => $staff->id,
                                'student_id' => $student->id,
                                'method' => array_rand(['manual', 'air'])
                            ];
                            if ($block->flex) {
                                $topic_ids = $staff->getTopics()->pluck('id')->toArray();
                                $topic_schedule = App\TopicSchedule::whereIn('topic_id', $topic_ids)->where('date', $date)->where('block_id', $schedule_block->block_id)->first();
                                $params['topic_id'] = $topic_schedule->topic_id;
                            }
                            factory(App\LedgerEntry::class)->create($params);
                        }
                    });
                });
                $time = strtotime('+1 day', $time); // next day
            } while (strtotime(date('Y-m-d', $time). ' '. $block_time) <= time());
        });
    }
}
