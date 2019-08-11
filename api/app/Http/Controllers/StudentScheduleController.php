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
use App\Http\Resources\Appointment as AppointmentResource;
use App\Http\Resources\LedgerEntry as LedgerEntryResource;
// use App\Http\Resources\Block as BlockResource;
use App\Http\Resources\Course as CourseResource;

function formatRangeString($start, $end) {
    $start_date = date('j', $start);
    $end_date = date('j', $end);
    $start_month = date('M', $start);
    $end_month = date('n', $start) < date('n', $end) ? date('M', $end) : "";
    $start_year = date('Y', $start) < date('Y', $end) ? date('Y', $start) : "";
    $end_year = date('Y', $end);
    // return "$start - $end";
    return "$start_month $start_date". ($start_year ? ", $start_year" : ""). " - ". ($end_month ? "$end_month " : ""). "$end_date, $end_year";
}

class StudentScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id, $datetime = null)
    {
        $include_weekends = app('settings')['weekends'] == true;
        if ($datetime === null) {
            $timestamp = time();
        } else {
            $timestamp = strtotime($datetime);
        }
        $start_time = $timestamp === strtotime('sunday') ? $timestamp : strtotime('previous sunday', $timestamp);
        $end_time = strtotime('+1 weeks -1 days', $start_time);
        
        $student = Student::findOrFail($id);
        $courses = $student->courses($start_time, $end_time)->get();
        $blocks = $student->getBlocks($start_time, $end_time);
        $appointments = $student->appointments();
        $ledger_entries = $student->ledgerEntries()->get();
        $plans = $student->plans();

        $student_schedule = [
            'range' => formatRangeString($start_time, $end_time),
            'next' => date('Y-m-d\TH:i:s', strtotime('+1 weeks +0 days', $end_time)),
            'previous' => date('Y-m-d\TH:i:s', strtotime('-1 weeks +1 days', $start_time))
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
                $blocks_of_day = $student->getBlockSchedule($start_time, $end_time)->where('day_of_week', $day_of_week);
                $schedule_day = [
                    'blocks' => [],
                    'date' => [
                        'full_date' => date('M j, Y', strtotime($date)),
                        'date' => date('j', $time),
                        'day' => date('D', $time),
                        'is_today' => date('Y-m-d', $time) === date('Y-m-d')
                    ],
                    'events' => []
                ];
                $blocks_of_day->each(function($block_schedule) use ($appointments, $blocks, $date, $ledger_entries, $plans, &$schedule_day) {
                    $block = $blocks->where('id', $block_schedule->block_id)->first();
                    if ($block) {
                        $day_block = [
                            'id' => $block->id,
                            'flex' => $block->flex == false ? false : true,
                            'label' => $block->label,
                            'start' => date('g:i A', strtotime($date. ' '. $block_schedule->start)),
                            'end' => date('g:i A', strtotime($date. ' '. $block_schedule->end)),
                            'pending' => strtotime($date. ' '. $block->end) > time()
                        ];
                        $day_block['appointments'] = AppointmentResource::collection($appointments->get()->where('block_id', $block->id)->where('date', $date));                        
                        $day_block['logs'] = LedgerEntryResource::collection($ledger_entries->where('date', $date)->where('block_id', $block->id));
                        if ($block->flex) {
                            $plan = $plans->get()->where('date', $date)->where('block_id', $block->id)->flatten()->first();
                            if ($plan) {
                                $staff = $plan->staff()->first();
                                $topic_ids = $staff->getTopics()->pluck('id')->toArray();
                                $day_block['scheduled'] = new StaffResource($staff);
                                $topic = TopicSchedule::whereIn('topic_id', $topic_ids)->where('date', $date)->where('block_schedule_id', $block_schedule->id)->first();
                                if ($topic) {
                                    $day_block['scheduled']['topic'] = $topic->topic;
                                }
                            }
                        }
                        else {
                            $day_block['scheduled'] = Course::find($block->pivot->course_id);
                        }
                        array_push($schedule_day['blocks'], $day_block);
                    }
                });
                array_push($schedule_by_week, $schedule_day);

            }
            $student_schedule['schedule'] = $schedule_by_week;
        }
        return $student_schedule;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
