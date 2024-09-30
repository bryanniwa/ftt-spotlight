<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Staff;
use App\Http\Utils;

class StaffImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $first_name = $row['first_name'];
        $last_name = $row['last_name'];

        return new Staff([
            'email' => $row['email'],
            'title' => $row['title'],
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'initials' => substr($first_name, 0, 1). substr($last_name, 0, 1),
            'administrator' => false,
            'color' => Utils::topicColor()
        ]);
    }
}
