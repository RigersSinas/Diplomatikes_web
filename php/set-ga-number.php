<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__.'/database-connection.php';

$pid = intval($_POST['projectId']  ?? 0);

$ga  = trim($_POST['ga_number']    ?? '');

if (!$pid || $ga === '') {
  echo json_encode(['success'=>false,'message'=>'Missing parameters']);
  exit;
}

/* απλός καθαρισμός (max 50 χαρακτήρες) */

$gaEsc = mysqli_real_escape_string($conn, substr($ga,0,50));

$q = "UPDATE ProjectMeta SET ga_number = '$gaEsc' WHERE project_id = $pid";

if (mysqli_query($conn, $q)) {

  echo json_encode(['success'=>true,'message'=>'Ο ΑΠ αποθηκεύτηκε.']);

} else {
  
  echo json_encode(['success'=>false,'message'=>'DB error: '.mysqli_error($conn)]);

}
