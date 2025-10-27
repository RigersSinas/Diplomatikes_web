$(document).on('click', '.action-btn.edit', function () {
    
  const projectId = $(this).data('id');
  
    $.ajax({

      url: '../php/get-project-details.php',
      type: 'POST',
      data: { project_id: projectId },
      success: function (response) {
        if (response.success) {
          
          const p = response.data;
  
          $('#modalTitle').html('<h3>Επεξεργασία Θέματος</h3>');

          $(`#modalBody`).html(`
            <form id="editProjectForm" enctype="multipart/form-data">
              <input type="hidden" name="project_id" value="${p.project_id}">
          
              <label for="title">Τίτλος:</label>
              <input type="text" id="editTitle" name="title" value="${p.title}" required>
          
              <label for="summary">Σύνοψη:</label>
              <textarea id="editSummary" name="summary" required>${p.summary}</textarea>
          
              <label for="pdf">Αρχείο PDF (ανεβάστε νέο για αλλαγή):</label>
              <input type="file" id="editPdf" name="pdf" accept="application/pdf">
          
              ${
                p.student_id
                  ? `<div class="student-box">
                      <p><strong>Φοιτητής:</strong> ${p.student_name} ${p.student_surname} (${p.student_number})</p>
                      <button type="button" class="remove-student-btn" data-id="${p.project_id}">Αφαίρεση Φοιτητή</button>
                    </div>`
                  : `
                    <label for="studentSearch">Αντιστοίχιση Φοιτητή:</label>
                    <input type="text" id="studentSearch" placeholder="Αναζήτηση με ΑΜ, όνομα ή επώνυμο...">
                    <input type="hidden" name="student_id" id="selectedStudentId">
                    <div id="studentSearchResults" class="autocomplete-results"></div>
                  `
              }
          
              <button type="submit">Αποθήκευση Αλλαγών</button>
              <div id="editResponse" class="alert-message" style="display:none;"></div>
            </form>
          `);
          
          $('#genericModal').fadeIn();
        } else {
          alert('Σφάλμα φόρτωσης στοιχείων: ' + response.message);
        }
      },
      error: function () {
        alert('Αποτυχία σύνδεσης με τον server.');
      }
    });

  });

  
  $(document).on('submit', '#editProjectForm', function (e) {
    
    e.preventDefault();
  
    const formData = new FormData(this);
   
    const $responseBox = $('#editResponse');
  
    $.ajax({
      url: '../php/update-project.php',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        $responseBox
          .removeClass('alert-error')
          .addClass('alert-message alert-success')
          .text(response.message || 'Η ενημέρωση ολοκληρώθηκε!')
          .fadeIn();
  
        loadProjectsTable();
      },
      error: function () {
        $responseBox
          .removeClass('alert-success')
          .addClass('alert-message alert-error')
          .text('Σφάλμα κατά την ενημέρωση.')
          .fadeIn();
      }
    });
  });


  $(document).on('click', '.remove-student-btn', function () {
    
    const projectId = $(this).data('id');
  
    if (!confirm('Είσαι σίγουρος ότι θέλεις να αφαιρέσεις τον φοιτητή;')) return;
  
    $.ajax({
      url: '../php/remove-student-from-project.php',
      type: 'POST',
      data: { project_id: projectId },
      success: function (res) {
        if (res.success) {
  
          alert('Ο φοιτητής αφαιρέθηκε.');
          loadProjectsTable();
          $('#genericModal').fadeOut(); // κλείνει για επαναφόρτωση

        } else {
          alert('Αποτυχία: ' + res.message);
        }
      },
      error: function () {
        alert('Σφάλμα σύνδεσης με τον server.');
      }
    });
  });
  

  $(document).on('input', '#studentSearch', function () {
    
    const term = $(this).val().trim();
    
    const resultsBoxId = 'studentSearchResults';
  
    // Αν δεν υπάρχει ακόμα το container, το προσθέτουμε (πρώτη φορά)

    if (!$('#' + resultsBoxId).length) {
      $('<div>', {
        id: resultsBoxId,
        class: 'autocomplete-results'
      }).insertAfter('#studentSearch');
    }
  
    const resultsBox = $('#' + resultsBoxId);

    resultsBox.empty();
  
    if (term.length < 2) {

      resultsBox.hide();

      return;

    }


    $.get('../php/search-students.php', { term }, function (data) {
      resultsBox.empty();
  
      if (!data.length) {
        resultsBox.append('<div class="autocomplete-item no-result">Δεν βρέθηκαν αποτελέσματα</div>');
      } else {
        data.forEach(student => {
          const item = $('<div>')
            .addClass('autocomplete-item')
            .text(student.label)
            .data('id', student.id)
            .on('click', function () {
              $('#studentSearch').val(student.label);
              $('#selectedStudentId').val(student.id);
              resultsBox.empty().hide(); // Απόκρυψη όταν επιλέξει
            });
  
          resultsBox.append(item);
        });
      }
  
      resultsBox.show();
    });
  });
  
  