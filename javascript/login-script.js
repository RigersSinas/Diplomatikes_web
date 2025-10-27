

$(document).ready(function () {

  $('#loginBtn').click(function () {

    const username = $('#username').val().trim();

    const password = $('#password').val().trim();

    /* 1. Απλός έλεγχος κενών πεδίων */

    if (!username || !password) {
      $('#response').text('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }

    /* 2. AJAX -> login-check.php */

    $.ajax({
      url: '../php/login-check.php',
      type: 'POST',
      data: { username, password },

      success: function (response) {

        if (response.status === 'success') {

          /* 2.1 Αποθήκευση στοιχείων στον localStorage */

          localStorage.setItem('loggedInUser', response.username);   // π.χ. «Γραμματεία»

          localStorage.setItem('userRole',     response.role);   // student / professor / secretary

          localStorage.setItem('userId',       response.id);     // π.χ. 0 ή 123

          /* 2.2 Ανακατεύθυνση ανάλογα με τον ρόλο */

          if (response.role === 'student') {

            window.location.href = 'student-page.html';

          } else if (response.role === 'professor' || response.role === 'secretary') {

            // γραμματεία και καθηγητής πάνε στην ίδια σελίδα
            
            window.location.href = 'professor-page.html';
          }

        } else {                   
          
          $('#response').text(response.message);
        }
      },

      error: function () {
        $('#response').text('Σφάλμα σύνδεσης με τον server.');
      }
    });

  });

});
