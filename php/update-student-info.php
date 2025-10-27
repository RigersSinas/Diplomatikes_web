<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/database-connection.php';

$id = intval($_POST['id'] ?? 0);
if ($id === 0) {
    echo json_encode(['success' => false, 'error' => 'Μη έγκυρο ID']);
    exit;
}

// Απόρριψη ελλιπών τιμών (προαιρετικά)
$fields = ['name', 'surname', 'student_number', 'street', 'number', 'city', 'postcode', 'father_name', 'landline_telephone', 'mobile_telephone', 'email'];
$data = [];
foreach ($fields as $field) {
    $data[$field] = mysqli_real_escape_string($conn, $_POST[$field] ?? '');
}

$query = "
UPDATE Students SET
  name = '{$data['name']}',
  surname = '{$data['surname']}',
  student_number = '{$data['student_number']}',
  street = '{$data['street']}',
  number = '{$data['number']}',
  city = '{$data['city']}',
  postcode = '{$data['postcode']}',
  father_name = '{$data['father_name']}',
  landline_telephone = '{$data['landline_telephone']}',
  mobile_telephone = '{$data['mobile_telephone']}',
  email = '{$data['email']}'
WHERE id = $id
";

$result = mysqli_query($conn, $query);
if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
}

mysqli_close($conn);
