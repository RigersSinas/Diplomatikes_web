<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__.'/database-connection.php';

$pid = intval($_GET['projectId'] ?? 0);
if (!$pid) {
  echo json_encode(['success'=>false,'message'=>'Missing projectId']); exit;
}

/* -----------------------------------------------------------------
   JOIN:  Projects   (πάντα 1)      LEFT JOIN Scores   (μπορεί να λείπει)
          Professors (3 φορές)      ώστε να πάρουμε ονόματα
------------------------------------------------------------------ */
$sql = "
SELECT
  /* ---- Scores (ή NULL) ---- */
  sc.score_id,
  sc.sup_quality,  sc.sup_duration,  sc.sup_text,  sc.sup_presentation,
  sc.rev1_quality, sc.rev1_duration, sc.rev1_text, sc.rev1_presentation,
  sc.rev2_quality, sc.rev2_duration, sc.rev2_text, sc.rev2_presentation,
  sc.final_mark,

  /* ---- IDs από Projects ---- */
  p.supervisor_id,
  p.reviewer_a      AS reviewer1_id,
  p.reviewer_b      AS reviewer2_id,

  /* ---- Ονόματα καθηγητών ---- */
  CONCAT(sup.name,  ' ', sup.surname) AS supervisor_name,
  CONCAT(r1.name ,  ' ', r1.surname)  AS reviewer1_name,
  CONCAT(r2.name ,  ' ', r2.surname)  AS reviewer2_name

FROM Projects p
LEFT JOIN Scores     sc  ON sc.project_ref = p.project_id     /* μπορεί να μην υπάρχει */
LEFT JOIN Professors sup ON sup.id  = p.supervisor_id
LEFT JOIN Professors r1  ON r1.id   = p.reviewer_a
LEFT JOIN Professors r2  ON r2.id   = p.reviewer_b
WHERE p.project_id = $pid
LIMIT 1
";

$res = mysqli_query($conn, $sql);

if ($res && mysqli_num_rows($res)) {

  echo json_encode(['success'=>true,'row'=>mysqli_fetch_assoc($res)],

                   JSON_UNESCAPED_UNICODE);
} else {

  /* project δεν βρέθηκε – σπάνιο */

  echo json_encode(['success'=>false,'message'=>'Project not found']);
  
}

mysqli_close($conn);
