<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

$projectId = isset($_POST['project_id']) ? intval($_POST['project_id']) : 0;

$professorId = isset($_POST['professor_id']) ? intval($_POST['professor_id']) : 0;

$student = isset($_POST['student_id']) ? intval($_POST['student_id']) : 0;

if ($projectId === 0 || $professorId === 0 || $student === 0) {
    echo json_encode(['success' => false, 'message' => 'Λείπουν απαραίτητα δεδομένα.']);
    exit;
}

$check = mysqli_query($conn, "
    SELECT phase, supervisor_id
    FROM Projects
    WHERE project_id = $projectId AND student_id = $student
");

if (!$check || mysqli_num_rows($check) === 0) {
    echo json_encode(['success' => false, 'message' => 'Δεν συμμετέχεις σε αυτή τη διπλωματική ή δεν υπάρχει.']);
    exit;
}

$row = mysqli_fetch_assoc($check);

if ($row['phase'] !== 'submitted') {
    echo json_encode(['success' => false, 'message' => 'Η διπλωματική πρέπει να είναι σε στάδιο Submitted.']);
    exit;
}


// Έλεγχος αν προσκαλεί τον ίδιο τον επιβλέποντα
if ($row['supervisor_id'] == $professorId) {
    echo json_encode(['success' => false, 'message' => 'Ο καθηγητής αυτός είναι ήδη επιβλέπων.']);
    exit;
}

// Έλεγχος αν υπάρχει ήδη πρόσκληση
$check = mysqli_query($conn, "
    SELECT 1 FROM ProjectInvites 
    WHERE project_ref = $projectId AND professor_invited = $professorId
");

if (mysqli_num_rows($check) > 0) {
    echo json_encode(['success' => false, 'message' => 'Ο καθηγητής έχει ήδη προσκληθεί.']);
    exit;
}

// Εισαγωγή πρόσκλησης
$insert = mysqli_query($conn, "
    INSERT INTO ProjectInvites (project_ref, professor_invited, invite_status)
    VALUES ($projectId, $professorId, 'pending')
");

if ($insert) {
    echo json_encode(['success' => true, 'message' => 'Η πρόσκληση εστάλη με επιτυχία.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Απέτυχε η αποστολή πρόσκλησης.']);
}

mysqli_close($conn);
?>
