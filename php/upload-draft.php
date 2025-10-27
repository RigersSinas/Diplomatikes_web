<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

/* === 1) Παραλαβή και έλεγχος πεδίων === */

$projectId = intval($_POST['projectId'] ?? 0);

$linksRaw  = trim($_POST['links'] ?? '');

if ($projectId === 0) {
    echo json_encode(["success" => false, "message" => "Δεν δόθηκε projectId."]);
    exit();
}

$draftPath = 'NULL'; // default — δεν δόθηκε προσχέδιο

/* === 2) Ανέβασμα αρχείου προσχεδίου (αν υπάρχει) === */

if (isset($_FILES['draftFile']) && $_FILES['draftFile']['error'] === UPLOAD_ERR_OK) {

    $uploadDir = realpath(__DIR__ . '/../project-pdfs') . '/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $originalName = basename($_FILES['draftFile']['name']);

    $safeName     = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $originalName);

    $finalName    = uniqid('draft_', true) . '_' . $safeName;

    $destination  = $uploadDir . $finalName;

    if (move_uploaded_file($_FILES['draftFile']['tmp_name'], $destination)) {

        $draftPath = "'" . mysqli_real_escape_string($conn, 'project-pdfs/' . $finalName) . "'";

    } else {
        echo json_encode(["success" => false, "message" => "Σφάλμα κατά την αποθήκευση του προσχεδίου."]);

        exit();
    }
}

/* === 3) Επεξεργασία των links === */

$resourcesDB = 'NULL';

if ($linksRaw !== '') {
    $linksArr    = array_filter(array_map('trim', explode("\n", $linksRaw)));
    $escaped     = array_map('htmlspecialchars', $linksArr);
    $joined      = implode('|', $escaped);
    $resourcesDB = "'" . mysqli_real_escape_string($conn, $joined) . "'";
}

/* === 4) Ενημέρωση ή εισαγωγή στο ProjectMeta === */

$exists = mysqli_query($conn, "SELECT meta_id FROM ProjectMeta WHERE project_id = $projectId");

if ($exists && mysqli_num_rows($exists)) {

    $update = "
        UPDATE ProjectMeta
        SET draft_attachment = $draftPath,
            resources        = $resourcesDB
        WHERE project_id = $projectId
    ";
    if (!mysqli_query($conn, $update)) {
        echo json_encode(["success" => false, "message" => "Σφάλμα ενημέρωσης: " . mysqli_error($conn)]);
        exit();
    }
} else {
    $insert = "
        INSERT INTO ProjectMeta (project_id, draft_attachment, resources)
        VALUES ($projectId, $draftPath, $resourcesDB)
    ";
    if (!mysqli_query($conn, $insert)) {
        echo json_encode(["success" => false, "message" => "Σφάλμα εισαγωγής: " . mysqli_error($conn)]);
        exit();
    }
}

/* === 5) Επιτυχία === */

echo json_encode(["success" => true, "message" => "Η ενημέρωση καταχωρήθηκε."]);

mysqli_close($conn);
