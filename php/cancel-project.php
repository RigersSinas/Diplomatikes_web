<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__.'/database-connection.php';

$projectId = intval($_POST['project_id'] ?? 0);

$gaNum     = intval($_POST['ga_num']     ?? 0);

$gaYear    = intval($_POST['ga_year']    ?? 0);

$profId    = intval($_SESSION['id'] ?? 0);     

if (!$projectId || !$gaNum || !$gaYear) {
  echo json_encode(['success'=>false,'message'=>'Λείπουν πεδία.']); exit;
}

/* 1) Επαλήθευση supervisor + ηλικία ≥ 2 έτη */

$chk = mysqli_query($conn,"
  SELECT supervisor_id, phase, created_on
  FROM Projects WHERE project_id=$projectId
");

if (!$chk || !mysqli_num_rows($chk)) {
  echo json_encode(['success'=>false,'message'=>'Δεν βρέθηκε.']); exit;
}

$row = mysqli_fetch_assoc($chk);

$diff = (time() - strtotime($row['created_on'])) / (365*24*60*60);

if ($diff < 2) {
  echo json_encode(['success'=>false,'message'=>'Πρέπει να περάσουν 2 έτη.']); exit;
}

/* 2) UPDATEs */

mysqli_query($conn, "UPDATE Projects SET phase='cancelled'
                     WHERE project_id=$projectId");

mysqli_query($conn, "
  UPDATE ProjectMeta
  SET cancelled_by       ='$profId',
      cancellation_reason='από Διδάσκοντα',
      cancellation_year  =$gaYear,
      ga_number          =$gaNum
  WHERE project_id=$projectId
");

echo json_encode(['success'=>true]);
mysqli_close($conn);
