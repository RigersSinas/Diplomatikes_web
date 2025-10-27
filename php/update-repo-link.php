<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/database-connection.php';

$pid  = intval($_POST['projectId']  ?? 0);
$link = trim($_POST['repo_link']    ?? '');

if (!$pid || !$link){
  echo json_encode(['success'=>false,'message'=>'Missing fields']); exit;
}

$linkEsc = mysqli_real_escape_string($conn,$link);

$q = "
  UPDATE ProjectMeta
  SET repo_link = '$linkEsc'
  WHERE project_id = $pid
";

if (mysqli_query($conn,$q)){
  echo json_encode(['success'=>true,'message'=>'Το repository αποθηκεύτηκε.']);
} else {
  echo json_encode(['success'=>false,'message'=>mysqli_error($conn)]);
}
