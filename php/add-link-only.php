<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/database-connection.php';

/* --------------------------------------------------------------------
   1)  Παραλαβή & βασικός έλεγχος
-------------------------------------------------------------------- */
$projectId = intval($_POST['projectId'] ?? 0);
$urlRaw    = trim($_POST['link']      ?? '');

if ($projectId === 0 || $urlRaw === '') {
  echo json_encode([
    "success" => false,
    "message" => "Λείπουν δεδομένα (projectId ή link)."
  ]);
  exit;
}

/* --------------------------------------------------------------------
   2)  Ελαφρύ validation URL (προαιρετικό, regex)
-------------------------------------------------------------------- */
if (!preg_match('/^(https?:\/\/)[\w\-._~:\/?#[\]@!$&\'()*+,;=%]+$/i', $urlRaw)) {
  echo json_encode([
    "success" => false,
    "message" => "Μη έγκυρο URL."
  ]);
  exit;
}

/* --------------------------------------------------------------------
   3)  Ασφαλισμένο string προς αποθήκευση (XSS + SQL escape)
-------------------------------------------------------------------- */
$urlEsc = mysqli_real_escape_string(
            $conn,
            htmlspecialchars($urlRaw, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
          );

/* --------------------------------------------------------------------
   4)  Εισαγωγή στη ProjectLinks
-------------------------------------------------------------------- */
$sql = "
  INSERT INTO ProjectLinks (project_ref, url)
  VALUES ($projectId, '$urlEsc')
";

if (mysqli_query($conn, $sql)) {
  echo json_encode([
    "success" => true,
    "message" => "Το link προστέθηκε."
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Σφάλμα βάσης: " . mysqli_error($conn)
  ]);
}

mysqli_close($conn);
