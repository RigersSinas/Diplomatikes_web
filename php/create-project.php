<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$title         = mysqli_real_escape_string($conn, $_POST['title'] ?? '');
$summary       = mysqli_real_escape_string($conn, $_POST['summary'] ?? '');
$professorName = mysqli_real_escape_string($conn, $_POST['professorName'] ?? '');
$pdfPath       = 'NULL';

// === Ανέβασμα PDF (αν υπάρχει)

if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {
    
    $uploadDir = realpath(__DIR__ . '/../project-pdfs') . '/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $originalName = basename($_FILES['pdf']['name']);
    $safeName     = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $originalName);
    $finalName    = uniqid('pdf_', true) . '_' . $safeName;
    $destination  = $uploadDir . $finalName;

    if (move_uploaded_file($_FILES['pdf']['tmp_name'], $destination)) {
        $pdfPath = "'" . mysqli_real_escape_string($conn, 'project-pdfs/' . $finalName) . "'";
    } else {
        echo json_encode(["success" => false, "message" => "Σφάλμα κατά την αποθήκευση του PDF."]);
        exit();
    }
}

// === Βρες τον `supervisor_id` από το όνομα (ή μελλοντικά δώσε απευθείας το ID)

$getProfIdQuery = "SELECT id FROM Professors WHERE username = '$professorName'";

$profResult = mysqli_query($conn, $getProfIdQuery);

if (!$profResult || mysqli_num_rows($profResult) === 0) {

    echo json_encode(["success" => false, "message" => "Δεν βρέθηκε καθηγητής με username: $professorName"]);

    exit();
}

$professorId = (int) mysqli_fetch_assoc($profResult)['id'];

// === Δημιουργία project
$insertProjectQuery = "
    INSERT INTO Projects (title, supervisor_id)
    VALUES ('$title', $professorId)
";

if (!mysqli_query($conn, $insertProjectQuery)) {
    echo json_encode(["success" => false, "message" => "Σφάλμα κατά την εισαγωγή project: " . mysqli_error($conn)]);
    exit();
}

$projectId = mysqli_insert_id($conn);

// === Δημιουργία εγγραφής ProjectMeta

$insertMetaQuery = "
    INSERT INTO ProjectMeta (project_id, summary, attachment)
    VALUES ($projectId, '$summary', $pdfPath)
";

if (!mysqli_query($conn, $insertMetaQuery)) {
    echo json_encode(["success" => false, "message" => "Το Project καταχωρήθηκε, αλλά υπήρξε σφάλμα στο ProjectMeta: " . mysqli_error($conn)]);
    exit();
} 

// 6) Καταχώρηση στο ProjectLogs
 
$actorId = isset($_SESSION['userId']) ? (int)$_SESSION['userId'] : 'NULL';
mysqli_query($conn, "
    INSERT INTO ProjectLogs
      (project_ref, event, actor_id, details)
    VALUES
      ($projectId, 'project_created', $actorId, 'Νέο topic δημιουργήθηκε')
");

echo json_encode(["success" => true, "message" => "Το θέμα καταχωρήθηκε επιτυχώς."]);

mysqli_close($conn);
