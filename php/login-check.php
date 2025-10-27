<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

$username = $_POST['username'] ?? '';

$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Λείπουν πεδία.'
    ]);
    exit;
}

// Έλεγχος στους πίνακες

$queryStudent = "SELECT id, name, username FROM Students WHERE username = ? AND password = ?";

$queryProf    = "SELECT id, name, username FROM Professors WHERE username = ? AND password = ?";

// Έλεγχος αν είναι φοιτητής

$stmt = mysqli_prepare($conn, $queryStudent);

mysqli_stmt_bind_param($stmt, "ss", $username, $password);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode([
        'status' => 'success',
        'role' => 'student',
        'id' => $row['id'],
        'name' => $row['name'],
        'username' => $row['username']
    ]);
    exit;
}

// Έλεγχος αν είναι καθηγητής

$stmt = mysqli_prepare($conn, $queryProf);

mysqli_stmt_bind_param($stmt, "ss", $username, $password);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode([
        'status' => 'success',
        'role' => 'professor',
        'id' => $row['id'],
        'name' => $row['name'],
        'username' => $row['username']
    ]);
    exit;
}


/* -----------------------------------------------------------
   Έλεγχος αν είναι γραμματεία (hard-coded credentials)
   ----------------------------------------------------------- */
if ($username === 'secretary' && $password === '0000') {
    echo json_encode([
        'status' => 'success',
        'role'   => 'secretary',
        'id'     => 0,                   // μπορείς να βάλεις ό,τι ID θες
        'name'   => 'Γραμματεία'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// Αν δεν βρέθηκε τίποτα
echo json_encode([
    'status' => 'error',
    'message' => 'Λανθασμένο όνομα χρήστη ή κωδικός.'
]);
