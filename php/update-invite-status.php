<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$inviteId = isset($_POST['invite_id']) ? intval($_POST['invite_id']) : 0;
$action = $_POST['action'] ?? '';

if ($inviteId === 0 || !in_array($action, ['accept', 'decline'])) {
    echo json_encode(['success' => false, 'message' => 'Μη έγκυρα δεδομένα.']);
    exit;
}

$newStatus = $action === 'accept' ? 'accepted' : 'rejected';

// Ενημέρωση της κατάστασης της πρόσκλησης
$update = mysqli_query($conn, "
    UPDATE ProjectInvites
    SET invite_status = '$newStatus'
    WHERE invite_id = $inviteId
");

if (!$update) {
    echo json_encode(['success' => false, 'message' => 'Σφάλμα αποθήκευσης.']);
    mysqli_close($conn);
    exit;
}

// Αν είναι αποδοχή, ορίζουμε reviewer
if ($action === 'accept') {
    $query = mysqli_query($conn, "
        SELECT project_ref, professor_invited 
        FROM ProjectInvites
        WHERE invite_id = $inviteId
    ");

    if ($row = mysqli_fetch_assoc($query)) {
        $projectId = intval($row['project_ref']);
        $professorId = intval($row['professor_invited']);

        // Έλεγχος reviewers
        $projectQuery = mysqli_query($conn, "
            SELECT reviewer_a, reviewer_b 
            FROM Projects 
            WHERE project_id = $projectId
        ");

        if ($project = mysqli_fetch_assoc($projectQuery)) {
            $reviewerA = $project['reviewer_a'];
            $reviewerB = $project['reviewer_b'];

            // Ανάθεση στο πρώτο διαθέσιμο πεδίο
            if (empty($reviewerA)) {
                mysqli_query($conn, "
                    UPDATE Projects 
                    SET reviewer_a = $professorId 
                    WHERE project_id = $projectId
                ");
            } elseif (empty($reviewerB)) {
                mysqli_query($conn, "
                    UPDATE Projects 
                    SET reviewer_b = $professorId 
                    WHERE project_id = $projectId
                ");
            }

            // Τελικός έλεγχος αν ΤΩΡΑ έχουν γεμίσει και τα δύο
            $finalCheck = mysqli_query($conn, "
                SELECT reviewer_a, reviewer_b 
                FROM Projects 
                WHERE project_id = $projectId
            ");

            if ($final = mysqli_fetch_assoc($finalCheck)) {
                if (!empty($final['reviewer_a']) && !empty($final['reviewer_b'])) {
                    // 1. Ενεργοποίηση project
                    mysqli_query($conn, "
                        UPDATE Projects 
                        SET phase = 'active' 
                        WHERE project_id = $projectId
                    ");

                    // 2. Ακύρωση υπολοίπων προσκλήσεων
                    mysqli_query($conn, "
                        UPDATE ProjectInvites 
                        SET invite_status = 'cancelled' 
                        WHERE project_ref = $projectId 
                          AND invite_status = 'pending'
                          AND invite_id != $inviteId
                    ");
                }
            }
        }
    }
}

echo json_encode(['success' => true, 'message' => 'Ενημερώθηκε με επιτυχία.']);
mysqli_close($conn);
?>
