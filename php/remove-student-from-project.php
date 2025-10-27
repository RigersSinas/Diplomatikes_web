<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

$projectId = $_POST['project_id'] ?? null;

if (!$projectId || !is_numeric($projectId)) {

  echo json_encode(['success' => false, 'message' => 'Δεν δόθηκε έγκυρο project ID.']);

  exit;
  
}

$projectId = intval($projectId);  // ασφάλεια: cast σε ακέραιο

$query = "UPDATE Projects SET student_id = NULL ,phase = 'draft 'WHERE project_id = $projectId";

if (mysqli_query($conn, $query)) {

  echo json_encode(['success' => true]);

} else {

  echo json_encode(['success' => false, 'message' => mysqli_error($conn)]);

}

mysqli_close($conn);
