<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$projectId = isset($_GET['project_id']) ? intval($_GET['project_id']) : 0;

if ($projectId === 0) {
    echo json_encode([]);
    exit;
}

$sql = "
  SELECT pi.invite_status, pi.sent_on,
         p.name, p.surname, p.email
  FROM ProjectInvites pi
  JOIN Professors p ON pi.professor_invited = p.id
  WHERE pi.project_ref = ?
  ORDER BY pi.sent_on DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $projectId);
$stmt->execute();
$result = $stmt->get_result();

$invites = [];
while ($row = $result->fetch_assoc()) {
    $invites[] = $row;
}

echo json_encode($invites);
$stmt->close();
$conn->close();
