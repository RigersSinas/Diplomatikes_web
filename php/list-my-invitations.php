<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$professorId = isset($_GET['professor_id']) ? intval($_GET['professor_id']) : 0;

if ($professorId === 0) {
    echo json_encode([]);
    exit;
}

$query = "
  SELECT pi.invite_id, pi.invite_status, pi.sent_on, 
         p.title, CONCAT(u.name, ' ', u.surname) AS student_name
  FROM ProjectInvites pi
  JOIN Projects p ON pi.project_ref = p.project_id
  JOIN Students u ON p.student_id = u.id
  WHERE pi.professor_invited = $professorId
  ORDER BY pi.sent_on DESC
";

$res = mysqli_query($conn, $query);
$data = [];

while ($row = mysqli_fetch_assoc($res)) {
    $data[] = $row;
}

echo json_encode($data);
mysqli_close($conn);
