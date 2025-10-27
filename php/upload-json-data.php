<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

function makeUsername(string $first): string {
    return strtolower(preg_replace('/[^a-z]/i', '', $first));
}

$defaultPwd = '0000';

$payload = json_decode(file_get_contents('php://input'), true);

$logs = [];

/* ======= STUDENTS ======= */

if (!empty($payload['students'])) {

    foreach ($payload['students'] as $s) {

        $uid   = (int)$s['id'];
        
        $uname = makeUsername($s['name'], $s['surname'], $uid);

        $sql = sprintf(
            "INSERT INTO Students
             (id,name,surname,student_number,street,number,city,postcode,
              father_name,landline_telephone,mobile_telephone,email,username,password)
             VALUES
             ('%d','%s','%s','%s','%s','%s','%s','%s',
              '%s','%s','%s','%s','%s','%s')
             ON DUPLICATE KEY UPDATE
                name       = VALUES(name),
                surname    = VALUES(surname),
                username   = VALUES(username),
                password   = VALUES(password)",
            $uid,
            mysqli_real_escape_string($conn, $s['name']),
            mysqli_real_escape_string($conn, $s['surname']),
            mysqli_real_escape_string($conn, $s['student_number']),
            mysqli_real_escape_string($conn, $s['street']),
            mysqli_real_escape_string($conn, $s['number']),
            mysqli_real_escape_string($conn, $s['city']),
            mysqli_real_escape_string($conn, $s['postcode']),
            mysqli_real_escape_string($conn, $s['father_name']),
            mysqli_real_escape_string($conn, $s['landline_telephone']),
            mysqli_real_escape_string($conn, $s['mobile_telephone']),
            mysqli_real_escape_string($conn, $s['email']),
            $uname,
            $defaultPwd
        );

        if (mysqli_query($conn, $sql)) {
            $logs[] = "✔️ Student {$uname} processed.";
        } else {
            $logs[] = "❌ Error for student {$uname}: " . mysqli_error($conn);
        }
    }
}

/* ======= PROFESSORS ======= */

if (!empty($payload['professors'])) {
    foreach ($payload['professors'] as $p) {
        $uid   = (int)$p['id'];
        $uname = makeUsername($p['name'], $p['surname'], $uid);

        $sql = sprintf(
            "INSERT INTO Professors
             (id,name,surname,email,topic,landline,mobile,department,university,username,password)
             VALUES
             ('%d','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')
             ON DUPLICATE KEY UPDATE
                name     = VALUES(name),
                surname  = VALUES(surname),
                username = VALUES(username),
                password = VALUES(password)",
            $uid,
            mysqli_real_escape_string($conn, $p['name']),
            mysqli_real_escape_string($conn, $p['surname']),
            mysqli_real_escape_string($conn, $p['email']),
            mysqli_real_escape_string($conn, $p['topic']),
            mysqli_real_escape_string($conn, $p['landline']),
            mysqli_real_escape_string($conn, $p['mobile']),
            mysqli_real_escape_string($conn, $p['department']),
            mysqli_real_escape_string($conn, $p['university']),
            $uname,
            $defaultPwd
        );

        if (mysqli_query($conn, $sql)) {
            $logs[] = "✔️ Professor {$uname} processed.";
        } else {
            $logs[] = "❌ Error for professor {$uname}: " . mysqli_error($conn);
        }
    }
}

echo json_encode([
    'message' => 'Εισαγωγή / ενημέρωση ολοκληρώθηκε.',
    'default_password' => $defaultPwd,
    'logs' => $logs
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

mysqli_close($conn);
?>
