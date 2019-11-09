<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Staff;
use App\Student;
use App\Block;
use App\BlockSchedule;
use App\Course;
use App\Topic;
use App\TopicSchedule;
use App\Http\Resources\Staff as StaffResource;
use App\Http\Resources\Amendment as AmendmentResource;
use App\Http\Resources\Appointment as AppointmentResource;
use App\Http\Resources\LedgerEntry as LedgerEntryResource;
use App\Http\Resources\BlockSchedule as BlockScheduleResource;
use App\Http\Resources\Course as CourseResource;
use App\Http\Resources\TopicSchedule as TopicScheduleResource;
use App\Http\Resources\SchedulePlan as SchedulePlanResource;
use App\Http\Utils;

class StaffScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id, $datetime = null)
    {
        $include_weekends = app('settings')['weekends'] == true;
        $year_start = strtotime(app('settings')['start_datetime']);
        $year_end = strtotime(app('settings')['end_datetime']);
        if ($datetime === null) {
            $timestamp = time();
        } else {
            $timestamp = strtotime($datetime);
        }
        $start_time = $timestamp === strtotime('sunday') ? $timestamp : strtotime('previous sunday', $timestamp);
        $end_time = strtotime('+1 weeks -1 days', $start_time);
        $next_time = strtotime('+1 weeks +0 days', $end_time);
        $previous_time = strtotime('-1 weeks +1 days', $start_time);
        
        $staff = Staff::findOrFail($id);
        $blocks = $staff->getBlocks();
        $staff_block_schedule = $staff->getBlockSchedule();
        $appointments = $staff->appointments();
        $amendments = $staff->amendments();
        $ledger_entries = $staff->ledgerEntries();
        $plans = $staff->plans();
        $topic_schedules = TopicSchedule::whereIn('topic_id', $staff->getTopics()->pluck('id')->toArray());
        
        $staff_schedule = [
            'range' => Utils::formatRangeString($start_time, $end_time),
            'next' => $next_time <= $year_end ? date('Y-m-d\TH:i:s', $next_time) : null,
            'previous' => $previous_time >= $year_start ? date('Y-m-d\TH:i:s', $previous_time) : null,
            'min_date' => date('Y-m-d', strtotime(app('settings')['start_datetime'])),
            'max_date' => date('Y-m-d', strtotime(app('settings')['end_datetime']))
        ];

        for ($week_start = $start_time; $week_start < $end_time; $week_start = strtotime('+1 week', $week_start)) {
            $week_end = strtotime('+1 week', $week_start);
            $schedule_by_week = []; // Segmented by week
            for ($time = $week_start; $time < $week_end; $time = strtotime('+1 day', $time)) {
                $day_of_week = date('w', $time) + 1;

                // Skip weekends according to settings
                if (!$include_weekends && ($day_of_week == 1 || $day_of_week == 7)) {
                    continue;
                }
                $date = date('Y-m-d', $time);
                $blocks_of_day = $staff_block_schedule->where('day_of_week', $day_of_week);

                $schedule_day = [
                    'blocks' => [],
                    'date' => Utils::getFullDate($time),
                    'events' => []
                ];
                $blocks_of_day->each(function($block_schedule) use ($amendments, $appointments, $blocks, $date, $ledger_entries, $plans, $topic_schedules, &$schedule_day, $year_start, $year_end) {
                    if (strtotime($date. ' '. $block_schedule->end) < $year_start || strtotime("$date $block_schedule->start") > $year_end) {
                        // Only include blocks within school year
                        return;
                    }
                    $block = $blocks->where('id', $block_schedule->block_id)->first();
                    if ($block) {
                        $day_block = [
                            'id' => $block->id,
                            'flex' => $block->flex == false ? false : true,
                            'label' => $block->label,
                            'start' => date('g:i A', strtotime($date. ' '. $block_schedule->start)),
                            'end' => date('g:i A', strtotime($date. ' '. $block_schedule->end)),
                            'pending' => strtotime($date. ' '. $block_schedule->end) > time()
                        ];
                        $day_block['amendments'] = AmendmentResource::collection($amendments->get()->where('block_id', $block->id)->where('date', $date));
                        $day_block['appointments'] = AppointmentResource::collection($appointments->get()->where('block_id', $block->id)->where('date', $date));                        
                        $day_block['logs'] = LedgerEntryResource::collection($ledger_entries->get()->whereDate('checked_in_at', '=', $date)->where('block_id', $block->id));
                        $day_block['planned'] = SchedulePlanResource::collection($plans->get()->where('date', $date)->where('block_id', $block->id));
                        if ($block->flex) {
                            $topic_schedule = $topic_schedules->get()->where('block_id', $block_schedule->block_id)->where('date', $date)->first();
                            if ($topic_schedule)
                                $day_block['scheduled'] = new TopicScheduleResource($topic_schedule);
                        }
                        else {
                            $day_block['scheduled'] = new CourseResource(Course::find($block->pivot->course_id));
                        }
                        array_push($schedule_day['blocks'], $day_block);
                    }
                });
                array_push($schedule_by_week, $schedule_day);

            }
            $staff_schedule['schedule'] = $schedule_by_week;
        }
        return $staff_schedule;
    }
}
