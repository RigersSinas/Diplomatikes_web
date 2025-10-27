<?php

header('Content-Type: application/json');

require_once __DIR__ . '/database-connection.php';

$projectId = (int)$_POST['project_id'];

$title = mysqli_real_escape_string($conn, $_POST['title'] ?? '');

$summary = mysqli_real_escape_string($conn, $_POST['summary'] ?? '');

$studentId = isset($_POST['student_id']) && is_numeric($_POST['student_id']) ? (int)$_POST['student_id'] : null;

$uploadDir = '/../uploads';

/*$attachment = null;

if (!empty($_FILES['update']['name'])) {
  $filename = basename($_FILES['update']['name']);
  $targetPath = $uploadDir . uniqid() . "_" . $filename;
  if (move_uploaded_file($_FILES['update']['tmp_name'], $targetPath)) {
    $attachment = $targetPath;
  }
}
*/

$attachment = null;

if (isset($_FILES['update']) && $_FILES['update']['error'] === UPLOAD_ERR_OK) {
    
    // Σωστή διαδρομή στο φάκελο "uploads"
    $uploadDir = realpath(__DIR__ . '/../uploads') . '/';

    // Αν δεν υπάρχει ο φάκελος, τον δημιουργούμε
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Καθαρίζουμε το όνομα του αρχείου
    $originalName = basename($_FILES['update']['name']);
    $safeName     = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $originalName);

    // Τελικό μοναδικό όνομα
    $finalName    = uniqid('uploads_', true) . '_' . $safeName;
    $destination  = $uploadDir . $finalName;

    // Μεταφορά αρχείου
    if (move_uploaded_file($_FILES['update']['tmp_name'], $destination)) {
        // Το path για αποθήκευση στη βάση (escaped + με ' ')
        $attachment = "'" . mysqli_real_escape_string($conn, 'uploads/' . $finalName) . "'";
    } else {
        echo json_encode(["success" => false, "message" => "Σφάλμα κατά την αποθήκευση του αρχείου."]);
        exit;
    }
}


$queries = [];

// Ενημέρωση τίτλου
$queries[] = "UPDATE Projects SET title = '$title' WHERE project_id = $projectId";

// Ενημέρωση περιλήψεως & αρχείου

$updateMeta = "UPDATE ProjectMeta SET summary = '$summary'";

if ($attachment) $updateMeta .= ", attachment = '$attachment'";

$updateMeta .= " WHERE project_id = $projectId";

$queries[] = $updateMeta;

// Αν έχει επιλεγεί φοιτητής, τον προσθέτουμε και αλλάζουμε τη φάση
if ($studentId) {
    $queries[] = "UPDATE Projects SET student_id = $studentId, phase = 'submitted' WHERE project_id = $projectId";
  }
  

$success = true;
foreach ($queries as $sql) {
  if (!mysqli_query($conn, $sql)) {
    $success = false;
    break;
  }
}

echo json_encode([
  'success' => $success,
  'message' => $success ? 'Επιτυχής ενημέρωση.' : 'Σφάλμα: ' . mysqli_error($conn)
]);

mysqli_close($conn);
