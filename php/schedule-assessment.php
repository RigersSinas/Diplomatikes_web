<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/database-connection.php';

$pid   = intval($_POST['projectId'] ?? 0);
$date  = $_POST['sched_date'] ?? '';
$time  = $_POST['sched_time'] ?? '';
$mode  = $_POST['mode'] ?? '';
$room  = $_POST['room'] ?? null;
$url   = $_POST['meeting_url'] ?? null;
$title = $_POST['notice_title'] ?? null;
$body  = $_POST['notice_body'] ?? null;

if(!$pid || !$date || !$time || !in_array($mode,['onsite','remote'])){
  echo json_encode(['success'=>false,'message'=>'Missing fields']); exit;
}

/* → INSERT ή UPDATE στον πίνακα Assessments */
$escaped = fn($v) => "'".mysqli_real_escape_string ($conn,$v)."'";
$res = mysqli_query($conn,"SELECT assessment_id FROM Assessments WHERE project_ref = $pid");

if($res && mysqli_num_rows($res)){             /* UPDATE */
  $q = "
    UPDATE Assessments SET
      sched_date   = '$date',
      sched_time   = '$time',
      mode         = '$mode',
      room         = ".($room  ? $escaped($room)  : "NULL").",
      meeting_url  = ".($url   ? $escaped($url)   : "NULL").",
      notice_title = ".($title ? $escaped($title) : "NULL").",
      notice_body  = ".($body  ? $escaped($body)  : "NULL")."
    WHERE project_ref = $pid
  ";
} else {                                       /* INSERT */
  $q = "
    INSERT INTO Assessments
      (project_ref,sched_date,sched_time,mode,room,meeting_url,notice_title,notice_body)
    VALUES
      ($pid,'$date','$time','$mode',
       ".($room  ? $escaped($room)  : "NULL").",
       ".($url   ? $escaped($url)   : "NULL").",
       ".($title ? $escaped($title) : "NULL").",
       ".($body  ? $escaped($body)  : "NULL").")
  ";
}

if (!mysqli_query($conn,$q)) {
  echo json_encode(['success'=>false,'message'=>'DB error: '.mysqli_error($conn)]); exit;
}

/* ➜ 2ο βήμα: ενημέρωσε το phase του Project */
if (!mysqli_query($conn,"UPDATE Projects SET phase='exam_scheduled' WHERE project_id=$pid")) {
  echo json_encode(['success'=>false,'message'=>'Assessment saved, but phase update failed: '.mysqli_error($conn)]); exit;
}

echo json_encode(['success'=>true,'message'=>'Η εξέταση καταχωρήθηκε & το project μπήκε σε phase exam_scheduled.']);
