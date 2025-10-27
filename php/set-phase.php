<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

/* ------------------------------------------------------------------
   1)  Validation παραμέτρων
------------------------------------------------------------------ */

$pid   = intval($_POST['projectId'] ?? 0);

$phase = $_POST['phase']           ?? '';

$valid = [
  'draft','submitted','active','in_review',
  'exam_scheduled','marking','marked',
  'cancelled','finished'
];

if (!$pid || !in_array($phase, $valid)) {
  echo json_encode(['success' => false, 'message' => 'Invalid params']);
  exit;
}

/* ------------------------------------------------------------------
   2)  UPDATE phase  (+ finished_on όταν χρειάζεται)
------------------------------------------------------------------ */

$setFinished = ($phase === 'finished') ? ", finished_on = NOW()" : '';

$upd = "UPDATE Projects
        SET phase = '$phase' $setFinished
        WHERE project_id = $pid";

if (!mysqli_query($conn, $upd)) {

  echo json_encode(['success' => false, 'message' => mysqli_error($conn)]);

  exit;

}

/* ------------------------------------------------------------------
   3)  Αν η νέα φάση είναι “marking” ► δημιουργία εγγραφής Scores
------------------------------------------------------------------ */

if ($phase === 'marking') {

  /* 3.1  IDs τριμελούς */
  $r = mysqli_query(
    $conn,
    "SELECT supervisor_id, reviewer_a AS rev1, reviewer_b AS rev2
     FROM Projects WHERE project_id = $pid"
  );

  if ($r && mysqli_num_rows($r)) {

    $row  = mysqli_fetch_assoc($r);
    $sup  = intval($row['supervisor_id']);
    $rev1 = intval($row['rev1']);
    $rev2 = intval($row['rev2']);

    /* 3.2  Αν δεν υπάρχει ήδη εγγραφή στον Scores */
    $exists = mysqli_query(
      $conn,
      "SELECT 1 FROM Scores WHERE project_ref = $pid LIMIT 1"
    );

    if (!$exists || !mysqli_num_rows($exists)) {
      mysqli_query(
        $conn,
        "INSERT INTO Scores (project_ref, supervisor_id, reviewer1_id, reviewer2_id)
         VALUES ($pid, $sup, $rev1, $rev2)"
      );
    }
  }
}

/* ------------------------------------------------------------------
   4)  Τέλος
------------------------------------------------------------------ */
echo json_encode(['success' => true, 'message' => 'Phase updated.']);
