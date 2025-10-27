<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$studentId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($studentId === 0) {
    echo json_encode(['error' => 'Μη έγκυρο ID φοιτητή']);
    exit;
}

$query = "
SELECT 
  id,
  username,
  name,
  surname,
  student_number,
  street,
  number,
  city,
  postcode,
  father_name,
  landline_telephone,
  mobile_telephone,
  email
FROM Students
WHERE id = $studentId
LIMIT 1;
";

$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(['error' => 'Ο φοιτητής δεν βρέθηκε']);
    exit;
}

$student = mysqli_fetch_assoc($result);
echo json_encode($student);

mysqli_close($conn);
