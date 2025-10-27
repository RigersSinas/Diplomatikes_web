// /javascript/modal-create-topic.js

$(document).ready(function () {
    
    $(document).on('submit', '#createProjectForm', function (e) {
      
      e.preventDefault();
      
      const formData = new FormData(this);
      
      const professorName = localStorage.getItem("loggedInUser");
  
      const $createResponse = $('#createResponse');
  
      if (!professorName) {
        $createResponse
          .removeClass('alert-success')
          .addClass('alert-message alert-error')
          .text('Δεν βρέθηκε συνδεδεμένος χρήστης.')
          .fadeIn();
        setTimeout(() => $createResponse.fadeOut(), 4000);
        return;
      }
  
      formData.append('professorName', professorName);
  
      $.ajax({
        url: '../php/create-project.php',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          $createResponse
            .removeClass('alert-error')
            .addClass('alert-message alert-success')
            .text(response.message || 'Το θέμα καταχωρήθηκε επιτυχώς!')
            .fadeIn();
          loadProjectsTable();
          setTimeout(() => $createResponse.fadeOut(), 4000);
        },
        error: function () {
          $createResponse
            .removeClass('alert-success')
            .addClass('alert-message alert-error')
            .text('Σφάλμα κατά την υποβολή της φόρμας.')
            .fadeIn();
          setTimeout(() => $createResponse.fadeOut(), 4000);
        }
      });
    });
  });
  