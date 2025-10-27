<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

$query = isset($_GET['q']) ? trim($_GET['q']) : '';

$projectId = isset($_GET['project_id']) ? intval($_GET['project_id']) : 0;

if ($query === '') {
    echo json_encode(['error' => 'Το ερώτημα είναι κενό.']);
    exit;
}

$escapedQuery = mysqli_real_escape_string($conn, $query);

// Φίλτρο για αποκλεισμό καθηγητών που έχουν ήδη προσκληθεί
$exclude = $projectId > 0 ? 
   "AND id NOT IN (SELECT professor_invited FROM ProjectInvites WHERE project_ref = $projectId)" : 
   "";

$sql = "
SELECT id, name, surname, email
FROM Professors
WHERE (name LIKE '%$escapedQuery%' 
   OR surname LIKE '%$escapedQuery%' 
   OR email LIKE '%$escapedQuery%')
   $exclude
LIMIT 10;
";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(['error' => 'Σφάλμα βάσης δεδομένων.']);
    exit;
}

$professors = [];

while ($row = mysqli_fetch_assoc($result)) {
    $professors[] = $row;
}

echo json_encode($professors);
mysqli_close($conn);
?>
