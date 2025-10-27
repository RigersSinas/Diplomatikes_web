<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__.'/database-connection.php';

$project = intval($_GET['project_id'] ?? 0);

$author  = intval($_GET['author_id']  ?? 0);

if (!$project || !$author) { echo '[]'; exit; }

$sql = "
  SELECT note_id,
         DATE_FORMAT(noted_on,'%d/%m/%Y %H:%i') AS noted_on,
         body
  FROM ProjectNotes
  WHERE project_ref = $project AND author_id = $author
  ORDER BY noted_on DESC";

$res = mysqli_query($conn, $sql);

$out = [];

if ($res) while ($row = mysqli_fetch_assoc($res)) $out[] = $row;

echo json_encode($out); 

mysqli_close($conn);
