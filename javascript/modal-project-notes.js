// ../javascript/modal-project-notes.js

$(document).ready(function () {

  // άνοιγμα modal όταν πατηθεί το κουμπί notes

  $(document).on('click', '.action-btn.notes', function () {

    const projectId  = $(this).data('id');

    const authorId   = localStorage.getItem('userId');

    const modal      = $('#genericModal');

    const modalTitle = $('#modalTitle');

    const modalBody  = $('#modalBody');

    modalTitle.html('<h3>Σημειώσεις Διδάσκοντα</h3>');

    modalBody.html(renderSkeleton());  // αρχικό markup

    modal.fadeIn();

    loadNotes();                       // φόρτωση υπαρχόντων

    // ---------- Helpers ---------- //

    function renderSkeleton () {
      return `

        <form id="noteForm" style="margin-bottom:12px;">
        
          <textarea id="noteBody" rows="3" maxlength="300"
                    placeholder="Νέα σημείωση (έως 300 χαρακτήρες)"></textarea>

          <div class="notes-form-bar">
            <span id="charCount">0 / 300</span>
            <button type="submit">Καταχώρηση</button>
          </div>

        </form>

        <div id="notesTableWrap">
        </div>`;
    }

    function loadNotes () {

      $.get('../php/list-project-notes.php',

            { project_id: projectId, author_id: authorId },

            function (res) {

        const notes = typeof res === 'object' ? res : JSON.parse(res);

        $('#notesTableWrap').html(renderTable(notes));

      });

    }

    function renderTable (notes) {

      if (!notes.length) {

        return '<p style="color:gray;">Δεν υπάρχουν σημειώσεις.</p>';
      }

      let html = `<table class="project-table">
                    <thead><tr>
                      <th>Ημ/νία</th>
                      <th>Κείμενο</th>
                    </tr></thead><tbody>`;

      notes.forEach(n => {
        html += `<tr>
                   <td>${n.noted_on}</td>
                   <td>${escapeHtml(n.body)}</td>
                 </tr>`;
      });

      return html + '</tbody></table>';
    }


    // live char counter

    modal.on('input', '#noteBody', function () {

      $('#charCount').text(`${this.value.length} / 300`);

    });


    // submit νέα σημείωση

    modal.on('submit', '#noteForm', function (e) {

      e.preventDefault();

      const body = $('#noteBody').val().trim();

      if (!body) return;

      $.post('../php/add-project-note.php',

             { project_id: projectId, author_id: authorId, body: body },

      function (res) {

        const out = typeof res === 'object' ? res : JSON.parse(res);

        if (out.success) {

          $('#noteBody').val('');

          $('#charCount').text('0 / 300');

          loadNotes();                // refresh table
          
        } else {
          alert(out.message);
        }
      }).fail(() => alert('Σφάλμα αποθήκευσης.'));
    });

    // XSS guard
    function escapeHtml (txt) {
      return $('<div>').text(txt).html();
    }



  });
});
