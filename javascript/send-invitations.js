$(document).ready(function () {

    $('.dashboard-btn[data-modal="invite"]').click(function () {

      const projectId = localStorage.getItem('currentProjectId');
  
      if (!projectId) {
        alert('Δεν βρέθηκε Project ID.');
        return;
      }
  
      $('#modalTitle').html('<h3>Αποστολή Πρόσκλησης</h3>');

      $('#modalBody').html(`
       
        <form id="inviteForm">
         
        <label for="professorSearch">Καθηγητής:</label>
          
          <input type="text" id="professorSearch" name="professor" placeholder="Πληκτρολόγησε όνομα ή email..." autocomplete="off">
         
          <input type="hidden" id="professorId" name="professor_id">
          
          <div id="autocompleteResults" style="border: 1px solid #ccc; max-height: 150px; overflow-y: auto; display: none;"></div>
          
          <button type="submit" class="pretty-submit-button">Αποστολή Πρόσκλησης</button>
          
          <div id="inviteMessage" class="alert-message" style="display:none;"></div>
         
          <div id="inviteTableContainer" style="margin-top: 25px;"></div>
        
          </form>
      `);
  
      $('#genericModal').fadeIn();
  
      // Autocomplete

      $('#professorSearch').on('input', function () {
        
        const query = $(this).val();
        
        if (query.length < 2) {
          $('#autocompleteResults').hide();
          return;
        }
  
        $.ajax({
          url: '../php/search-professors.php',
          type: 'GET',
          data: {
            q: query,
            project_id: projectId
          },
          success: function (data) {

            const results = Array.isArray(data) ? data : JSON.parse(data);
  
            if (!results.length) {
              $('#autocompleteResults').html('<div style="padding: 10px;">Δεν βρέθηκαν καθηγητές.</div>').show();
              return;
            }
  
            let html = '';
            results.forEach(prof => {
              html += `<div class="autocomplete-item" data-id="${prof.id}">${prof.name} ${prof.surname} (${prof.email})</div>`;
            });
  
            $('#autocompleteResults').html(html).show();
          },
          error: function () {
            $('#autocompleteResults').html('<div style="padding: 10px; color: red;">Σφάλμα αναζήτησης.</div>').show();
          }
        });
      });
  
      // Επιλογή καθηγητή
      $('#autocompleteResults').off('click').on('click', '.autocomplete-item', function () {
        
        const name = $(this).text();
        
        const id = $(this).data('id');
  
        $('#professorSearch').val(name);

        $('#professorId').val(id);

        $('#autocompleteResults').hide();

      });
  
      // Υποβολή πρόσκλησης

      $(document).off('submit').on('submit', '#inviteForm', function (e) {

        e.preventDefault();
        
        const profId = $('#professorId').val();
        
        const st = parseInt(localStorage.getItem("userId"));
      
        const projectId = localStorage.getItem('currentProjectId');

        console.log("project_id", projectId);
        
        console.log("professor_id", profId);

        if (!profId) {
          $('#inviteMessage')
            .removeClass('alert-success')
            .addClass('alert-message alert-error')
            .text('Επέλεξε καθηγητή.')
            .fadeIn();
          return;
        }
  
        $.ajax({
          url: '../php/send-invite.php',
          type: 'POST',
          data: {
            project_id :projectId,
            professor_id: profId,
            student_id: st
          },
          success: function (response) {
            
            const res = typeof response === 'object' ? response : JSON.parse(response);
  
            if (res.success) {
              $('#inviteMessage')
                .removeClass('alert-error')
                .addClass('alert-message alert-success')
                .text(res.message)
                .fadeIn();
            } else {
              $('#inviteMessage')
                .removeClass('alert-success')
                .addClass('alert-message alert-error')
                .text(res.message)
                .fadeIn();
            }
  
            // Ανανεώνει και τον πίνακα
            loadInviteTable(projectId);
          },
          error: function () {
            $('#inviteMessage')
              .removeClass('alert-success')
              .addClass('alert-message alert-error')
              .text('Σφάλμα αποστολής.')
              .fadeIn();
          }
        });
      });
  
      // Φόρτωση πίνακα αιτημάτων
      function loadInviteTable(projectId) {
        $.ajax({
          url: '../php/list-invites.php',
          type: 'GET',
          data: { project_id: projectId },
          success: function (response) {
            const invites = typeof response === 'object' ? response : JSON.parse(response);
            if (!invites.length) {
              $('#inviteTableContainer').html('<p style="color: gray;">Δεν υπάρχουν ακόμη προσκλήσεις.</p>');
              return;
            }
  
            let html = `
              <table class="project-table">
                <thead>
                  <tr>
                    <th>Ονοματεπώνυμο</th>
                    <th>Email</th>
                    <th>Κατάσταση</th>
                    <th>Ημ/νία</th>
                  </tr>
                </thead>
                <tbody>
            `;
  
            invites.forEach(item => {
              html += `
                <tr>
                  <td>${item.name} ${item.surname}</td>
                  <td>${item.email}</td>
                  <td>${item.invite_status}</td>
                  <td>${item.sent_on}</td>
                </tr>
              `;
            });
  
            html += '</tbody></table>';
            $('#inviteTableContainer').html(html);
          },
          error: function () {
            $('#inviteTableContainer').html('<p style="color: red;">Σφάλμα φόρτωσης προσκλήσεων.</p>');
          }
        });
      }
  
      // Αρχική φόρτωση πίνακα
      loadInviteTable(projectId);
    });
  });
  