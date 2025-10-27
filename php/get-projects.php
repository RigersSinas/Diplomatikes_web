<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

/* 1) Παράμετροι -------------------------------------------------- */

$profId = mysqli_real_escape_string($conn, $_GET['professorId'] ?? '');

$role   = $_GET['role'] ?? '';   // "professor" | "secretary"

/* 2) Βασικό SELECT  ---------------------------------------------- */

$baseSql = "
SELECT
  p.project_id,
  p.title,
  p.created_on,

  /* --- ProjectMeta --- */
  pm.summary,
  pm.attachment,
  pm.repo_link,         
  
  /* --- Scores --- */

  sc.final_mark,       

  /* --- Projects πεδία --- */
  p.phase,
  p.supervisor_id,
  p.reviewer_a,
  p.reviewer_b,

  /* --- Σχετικά ονόματα --- */
  s.name    AS student_name,
  prof.name AS professor_name

FROM Projects p
INNER JOIN Professors prof ON prof.id = p.supervisor_id
LEFT  JOIN ProjectMeta pm  ON pm.project_id  = p.project_id
LEFT  JOIN Students    s   ON s.id           = p.student_id
LEFT  JOIN Scores      sc  ON sc.project_ref = p.project_id   
";

/* 3) Φιλτράρισμα μόνο αν ΔΕΝ είμαστε γραμματεία ------------------- */

if ($role !== 'secretary') {
  $baseSql .= "
    WHERE prof.id = '$profId'
       OR p.reviewer_a = '$profId'
       OR p.reviewer_b = '$profId'
  ";
}

/* 4) Ταξινόμηση -------------------------------------------------- */

$baseSql .= " ORDER BY p.created_on DESC";

/* 5) Εκτέλεση & έξοδος ------------------------------------------ */

$result   = mysqli_query($conn, $baseSql);

$projects = [];

while ($row = mysqli_fetch_assoc($result)) {
  $projects[] = $row;
}

echo json_encode($projects, JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
