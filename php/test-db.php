<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

echo json_encode(['message' => '✅ Επιτυχής σύνδεση με τη βάση!']);
?>
