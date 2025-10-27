<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/database-connection.php';

$pid  = intval($_POST['projectId'] ?? 0);
$uid  = intval($_POST['userId']    ?? 0);
if(!$pid || !$uid){ echo json_encode(['success'=>false]); exit; }

/* 1)  Ποιος ρόλος είναι αυτός ο χρήστης; */
$r = mysqli_query($conn,
  "SELECT supervisor_id, reviewer_a AS r1, reviewer_b AS r2
   FROM Projects WHERE project_id=$pid LIMIT 1");

if(!$r || !mysqli_num_rows($r)){ echo json_encode(['success'=>false]); exit; }

$proj = mysqli_fetch_assoc($r);
if     ($uid == $proj['supervisor_id']) $prefix = 'sup_';
elseif ($uid == $proj['r1'])            $prefix = 'rev1_';
elseif ($uid == $proj['r2'])            $prefix = 'rev2_';
else  { echo json_encode(['success'=>false,'message'=>'No rights']); exit; }

/* 2)  επιτρεπόμενες στήλες (quality, duration, text, presentation) */
$cols = ['quality','duration','text','presentation'];
$set  = [];

foreach($cols as $c){
  $key = $prefix.$c;        // π.χ. sup_quality
  if(isset($_POST[$key]) && $_POST[$key] !== ''){
    $val = intval($_POST[$key]);
    $set[] = "$key = $val";
  }
}

if(!$set){
  echo json_encode(['success'=>false,'message'=>'No data']); exit;
}

/* 3)  UPDATE Scores */
$setSQL = implode(',',$set);
$q = "UPDATE Scores SET $setSQL WHERE project_ref = $pid";

if(!mysqli_query($conn,$q)){
  echo json_encode(['success'=>false,'message'=>mysqli_error($conn)]); exit;
}

/* 4)  (προαιρετικό) υπολόγισε final_mark αν όλα συμπληρωθούν */

// Υπολόγισε τον τελικό μέσο όρο
mysqli_query($conn, "
  UPDATE Scores SET final_mark = (
    (
      COALESCE(sup_quality,0) + COALESCE(sup_duration,0) + COALESCE(sup_text,0) + COALESCE(sup_presentation,0) +
      COALESCE(rev1_quality,0) + COALESCE(rev1_duration,0) + COALESCE(rev1_text,0) + COALESCE(rev1_presentation,0) +
      COALESCE(rev2_quality,0) + COALESCE(rev2_duration,0) + COALESCE(rev2_text,0) + COALESCE(rev2_presentation,0)
    ) / 12
  )
  WHERE project_ref = $pid
");

// Έλεγχος αν έχουν συμπληρωθεί ΟΛΑ τα πεδία
$check = mysqli_query($conn, "
  SELECT * FROM Scores
  WHERE project_ref = $pid AND
        sup_quality IS NOT NULL AND sup_duration IS NOT NULL AND
        sup_text IS NOT NULL AND sup_presentation IS NOT NULL AND
        rev1_quality IS NOT NULL AND rev1_duration IS NOT NULL AND
        rev1_text IS NOT NULL AND rev1_presentation IS NOT NULL AND
        rev2_quality IS NOT NULL AND rev2_duration IS NOT NULL AND
        rev2_text IS NOT NULL AND rev2_presentation IS NOT NULL
");

if ($check && mysqli_num_rows($check)) {
  // Αν είναι όλα συμπληρωμένα, άλλαξε το status του project
  mysqli_query($conn, "
    UPDATE Projects SET phase = 'marked' WHERE project_id = $pid
  ");
}

echo json_encode(['success' => true, 'message' => 'Βαθμοί αποθηκεύτηκαν.']);


