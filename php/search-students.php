<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

$term = mysqli_real_escape_string($conn, $_GET['term'] ?? '');

$query = "
  SELECT id, name, surname, student_number
  FROM Students
  WHERE student_number LIKE '%$term%' OR name LIKE '%$term%' OR surname LIKE '%$term%'
  ORDER BY surname ASC
  LIMIT 10
";

$result = mysqli_query($conn, $query);

$students = [];

while ($row = mysqli_fetch_assoc($result)) {
  
    $students[] = [
        'id' => $row['id'],
        'label' => "{$row['surname']} {$row['name']} (ΑΜ: {$row['student_number']})",
        'value' => "{$row['surname']} {$row['name']} (ΑΜ: {$row['student_number']})"
    ];
}

echo json_encode($students, JSON_UNESCAPED_UNICODE);
