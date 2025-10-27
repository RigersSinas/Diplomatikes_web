<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$deleted = [];

if (mysqli_query($conn, "DELETE FROM Students")) {
    $deleted[] = "Πίνακας Students: ✅ διαγράφηκε";
} else {
    $deleted[] = "Πίνακας Students: ❌ " . mysqli_error($conn);
}

if (mysqli_query($conn, "DELETE FROM Professors")) {
    $deleted[] = "Πίνακας Professors: ✅ διαγράφηκε";
} else {
    $deleted[] = "Πίνακας Professors: ❌ " . mysqli_error($conn);
}

echo json_encode([
    'message' => 'Η διαγραφή ολοκληρώθηκε.',
    'logs' => $deleted
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

mysqli_close($conn);
