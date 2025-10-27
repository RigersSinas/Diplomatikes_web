<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

$profId = intval($_GET['professorId'] ?? 0);

if (!$profId) {
  echo json_encode(['success'=>false,'message'=>'Μη έγκυρος κωδικός χρήστη']);
  exit;
}

// α) Μέσος χρόνος για επιβλέψεις

$sql1 = "
  SELECT AVG(DATEDIFF(p.finished_on, p.created_on)) AS avg_days
  FROM Projects p
  WHERE p.supervisor_id = $profId
    AND p.finished_on IS NOT NULL
";

$res1 = mysqli_query($conn, $sql1);

$row1 = $res1 && mysqli_num_rows($res1) ? mysqli_fetch_assoc($res1) : null;

// β) Μέσος χρόνος ως μέλος τριμελούς

$sql2 = "
  SELECT AVG(DATEDIFF(p.finished_on, p.created_on)) AS avg_days
  FROM Projects p
  WHERE (p.reviewer_a = $profId OR p.reviewer_b = $profId)
    AND p.finished_on IS NOT NULL
";

$res2 = mysqli_query($conn, $sql2);

$row2 = $res2 && mysqli_num_rows($res2) ? mysqli_fetch_assoc($res2) : null;

// γ) Μέσος βαθμός για επιβλέψεις

$sql3 = "
  SELECT AVG(sc.final_mark) AS avg_mark
  FROM Scores sc
  JOIN Projects p ON p.project_id = sc.project_ref
  WHERE p.supervisor_id = $profId
    AND sc.final_mark IS NOT NULL
";

$res3 = mysqli_query($conn, $sql3);

$row3 = $res3 && mysqli_num_rows($res3) ? mysqli_fetch_assoc($res3) : null;


// δ) Μέσος βαθμός ως μέλος τριμελούς

$sql4 = "
  SELECT AVG(sc.final_mark) AS avg_mark
  FROM Scores sc
  JOIN Projects p ON p.project_id = sc.project_ref
  WHERE (p.reviewer_a = $profId OR p.reviewer_b = $profId)
    AND sc.final_mark IS NOT NULL
";

$res4 = mysqli_query($conn, $sql4);

$row4 = $res4 && mysqli_num_rows($res4) ? mysqli_fetch_assoc($res4) : null;

// ε) Συνολικό πλήθος επιβλεπόμενων διπλωματικών

$sql5 = "
  SELECT COUNT(*) AS cnt
  FROM Projects p
  WHERE p.supervisor_id = $profId
";

$res5 = mysqli_query($conn, $sql5);

$row5 = $res5 && mysqli_num_rows($res5) ? mysqli_fetch_assoc($res5) : null;

// στ) Συνολικό πλήθος διπλωματικών ως μέλος τριμελούς

$sql6 = "
  SELECT COUNT(*) AS cnt
  FROM Projects p
  WHERE p.reviewer_a = $profId OR p.reviewer_b = $profId
";

$res6 = mysqli_query($conn, $sql6);

$row6 = $res6 && mysqli_num_rows($res6) ? mysqli_fetch_assoc($res6) : null;

echo json_encode([
  'success'               => true,
  'supervised_avg_days'   => $row1['avg_days']   !== null ? round($row1['avg_days'],2) : null,
  'reviewed_avg_days'     => $row2['avg_days']   !== null ? round($row2['avg_days'],2) : null,
  'supervised_avg_mark'   => $row3['avg_mark']   !== null ? round($row3['avg_mark'],2) : null,
  'reviewed_avg_mark'     => $row4['avg_mark']   !== null ? round($row4['avg_mark'],2) : null,
  'supervised_count'      => isset($row5['cnt']) ? (int)$row5['cnt'] : 0,
  'reviewed_count'        => isset($row6['cnt']) ? (int)$row6['cnt'] : 0,
], JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
