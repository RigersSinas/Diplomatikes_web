<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

/* 1) Έλεγχος παραμέτρου -------------------------------------------- */
$projectId = intval($_POST['project_id'] ?? 0);
if (!$projectId) {
  echo json_encode(['success'=>false,'message'=>'Μη έγκυρο ID']); exit;
}

/* 2) Κύριο ερώτημα -------------------------------------------------- */
$sql = "
SELECT
  /* ---- Projects ---- */
  p.project_id,
  p.title,
  p.created_on,
  p.phase,
  p.supervisor_id,
  p.student_id,
  p.reviewer_a,
  p.reviewer_b,
  p.modified_on,
  p.finished_on,

  /* ---- ProjectMeta ---- */
  pm.meta_id,
  pm.summary,
  pm.attachment,
  pm.draft_attachment,
  pm.resources,
  pm.receipt_code,
  pm.repo_link,
  pm.cancelled_by,
  pm.cancellation_reason,
  pm.cancellation_year,
  pm.ga_number,

  /* ---- Student ---- */
  CONCAT(s.name,' ',s.surname)           AS student_name,
  s.student_number,

  /* ---- Ονόματα επιτροπής (FULL) ---- */
  CONCAT(sup.name ,' ',sup.surname)      AS supervisor_name,
  CONCAT(revA.name,' ',revA.surname)     AS reviewer_a_name,
  CONCAT(revB.name,' ',revB.surname)     AS reviewer_b_name,

  /* ---- Στοιχεία εξέτασης ---- */
  a.room,
  a.sched_date,
  a.sched_time,

  /* ---- Τελικός βαθμός ---- */
  sc.final_mark

FROM Projects p
LEFT JOIN ProjectMeta pm  ON pm.project_id  = p.project_id
LEFT JOIN Students    s   ON s.id           = p.student_id

/* καθηγητές */
LEFT JOIN Professors sup  ON sup.id  = p.supervisor_id
LEFT JOIN Professors revA ON revA.id = p.reviewer_a
LEFT JOIN Professors revB ON revB.id = p.reviewer_b

/* εξέταση & βαθμολογία */
LEFT JOIN Assessments a ON a.project_ref = p.project_id
LEFT JOIN Scores      sc ON sc.project_ref = p.project_id

WHERE p.project_id = $projectId
";

$result = mysqli_query($conn, $sql);
if (!$result || !mysqli_num_rows($result)) {
  echo json_encode(['success'=>false,'message'=>'Δεν βρέθηκε η διπλωματική']);
  mysqli_close($conn);
  exit;
}

$row = mysqli_fetch_assoc($result);

/* 3) Links από ProjectLinks ---------------------------------------- */
$linksRes = mysqli_query(
  $conn,
  "SELECT url FROM ProjectLinks WHERE project_ref = $projectId ORDER BY added_on DESC"
);
$linksArr = [];
if ($linksRes) {
  while ($ln = mysqli_fetch_assoc($linksRes)) $linksArr[] = $ln['url'];
}
$row['links'] = $linksArr;

/* 4) Έξοδος --------------------------------------------------------- */
echo json_encode(['success'=>true,'data'=>$row], JSON_UNESCAPED_UNICODE);
mysqli_close($conn);
