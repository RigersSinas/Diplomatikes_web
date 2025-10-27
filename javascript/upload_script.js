$(document).ready(function () {

  /* ──────────────────────────────────────────────────────────────
   CLICK – Upload Δεδομένων (ΜΟΝΟ για secretary)
  ─────────────────────────────────────────────────────────────── */
  $(document).on('click', '.dashboard-btn[data-modal="upload-data"]', function () {

    $('#modalTitle').html('<h3>Bulk Upload Δεδομένων</h3>');

    $('#modalBody').html(`
      <div id="bulkUploader" style="display:flex;flex-direction:column;gap:14px">
        <input type="file" id="jsonFile" accept=".json">
        <div>
          <button id="uploadBtn"  class="mini-btn">Αποστολή</button>
          <button id="deleteBtn"  class="mini-btn danger">Διαγραφή Όλων</button>
        </div>
      <div id="response" class="response-box"></div>
      </div>
    `);

    $('#genericModal').fadeIn();
  });


  /* Delegated CLICK – Διαγραφή */

  $(document).on('click', '#deleteBtn', function () {

    if (!confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις όλα τα δεδομένα;')) return;

    $.ajax({
      url: '../php/delete-data.php',
      type: 'POST',
      success: function (data) {
        $('#response')
          .removeClass('error')
          .addClass('response-box success')
          .text(data.message || 'Επιτυχής μεταφόρτωση.')
          .fadeIn();
        
          loadProjectsTable();
      },

      error: function (xhr, status, error) {
        $('#response')
          .removeClass('success')
          .addClass('response-box error')
          .text('Σφάλμα: ' + xhr.responseText)
          .fadeIn();
      }
    });
  });



$(document).on('click', '#uploadBtn', function () {

  const fileInput = $('#jsonFile')[0];

  const file = fileInput.files[0];

  if (!file) {
    $('#response').text('Παρακαλώ επιλέξτε ένα αρχείο.');
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
   
    let jsonData;

    try {

      jsonData = JSON.parse(e.target.result);

    } catch (err) {
      $('#response').text('Το αρχείο δεν είναι έγκυρο JSON.');
      return;
    }

    $.ajax({
      
      url: '../php/upload-json-data.php',

      type: 'POST',

      data: JSON.stringify(jsonData),

      contentType: 'application/json',

      success: function (data) {
        $('#response')
          .removeClass('error')
          .addClass('response-box success')
          .text(data.message || 'Επιτυχής μεταφόρτωση.')
          .fadeIn();
          loadProjectsTable();
      },

      error: function (xhr, status, error) {
        $('#response')
          .removeClass('success')
          .addClass('response-box error')
          .text('Σφάλμα: ' + xhr.responseText)
          .fadeIn();
      }
    });
  };

  reader.readAsText(file);
});


});
