<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Student;
use App\Http\Utils;

class StudentImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $first_name = $row['first_name'];
        $last_name = $row['last_name'];

        return new Student([
            'student_number'  => $row['student_number'],
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'grade' => $row['grade'],
            'initials' => substr($first_name, 0, 1). substr($last_name, 0, 1),
            'color' => Utils::topicColor()
        ]);
    }
}
