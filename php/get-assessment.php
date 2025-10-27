<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/database-connection.php';

$pid = intval($_GET['projectId'] ?? 0);
if(!$pid){ echo json_encode(['success'=>false]); exit; }

$res = mysqli_query($conn,
  "SELECT * FROM Assessments WHERE project_ref = $pid LIMIT 1");

if($res && mysqli_num_rows($res)){
  echo json_encode(['success'=>true,'row'=>mysqli_fetch_assoc($res)],
                   JSON_UNESCAPED_UNICODE);
} else {
  echo json_encode(['success'=>false]);
}
