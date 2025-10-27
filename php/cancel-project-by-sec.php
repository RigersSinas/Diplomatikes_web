<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__.'/database-connection.php';

$pid   = intval($_POST['projectId'] ?? 0);

$ga    = trim($_POST['ga_number']   ?? '');

$year  = intval($_POST['cancellation_year'] ?? 0);

$user  = mysqli_real_escape_string($conn, $_POST['cancelled_by'] ?? 'Γραμματεία');

if(!$pid || !$ga || !$year){

  echo json_encode(['success'=>false,'message'=>'Missing fields']); exit;

}

/* 1)  ενημέρωσε ProjectMeta */

$gaEsc = mysqli_real_escape_string($conn, substr($ga,0,50));

$reason = mysqli_real_escape_string($conn, 'Κατόπιν αίτησης φοιτητή/τριας');

$metaQ = "
  UPDATE ProjectMeta SET
    ga_number         = '$gaEsc',
    cancellation_year = $year,
    cancellation_reason = '$reason',
    cancelled_by      = '$user'
  WHERE project_id = $pid
";

/* 2)  άλλαξε το phase σε 'cancelled' στον πίνακα Projects */

$phaseQ = "UPDATE Projects SET phase = 'cancelled' WHERE project_id = $pid";

if (mysqli_query($conn, $metaQ) && mysqli_query($conn, $phaseQ)) {

  echo json_encode(['success'=>true,'message'=>'Η ανάθεση ακυρώθηκε.']);

} else {

  echo json_encode(['success'=>false,'message'=>'DB error: '.mysqli_error($conn)]);
  
}
