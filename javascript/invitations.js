$(document).ready(function () {
    $('.dashboard-btn[data-modal="view"]').click(function () {
      const professorId = localStorage.getItem('userId'); // Αν δεν έχεις localStorage, βάλε σταθερά
      $('#modalTitle').html('<h3>Οι Προσκλήσεις μου</h3>');
  
      $.ajax({
        url: '../php/list-my-invitations.php',
        type: 'GET',
        data: { professor_id: professorId },
        success: function (response) {
          const invites = typeof response === 'object' ? response : JSON.parse(response);
          if (!invites.length) {
            $('#modalBody').html('<p style="color: gray;">Δεν υπάρχουν προσκλήσεις.</p>');
            $('#genericModal').fadeIn();
            return;
          }
  
          let html = `
            <table class="project-table">
              <thead>
                <tr>
                  <th>Τίτλος</th>
                  <th>Φοιτητής</th>
                  <th>Ημ/νία</th>
                  <th>Κατάσταση</th>
                  <th>Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
          `;
  
          invites.forEach(invite => {
            html += `
              <tr data-invite-id="${invite.invite_id}">
                <td>${invite.title}</td>
                <td>${invite.student_name}</td>
                <td>${invite.sent_on}</td>
                <td>${invite.invite_status}</td>
                <td>
                  ${
                    invite.invite_status === 'pending'
                      ? `<button class="btn-accept">Αποδοχή</button>
                         <button class="btn-decline">Απόρριψη</button>`
                      : '—'
                  }
                </td>
              </tr>
            `;
          });
  
          html += '</tbody></table>';
          $('#modalBody').html(html);
          $('#genericModal').fadeIn();
        },
        error: function () {
          $('#modalBody').html('<p style="color: red;">Σφάλμα φόρτωσης προσκλήσεων.</p>');
          $('#genericModal').fadeIn();
        }
      });
    });
  
    // Ενέργειες: Αποδοχή / Απόρριψη
    $(document).on('click', '.btn-accept, .btn-decline', function () {
      const row = $(this).closest('tr');
      const inviteId = row.data('invite-id');
      const action = $(this).hasClass('btn-accept') ? 'accept' : 'decline';
  
      $.ajax({
        url: '../php/update-invite-status.php',
        type: 'POST',
        data: {
          invite_id: inviteId,
          action: action
        },
        success: function (res) {
          const result = typeof res === 'object' ? res : JSON.parse(res);
          if (result.success) {
            row.find('td:nth-child(4)').text(action === 'accept' ? 'accepted' : 'declined');
            row.find('td:nth-child(5)').html('—');
            loadProjectsTable();
          } else {
            alert(result.message);
          }
        },
        error: function () {
          alert('Σφάλμα αποθήκευσης.');
        }
      });
    });
  });
  