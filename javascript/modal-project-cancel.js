
$(document).on('click', '.action-btn.cancel', function () {

  const projectId = $(this).data('id');

  const modal      = $('#genericModal');

  const modalTitle = $('#modalTitle');

  const modalBody  = $('#modalBody');

  const userId = localStorage.getItem("userId");


  modalTitle.html('<h3>Ακύρωση Διπλωματικής</h3>');

  modalBody.html(cancelForm(projectId));

  modal.fadeIn();

  console.log(projectId);

  modal.on('submit', '#cancelForm', function (e) {

    e.preventDefault();

    const gaNum  = $('#gaNum').val().trim();

    const gaYear = $('#gaYear').val().trim();

    $.post('../php/cancel-project.php',

      { project_id: projectId, ga_num: gaNum, ga_year: gaYear, id: userId},

      function (res) {
        
        const out = typeof res === 'object' ? res : JSON.parse(res);
        if (out.success) {
          modal.fadeOut();
          loadProjectsTable();          // refresh
        } else {
          alert(out.message);
        }
      }).fail(() => alert('Σφάλμα αποθήκευσης.'));
  });
});

function cancelForm(projectId) {
  return `
    <form id="cancelForm">
      <label>Αριθμός ΓΑ</label>
      <input type="number" id="gaNum" required />
      <label>Έτος ΓΑ</label>
      <input type="number" id="gaYear" value="${new Date().getFullYear()}" required />
      <button type="submit">Ακύρωση</button>
    </form>`;
}

