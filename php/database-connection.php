<?php
/*
 |  Database connection helper
 |  ---------------------------------
 |  Περιέχει μόνο τα στοιχεία σύνδεσης
 |  και επιστρέφει το $conn που θα
 |  χρησιμοποιούν τα υπόλοιπα scripts.
*/

$host     = 'localhost';
$database = 'Database';  
$user     = 'root';
$pass     = '';

$conn = mysqli_connect($host, $user, $pass, $database);

if (!$conn) {
    
    /* πετάμε JSON για να δούμε αν υπαρχει σφάλμα */
    
    die(json_encode(['message' => 'Connection failed: ' . mysqli_connect_error()]));
}

?>
