$(document).ready(() => {

  let projectId = null;

  // Άνοιγμα modal για draft upload

  $('.dashboard-btn[data-modal="upload"]').on('click', () => {

    projectId = localStorage.getItem('currentProjectId');

    if (!projectId) return alert('Δεν βρέθηκε project.');

    $('#modalTitle').html('<h3>Ανάρτηση Προσχέδιου</h3>');

    $('#modalBody').html(renderDraftForm(projectId));

    $('#genericModal').fadeIn();

  });


  // Άνοιγμα modal μόνο για προσθήκη συνδέσμου

  $('.dashboard-btn[data-modal="add-link"]').on('click', () => {

    projectId = localStorage.getItem('currentProjectId');

    if (!projectId) return alert('Δεν βρέθηκε project.');

    $('#modalTitle').html('<h3>Προσθήκη Συνδέσμου</h3>');

    $('#modalBody').html(`

      <div class="link-only-form">

        <input type="hidden" id="projectIdHidden" value="${projectId}">

        ${renderLinkInput()}

      </div>

    `);
    $('#genericModal').fadeIn();

  });


  // Υποβολή ολόκληρης φόρμας

  $(document).on('submit', '#draftForm', function (e) {

    e.preventDefault();

    const fd = new FormData(this);

    $.ajax({
      url: '../php/upload-draft.php',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,

      success: res => {

        const out = typeof res === 'object' ? res : JSON.parse(res);

        alert(out.message || (out.success ? 'OK' : 'Σφάλμα'));

        loadStudentProject();

      },
      error: () => alert('Σφάλμα αποστολής.')
      
    });
  });


  $(document).on('click', '#addLinkBtn', function () {

  const link = $('#singleLink').val().trim();

  const projectId = $('#projectIdHidden').val() || localStorage.getItem('currentProjectId');

  const urlPattern = /^(https?:\/\/)[\w\-._~:/?#[@\]!$&'()*+,;=]+$/i;

  if (!urlPattern.test(link)) {
    alert('Το link δεν είναι έγκυρο.');
    return;
  }

  const fd = new FormData();

  fd.append('projectId', projectId);

  fd.append('link', link);

  $.ajax({
    url: '../php/add-link-only.php',
    type: 'POST',
    data: fd,
    processData: false,
    contentType: false,
    success: res => {

      const out = typeof res === 'object' ? res : JSON.parse(res);

      alert(out.message || (out.success ? 'OK' : 'Σφάλμα'));

      if (out.success) { loadStudentProject(); }

    },

    error: () => {
      alert('Σφάλμα αποστολής link.');
    }
  });
});


  function renderDraftForm(projectId) {
    return `
      <form id="draftForm" enctype="multipart/form-data">
      
        <input type="hidden" name="projectId" value="${projectId}">

        <label>Αρχείο προσχέδιου (προαιρετικό):</label>
        <input type="file" name="draftFile" accept=".pdf,.zip,.doc,.docx">
        <button type="submit">Μεταφόρτωση Προσχέδιου</button>
      </form>
    `;
  }


  //  Render μόνο πεδίου προσθήκης συνδέσμου

  function renderLinkInput() {
    return `
      <input type="text" id="singleLink" placeholder="https://..." style="width: 100%; margin-bottom: 8px;">
      <button type="button" id="addLinkBtn">Προσθήκη Συνδέσμου</button>
    `;
  }

});


$(document).ready(() => {

  /* 0) τιμή phase από το κελί #project_phase (μικρά γράμματα)  */
  const getPhase = () => ($('#project_phase').text() || '').trim().toLowerCase();

  /* 1)  CLICK στο κουμπί προγραμματισμού */
  $('.dashboard-btn[data-modal="schedule-assessment"]').on('click', () => {

    if (getPhase() == 'exam_scheduled') {
      alert('Η εξέταση έχει ήδη προγραμματιστεί.');
      return;
    }

    if (getPhase() !== 'in_review') {
      alert('Προγραμματισμός επιτρέπεται μόνο όταν το project είναι σε φάση “in_review”.');
      return;
    }

    const projectId = localStorage.getItem('currentProjectId');

    if (!projectId) return alert('Δεν βρέθηκε project.');

    $('#modalTitle').html('<h3>Προγραμματισμός Εξέτασης</h3>');

    $('#modalBody').html(renderAssessmentForm(projectId));

    $('#genericModal').fadeIn();

  });


  /* 2)  υποβολή φόρμας schedule */

  $(document).on('submit', '#assessmentForm', function (e) {

    e.preventDefault();

    const fd = new FormData(this);

    /* μικρός έλεγχος: αν mode = onsite πρέπει να δοθεί room κ.λπ. */

    const mode = fd.get('mode');

    if (mode === 'onsite' && !fd.get('room').trim()) {

      return alert('Συμπλήρωσε την αίθουσα.');

    }
    if (mode === 'remote' && !fd.get('meeting_url').trim()) {

      return alert('Συμπλήρωσε τον σύνδεσμο.');

    }


    $.ajax({

      url: '../php/schedule-assessment.php',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      success: res => {

        const out = typeof res === 'object' ? res : JSON.parse(res);

        alert(out.message || (out.success ? 'OK' : 'Σφάλμα'));

        if (out.success) {

          $('#genericModal').fadeOut();

          if (typeof loadStudentProject === 'function') loadStudentProject(); // refresh πίνακα

        }
      },

      error: () => alert('Σφάλμα αποστολής.')
    });
  });

  /* 3) helper: φόρμα HTML */

 function renderAssessmentForm(pid){

  // σήμερα σε ISO-format YYYY-MM-DD

  const today = new Date().toISOString().split('T')[0];

  return `
  <form id="assessmentForm">
    <input type="hidden" name="projectId" value="${pid}">

    <label>Ημερομηνία εξέτασης:</label>
    <input type="date" name="sched_date"
           min="${today}" required>

    <label>Ώρα εξέτασης (10:00-17:00):</label>
    <input type="time" name="sched_time"
           min="10:00" max="17:00" step="900" required>
           <!-- step 900 = 15′· άλλαξέ το σε 3600 για 1 h -->

    <label>Τρόπος εξέτασης:</label>
    <select name="mode" id="examMode">
      <option value="onsite">Δια ζώσης</option>
      <option value="remote">Διαδικτυακά</option>
    </select>

    <div id="onsiteFields">
      <label>Αίθουσα:</label>
      <input type="text" name="room" placeholder="π.χ. Αίθουσα 1.2">
    </div>

    <div id="remoteFields" style="display:none;">
      <label>Σύνδεσμος Meeting:</label>
      <input type="url" name="meeting_url" placeholder="https://...">
    </div>

    <label>Τίτλος ανακοίνωσης (προαιρετικό):</label>
    <input type="text" name="notice_title">

    <label>Κείμενο ανακοίνωσης (προαιρετικό):</label>
    <textarea name="notice_body" rows="4"></textarea>

    <button type="submit" style="margin-top:18px;">Αποθήκευση</button>
  </form>

  <script>
    // on-site / remote toggle
    document.getElementById('examMode').addEventListener('change', e=>{
      const remote = e.target.value === 'remote';
      document.getElementById('remoteFields').style.display = remote ? 'block' : 'none';
      document.getElementById('onsiteFields').style.display  = remote ? 'none'  : 'block';
    });
  <\/script>`;
}

});
