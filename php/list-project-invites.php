<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

$projectId = isset($_GET['project_id']) ? intval($_GET['project_id']) : 0;

if ($projectId === 0) {
    echo json_encode([]);
    exit;
}

// Απλό mysqli_query όπως δουλεύεις

$sql = "
    SELECT pi.invite_id,
           pi.invite_status,
           DATE_FORMAT(pi.sent_on, '%d/%m/%Y %H:%i') AS sent_on,
           DATE_FORMAT(pi.updated_on, '%d/%m/%Y %H:%i') AS updated_on,
           pr.name,
           pr.surname
    FROM ProjectInvites pi
    JOIN Professors pr ON pr.id = pi.professor_invited
    WHERE pi.project_ref = $projectId
    ORDER BY pi.sent_on DESC
";

$result = mysqli_query($conn, $sql);

$rows   = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
}

echo json_encode($rows);

mysqli_close($conn);
