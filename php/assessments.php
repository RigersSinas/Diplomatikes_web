<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../php/database-connection.php';

/* 1)  Παράμετροι ημερομηνίας  ---------------------------------- */

$today = date('Y-m-d');

$from  = $_GET['from'] ?? $today;

$to    = $_GET['to']   ?? date('Y-m-d', strtotime('+30 days'));

$regex = '/^\d{4}-\d{2}-\d{2}$/';            // απλό ISO check

if (!preg_match($regex, $from) || !preg_match($regex, $to)) {
  http_response_code(400);
  echo json_encode(['error'=>'Invalid date format (YYYY-MM-DD)']);
  exit;
}

/* 2)  SQL: Ανακοινώσεις + βασικές πληροφορίες  ----------------- */

$sql = "
  SELECT
    a.assessment_id,
    a.sched_date,
    a.sched_time,
    a.mode,
    a.room,
    a.meeting_url,
    a.notice_title,
    a.notice_body,
    p.title                             AS project_title,
    CONCAT(s.name,' ',s.surname)        AS student_name
  FROM Assessments  a
  JOIN Projects     p ON p.project_id = a.project_ref
  LEFT JOIN Students s ON s.id        = p.student_id
  WHERE a.sched_date BETWEEN ? AND ?
  ORDER BY a.sched_date, a.sched_time
";

/* 3)  Εκτέλεση safely με prepared statement  ------------------- */

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, 'ss', $from, $to);

mysqli_stmt_execute($stmt);

$res = mysqli_stmt_get_result($stmt);

$out = [];

while ($row = mysqli_fetch_assoc($res)) {

  $out[] = $row;

}

echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

mysqli_close($conn);
