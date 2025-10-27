<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

/* ------------------------------------------------------
   1)  Παραλαβή & έλεγχος παραμέτρου
------------------------------------------------------ */
$studentId = intval($_GET['studentId'] ?? 0);
if ($studentId === 0) { echo '[]'; exit; }

/* ------------------------------------------------------
   2)  Ερώτημα –  JOIN με Professors για να πάρουμε τα ονόματα
------------------------------------------------------ */
$sql = "
SELECT
  /* ----  Projects  ---- */
  p.project_id,
  p.title,
  p.phase,
  p.created_on,
  p.modified_on,
  p.finished_on,

  /* ----  IDs  (μπορεί να τα χρειαστείς)  ---- */
  p.supervisor_id,
  p.reviewer_a,
  p.reviewer_b,

  /* ----  Ονοματεπώνυμα καθηγητών  ---- */
  CONCAT(sup.name,  ' ', sup.surname)  AS supervisor_name,
  CONCAT(revA.name, ' ', revA.surname) AS reviewer_a_name,
  CONCAT(revB.name, ' ', revB.surname) AS reviewer_b_name,

  /* ----  ProjectMeta  ---- */
  pm.summary,
  pm.attachment,
  pm.draft_attachment,
  pm.resources,
  pm.receipt_code,
  pm.repo_link,
  pm.cancelled_by,
  pm.cancellation_reason,
  pm.cancellation_year,
  pm.ga_number

FROM Projects p
/* τριπλό LEFT JOIN στο ίδιο table Professors */
LEFT JOIN Professors sup  ON sup.id  = p.supervisor_id
LEFT JOIN Professors revA ON revA.id = p.reviewer_a
LEFT JOIN Professors revB ON revB.id = p.reviewer_b
/* meta */
LEFT JOIN ProjectMeta pm  ON pm.project_id = p.project_id
WHERE p.student_id = $studentId
";

$result = mysqli_query($conn, $sql);

$out = [];

while ($row = mysqli_fetch_assoc($result)) {
  $out[] = $row;
}

// ➜ Για κάθε project, φέρε και τα links

foreach ($out as &$project) {

  $pid = intval($project['project_id']);

  $linksRes = mysqli_query($conn,

    "SELECT url FROM ProjectLinks WHERE project_ref = $pid ORDER BY added_on DESC"
  );

  $linksArr = [];

  if ($linksRes) {

    while ($ln = mysqli_fetch_assoc($linksRes)) $linksArr[] = $ln['url'];

  }

  $project['links'] = $linksArr;

}

echo json_encode($out, JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
