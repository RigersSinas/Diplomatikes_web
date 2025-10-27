<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__.'/database-connection.php';

$projectId = intval($_POST['project_id']   ?? 0);

$profId    = intval($_POST['professor_id'] ?? 0);   // ← από Ajax

if (!$projectId || !$profId) {
  echo json_encode(['success'=>false,'message'=>'Λείπουν δεδομένα.']); exit;
}

/* έλεγχος supervisor + φάση active */
$chk = mysqli_query($conn,"
  SELECT supervisor_id, phase
  FROM Projects
  WHERE project_id = $projectId
");
if (!$chk || !mysqli_num_rows($chk)) {
  echo json_encode(['success'=>false,'message'=>'Δεν βρέθηκε.']); exit;
}
$row = mysqli_fetch_assoc($chk);

if ($row['supervisor_id'] != $profId) {
  echo json_encode(['success'=>false,'message'=>'Δεν είστε επιβλέπων.']); exit;
}
if ($row['phase'] !== 'active') {
  echo json_encode(['success'=>false,'message'=>'Η διπλωματική δεν είναι ενεργή.']); exit;
}

/* ενημέρωση */
$ok = mysqli_query($conn,"
  UPDATE Projects
  SET phase='in_review',
      modified_on = NOW()
  WHERE project_id = $projectId
");

echo json_encode(['success'=>$ok ? true : false,'message'=>$ok ? '' : 'DB error']);
mysqli_close($conn);
?>
