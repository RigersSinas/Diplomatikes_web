<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$projectId = $_POST['id'] ?? null;

$logs = [];

if (!$projectId) {
    echo json_encode([
        'message' => 'Δεν δόθηκε ID.',
        'logs' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Διαγραφή από ProjectMeta πρώτα
if (mysqli_query($conn, "DELETE FROM ProjectMeta WHERE project_id = '$projectId'")) {
    $logs[] = "ProjectMeta: ✅ διαγράφηκε";
} else {
    $logs[] = "ProjectMeta: ❌ " . mysqli_error($conn);
}

// Μετά διαγραφή από Projects
if (mysqli_query($conn, "DELETE FROM Projects WHERE project_id = '$projectId'")) {
    $logs[] = "Projects: ✅ διαγράφηκε";
} else {
    $logs[] = "Projects: ❌ " . mysqli_error($conn);
}

echo json_encode([
    'message' => 'Η διαγραφή ολοκληρώθηκε.',
    'logs' => $logs
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

mysqli_close($conn);
