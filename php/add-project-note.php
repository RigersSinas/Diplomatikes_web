<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__.'/database-connection.php';

$project = intval($_POST['project_id'] ?? 0);

$author  = intval($_POST['author_id']  ?? 0);

$body    = trim($_POST['body'] ?? '');

if (!$project || !$author || $body === '') {

  echo json_encode(['success'=>false,'message'=>'Λείπουν πεδία.']); exit;
}

if (mb_strlen($body) > 300) {

  echo json_encode(['success'=>false,'message'=>'Μέγιστο 300 χαρακτήρες.']); exit;

}

$bodyEsc = mysqli_real_escape_string($conn, $body);

$sql = "INSERT INTO ProjectNotes (project_ref, author_id, body) 
        VALUES ($project, $author, '$bodyEsc')";

if (mysqli_query($conn, $sql)) {

  echo json_encode(['success'=>true]);

} else {

  echo json_encode(['success'=>false,'message'=>'DB error']);

}

mysqli_close($conn);
