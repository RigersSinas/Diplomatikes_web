// ../javascript/modal-project-invites.js

$(document).ready(function () {

  // open on click of the new button

  $(document).on('click', '.action-btn.invites', function () {

    const projectId = $(this).data('id');

    const modal      = $('#genericModal');

    const modalTitle = $('#modalTitle');

    const modalBody  = $('#modalBody');

    modalTitle.html('<h3>Προσκεκλημένοι καθηγητές</h3>');

    $.ajax({
      url: '../php/list-project-invites.php',
      type: 'GET',
      data: { project_id: projectId },
      success: function (res) {
        const invites = typeof res === 'object' ? res : JSON.parse(res);

        // κανείς ακόμη
        if (!invites.length) {
          modalBody.html('<p style="color: gray;">Δεν υπάρχουν προσκλήσεις.</p>');
          modal.fadeIn();
          return;
        }

        // χτίζουμε pinaka
        let html = `
           <table class="project-table">
             <thead>
               <tr>
                 <th>Καθηγητής</th>
                 <th>Ημ/νία Αποστολής</th>
                 <th>Ημ/νία Απάντησης</th>
                 <th>Κατάσταση</th>
               </tr>
             </thead><tbody>`;

        invites.forEach(inv => {
          const prof = `${inv.name} ${inv.surname}`;
              html += `
                <tr>
                  <td>${prof}</td>
                 <td>${inv.sent_on}</td>
                 <td>${inv.updated_on}</td>
                  <td>${colorStatus(inv.invite_status)}</td>
                </tr>`;
        });

        html += '</tbody></table>';
        modalBody.html(html);
        modal.fadeIn();
      },
      error: function () {
        modalBody.html('<p style="color:red;">Σφάλμα φόρτωσης προσκλήσεων.</p>');
        modal.fadeIn();
      }
    });
  });
});


function colorStatus(txt) {
  const cls = `status-${txt}`;     // accepted ➜ status-accepted
  return `<span class="${cls}">${txt}</span>`;
}
