$(document).ready(function () {

  const username = localStorage.getItem('loggedInUser');
  const role     = localStorage.getItem('userRole');   // "professor" ή "secretary"
  const userId   = localStorage.getItem('userId');

  /* ➜ έλεγχος πρόσβασης */
  if (!username || (role !== 'professor' && role !== 'secretary')) {
    window.location.href = '../pages/login-page.html';
    return;
  }

  console.log('Ο χρήστης συνδέθηκε:', {
    όνομα : username,
    ρόλος : role,
    id    : userId
  });
  // Κάλεσέ την μόλις φορτώσει η σελίδα

  const heading = $('#profDashboardTitle');        // θα βάλουμε id στο <h2>

  if (role === 'secretary') {
    heading.text('Πίνακας Ελέγχου Γραμματείας');
  } else {
    heading.text('Πίνακας Ελέγχου Καθηγητή');
  }

  /* αν ο ρόλος είναι γραμματεία, κρύψε φίλτρα + export + extra κουμπιά */
  if (role === 'secretary') {
    
    $('#professorName').text(role);

    $('#profFilters').css('display','none');     // φίλτρα Phase / Role
    
    $('#profExport').css('display','none');      // μπάρα εξαγωγής CSV/JSON

    /* 2.2  Κρύψε τα «καθηγητικά» κουμπιά */

    $('#profExtraBtns')
      .find('[data-modal="create"],[data-modal="view"],[data-modal="stats"]')
      .hide();

    $('#profExtraBtns .secret-only').show();
  }

  if (role === 'professor') {
  $('#profExtraBtns .secret-only').hide();
  $('#professorName').text(username);

  }

  loadProjectsTable();

    $('#filterPhase, #filterRole').on('change', function () {
      loadProjectsTable();
    });


  $('#logoutBtn').click(function () {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    console.log("Ο καθηγητής αποσυνδέθηκε.");
    window.location.href = '../pages/login-page.html';
  });


  // Χειρισμός κουμπιών dashboard
  const modal = $('#genericModal');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');

  $('.dashboard-btn').on('click', function () {

    const action = $(this).data('modal');

    modalTitle.empty();

    modalBody.empty();

    $('#createResponse').empty();

    if (action === 'create') {

      modalTitle.html('<h3>Δημιουργία Θέματος</h3>');

      modalBody.html(`
        <form id="createProjectForm" enctype="multipart/form-data">
          <label for="title">Τίτλος:</label>
          <input type="text" id="title" name="title" required>

          <label for="summary">Σύνοψη:</label>
          <textarea id="summary" name="summary" required></textarea>

          <label for="pdf">Αρχείο PDF:</label>
          <input type="file" id="pdf" name="pdf" accept="application/pdf">

          <button type="submit">Καταχώρηση</button>
        </form>
      `);
    } 

  else if (action === 'stats') {

  modalTitle.html('<h3>Στατιστικά</h3>');

  $('#genericModal').fadeIn();

  const profId = localStorage.getItem('userId');

  $.getJSON('../php/get-stats.php', { professorId: profId })

    .done(data => {

      if (!data.success) {
        modalBody.html(`<p class="alert-error">Σφάλμα: ${data.message}</p>`);
        return;
      }

      // Παίρνουμε τιμές με fallback στο 0
      const supDays = data.supervised_avg_days  !== null ? data.supervised_avg_days  : 0;

      const revDays = data.reviewed_avg_days    !== null ? data.reviewed_avg_days    : 0;

      const supMark = data.supervised_avg_mark  !== null ? data.supervised_avg_mark  : 0;

      const revMark = data.reviewed_avg_mark    !== null ? data.reviewed_avg_mark    : 0;

      const supCnt  = data.supervised_count     || 0;
      
      const revCnt  = data.reviewed_count       || 0;

      // 1) Εμφάνιση πίνακα
      modalBody.html(`
        <table class="details-table" style="margin:0 auto 24px; text-align:center;">
          <thead>
            <tr>
              <th>Κατηγορία</th>
              <th>Μέσος χρόνος (ημέρες)</th>
              <th>Μέσος βαθμός</th>
              <th>Πλήθος</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ως Επιβλέπων</td>
              <td>${supDays}</td>
              <td>${supMark}</td>
              <td>${supCnt}</td>
            </tr>
            <tr>
              <td>Ως Μέλος Επιτροπής</td>
              <td>${revDays}</td>
              <td>${revMark}</td>
              <td>${revCnt}</td>
            </tr>
          </tbody>
        </table>

        <div class="stats-charts" style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin-bottom:24px;">
          <div class="chart-container" style="width:280px;height:280px;"><canvas id="chartDays"></canvas></div>
          <div class="chart-container" style="width:280px;height:280px;"><canvas id="chartMarks"></canvas></div>
          <div class="chart-container" style="width:280px;height:280px;"><canvas id="chartCounts"></canvas></div>
        </div>
      `);

      
      setTimeout(() => {

        // α) Μ. χρόνος ολοκλήρωσης (bar)

        new Chart($('#chartDays'), {

          type: 'bar',

          data: {

            labels: ['Επιβλέπων', 'Μέλος Επιτροπής'],

            datasets: [{
              label: 'Μ. χρόνος (ημέρες)',
              data: [supDays, revDays],
              backgroundColor: ['#005ABA66','#FFA50066'],
              borderColor:   ['#005ABA','#FFA500'],
              borderWidth: 1
            }]
          },

          options: {
            maintainAspectRatio: false,
            scales: { y: { beginAtZero:true } },
            plugins: { legend:{ display:true } }
          }
        });


        // β) Μ. βαθμός (bar)

        new Chart($('#chartMarks'), {
          type: 'bar',
          data: {
            labels: ['Επιβλέπων', 'Μέλος Επιτροπής'],
            datasets: [{
              label: 'Μ. βαθμός (/10)',
              data: [supMark, revMark],
              backgroundColor: ['#28A74566','#17A2B866'],
              borderColor:   ['#28A745','#17A2B8'],
              borderWidth: 1
            }]
          },
          options: {
            maintainAspectRatio: false,
            scales: { y: { beginAtZero:true, max:10 } },
            plugins: { legend:{ display:true } }
          }
        });

        // γ) Ποσοστό πλήθους (pie)

        new Chart($('#chartCounts'), {
          type: 'pie',
          data: {
            labels: ['Επιβλέπων', 'Μέλος Επιτροπής'],
            datasets: [{
              data: [supCnt, revCnt],
              backgroundColor: ['#FFD586','#FAA4BD'],
              hoverOffset: 6
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }, 50);

    })
    .fail(() => {
      modalBody.html('<p class="alert-error">Σφάλμα φόρτωσης στατιστικών.</p>');
    });
}
      modal.fadeIn();
  });

  // Κλείσιμο modal
  $('.close').on('click', function () {
    modal.fadeOut();
  });

  modal.on('click', function (e) {
    if ($(e.target).hasClass('modal')) {
      modal.fadeOut();
    }
  });

  $(document).on('click', '.action-btn.edit', function() {
    
    const projectId = $(this).data('id');
    
    // Άνοιξε modal για επεξεργασία ή στείλε request
    
    console.log('Edit:', projectId);

  });

  /* ── άνοιγμα σελίδας πρακτικού εξέτασης ───────────────────── */
  $(document).on('click', '.action-btn.receipt', function () {
    const pid = $(this).data('id');
    window.open(`exam_receipt.html?pid=${pid}`, '_blank');
  });


   /* --------------------------------------------------------------------
   2)  Click-handler  για  το  κουμπί  Λήψη
   ------------------------------------------------------------------------*/
    $('#exportBtn').on('click', () => {

      if (!visibleProjects.length) {
        alert('Δεν υπάρχουν δεδομένα για εξαγωγή.');
        return;
      }

      const format = $('#exportFormat').val();   // csv ή json
      
      const blob   = format === 'json'
                      ? toJSONBlob(visibleProjects)
                      : toCSVBlob(visibleProjects);

      triggerDownload(blob, `projects.${format}`);

    });


    $(document).ready(function () {

      const userId = localStorage.getItem('userId');   // ← εδώ

      $(document).on('click', '.action-btn.review', function () {

        const projectId = $(this).data('id');

        if (!confirm('Να αλλάξει η διπλωματική σε "Υπό Εξέταση";')) return;

        $.post('../php/set-project-in-review.php',
          {
            project_id:  projectId,
            professor_id: userId        // ← περνάμε και το id
          },
          function (res) {
            const out = typeof res === 'object' ? res : JSON.parse(res);
            if (out.success) {
              loadProjectsTable();
            } else {
              alert(out.message);
            }
          }
        ).fail(() => alert('Σφάλμα ενημέρωσης.'));
      });
    });


  
  $(document).on('click', '.action-btn.delete', function () {
    
    const projectId = $(this).data('id');
    
    if (confirm('Είσαι σίγουρος ότι θες να διαγράψεις αυτή τη διπλωματική;')) {

      $.ajax({
        url: '../php/delete-project.php',
        type: 'POST',
        data: { id: projectId },
        success: function (response) {

          const message = response.message || 'Η διαγραφή ολοκληρώθηκε.';
          console.log(message);
          console.log(response.logs); // logs στην κονσόλα
          loadProjectsTable();
        },
        error: function () {
          alert('Σφάλμα κατά τη διαγραφή.');
        }
      });
    }
  });
  

  /* ===============================================================
   Handler κουμπιού “περισσότερα” ( .action-btn.more )
   =============================================================== */
$(document).on('click', '.action-btn.more', function () {

  const projectId = $(this).data('id');

  $.ajax({
    url : '../php/get-project-details.php',
    type: 'POST',
    data: { project_id: projectId },
    dataType: 'json'
  })
  .done(res => {

    if (!res || !res.success) {
      alert('Σφάλμα: ' + (res?.message ?? 'άγνωστο')); return;
    }

    const p = res.data;                       // όλα τα πεδία από PHP
    const dash = v => (v ?? '—');             // helper για κενά

    /* ---------- HTML του modal, *έτοιμο* με δεδομένα --------- */
    $('#modalTitle').html('<h3>Λεπτομέρειες Διπλωματικής</h3>');

    $('#modalBody').html(/* html */`
      <div class="details-wrapper">

        <!-- Κάρτα 1 : Βασικά -->
        <div class="details-card">
          <table class="details-table">
            <tbody>
              <tr><th>Κωδικός</th>            <td>${dash(p.project_id)}</td></tr>
              <tr><th>Τίτλος</th>             <td>${dash(p.title)}</td></tr>
              <tr><th>Κατάσταση</th>          <td>${dash(p.phase)}</td></tr>
              <tr><th>Επιβλέπων</th>          <td>${dash(p.supervisor_name)}</td></tr>
              <tr><th>Αξιολογητής Α</th>      <td>${dash(p.reviewer_a_name)}</td></tr>
              <tr><th>Αξιολογητής Β</th>      <td>${dash(p.reviewer_b_name)}</td></tr>
              <tr><th>Ημ/νία Δημιουργίας</th><td>${dash(p.created_on)}</td></tr>
              <tr><th>Ημ/νία Τροποποίησης</th><td>${dash(p.modified_on)}</td></tr>
              <tr><th>Ημ/νία Ολοκλήρωσης</th><td>${dash(p.finished_on)}</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Κάρτα 2 : Meta & αρχεία -->
        <div class="details-card">
          <table class="details-table">
            <tbody>
              <tr><th>Περίληψη</th>        <td>${dash(p.summary)}</td></tr>
              <tr><th>Attachment</th>      <td>${fileLink(p.attachment)}</td></tr>
              <tr><th>Προσχέδιο</th>       <td>${fileLink(p.draft_attachment)}</td></tr>
              <tr><th>Κωδ. Παραλαβής</th>  <td>${dash(p.receipt_code)}</td></tr>
              <tr><th>Repository</th>      <td>${repoLink(p.repo_link)}</td></tr>
              <tr><th>Ακύρωση από</th>     <td>${dash(p.cancelled_by)}</td></tr>
              <tr><th>Λόγος Ακύρωσης</th>  <td>${dash(p.cancellation_reason)}</td></tr>
              <tr><th>Έτος Ακύρωσης</th>   <td>${dash(p.cancellation_year)}</td></tr>
              <tr><th>Αριθμός ΓΑ</th>      <td>${dash(p.ga_number)}</td></tr>
            </tbody>
          </table>
        </div>

      </div>
    `);

    $('#genericModal').fadeIn();              // εμφανίζουμε modal
  })
  .fail(() => alert('Σφάλμα φόρτωσης λεπτομερειών.'));
});


/* ===============================================================
   Helper functions
   =============================================================== */

/* Επιστρέφει link PDF (ή '—') */
function fileLink(path){
  return path
    ? `<a href="../${path}" target="_blank"><i class="fas fa-file-pdf"></i> Προβολή</a>`
    : '—';
}

/* Επιστρέφει hyperlink repo (ή '—') */
function repoLink(url){
  return url
    ? `<a href="${url}" target="_blank"><i class="fas fa-link"></i> Αποθετήριο</a>`
    : '—';
}

  });
  


/* ── handler για το κουμπί Εξέτασης ─────────────────────────── */

$(document).on('click', '.assessment', function () {

  const pid = $(this).data('id');

  $.get('../php/get-assessment.php', { projectId: pid }, data => {

    if (!data || !data.success) {

      alert('Δεν βρέθηκαν στοιχεία εξέτασης.');

      return;
    }

    const a = data.row; // {sched_date, sched_time, mode, room, meeting_url …}

    $('#modalTitle').html('<h3>Λεπτομέρειες Εξέτασης</h3>');

    $('#modalBody').html(renderPrefilledAssessment(a, pid));

    $('#genericModal').fadeIn();

  }, 'json')

  .fail(()=> alert('Σφάλμα ανάκτησης στοιχείων.'));

});


/* πατάμε το κουμπί “start-marking” */

$(document).on('click', '.start-marking', function () {

  if (!confirm('Θέλεις να μεταβεί η διπλωματική σε κατάσταση “marking”;'))
      return;

  const pid = $(this).data('id');

  $.post('../php/set-phase.php', { projectId: pid, phase: 'marking' }, res => {

    const o = typeof res === 'object' ? res : JSON.parse(res);

    alert(o.message || (o.success ? 'OK' : 'Σφάλμα'));

    if (o.success && typeof loadProjectsTable === 'function') loadProjectsTable();

  }).fail(()=> alert('Σφάλμα αλλαγής phase.'));

});


/* ── ανοίγει modal βαθμολόγησης ───────────────────────── */

$(document).on('click','.grade-modal',function(){

  const pid = $(this).data('id');
  
  const phase = $(this).data('phase');      // ⇦ εδώ υπάρχει τώρα

  console.log(phase);

  $.get('../php/get-scores.php',{ projectId: pid },data=>{

    if(!data || !data.success){

      alert('Δεν βρέθηκαν βαθμολογίες.'); return;
    }

    $('#modalTitle').html('<h3>Φόρμα Βαθμολόγησης</h3>');

    $('#modalBody').html(renderScoresForm({...data.row,phase}, pid));
    
    $('#genericModal').fadeIn();
  },'json').fail(()=>alert('Σφάλμα ανάκτησης.'));
});


/* ── υποβολή βαθμολογίας ─────────────────────────────────── */

$(document).on('submit', '#scoresForm', function (e) {

  e.preventDefault();

  const fd = new FormData(this);

  fd.append('userId', localStorage.getItem('userId')); // ποιος τα στέλνει

  // ➜ client-side: όλα τα νούμερα 0-10
  for (const [k, v] of fd.entries()) {

    if (k === 'projectId' || k === 'userId') continue;

    const n = Number(v);

    if (isNaN(n) || n < 0 || n > 10) {

      return alert('Οι βαθμοί πρέπει να είναι 0-10.');
    }
  }

  $.ajax({
    url: '../php/save-scores.php',
    type: 'POST',
    data: fd,
    processData: false,
    contentType: false,
    success: res => {
      const o = typeof res === 'object' ? res : JSON.parse(res);
      alert(o.message || (o.success ? 'OK' : 'Σφάλμα'));
      if (o.success) {
        $('#genericModal').fadeOut();
        if (typeof loadProjectsTable === 'function') loadProjectsTable();
      }
    },
    error: () => alert('Σφάλμα αποθήκευσης βαθμών.')
  });
});


/* ── καταχώρηση Αριθμού Πρακτικού (μόνο secretary) ───────────── */

$(document).on('click', '.action-btn.ga', function () {

  if (localStorage.getItem('userRole') !== 'secretary') return;  // ασφάλεια

  const pid = $(this).data('id');

  /* prompt για αριθμό πρακτικού */

  const ga = prompt('Δώσε τον Αριθμό Πρακτικού (ΑΠ) της Γ.Σ.:');

  if (ga === null) return;                 // πάτησε Cancel

  if (!ga.trim())  { alert('Άκυρος αριθμός.'); return; }

  $.post('../php/set-ga-number.php',

    { projectId: pid, ga_number: ga.trim() },

    function (res) {

      const o = typeof res === 'object' ? res : JSON.parse(res);

      alert(o.message || (o.success ? 'OK' : 'Σφάλμα'));

      if (o.success && typeof loadProjectsTable === 'function') loadProjectsTable();

    }

  ).fail(()=> alert('Σφάλμα αποθήκευσης ΑΠ.'));

});


/* ── Γραμματεία: ακύρωση ανάθεσης ───────────────────────── */

$(document).on('click', '.action-btn.cancel-sec', function () {

  if (localStorage.getItem('userRole') !== 'secretary') return; // ασφάλεια

  const pid = $(this).data('id');

  /* prompt για ΑΠ & Έτος Γ.Σ. */

  const gaNum  = prompt('Αριθμός Πρακτικού (ΑΠ) Γ.Σ.:');

  if (gaNum === null) return;

  const gaYear = prompt('Έτος Γ.Σ.:', new Date().getFullYear());

  if (gaYear === null) return;

  /* απλός έλεγχος */

  if (!gaNum.trim() || !/^\d{4}$/.test(gaYear.trim())) {

    alert('Άκυρος αριθμός ή έτος Γ.Σ.'); return;
    
  }

  $.post('../php/cancel-project-by-sec.php',
    {
      projectId        : pid,
      ga_number        : gaNum.trim(),
      cancellation_year: gaYear.trim(),
      cancelled_by     : localStorage.getItem('loggedInUser')   // π.χ. «Γραμματεία»
    },
    res => {
      const o = typeof res === 'object' ? res : JSON.parse(res);
      
      alert(o.message || (o.success ? 'OK' : 'Σφάλμα'));

      if (o.success && typeof loadProjectsTable === 'function') loadProjectsTable();
    }

  ).fail(()=> alert('Σφάλμα ακύρωσης.'));

});


  /* ── Ολοκλήρωση διπλωματικής (phase → finished) ───────────── */

  $(document).on('click', '.action-btn.finish', function () {

    const pid = $(this).data('id');

    if (!confirm('Θέλεις να ορίσεις τη διπλωματική ως “finished”;')) return;

    $.post('../php/set-phase.php',

      { projectId: pid, phase: 'finished' },

      res => {

        const o = typeof res === 'object' ? res : JSON.parse(res);

        alert(o.message || (o.success ? 'OK' : 'Σφάλμα'));

        if (o.success && typeof loadProjectsTable === 'function') loadProjectsTable();

      }
      
    ).fail(()=> alert('Σφάλμα αλλαγής phase.'));

  });


/* ── helper: προ-συμπληρωμένη φόρμα σε read-only ----------- */

function renderPrefilledAssessment(a, pid){

  return `
  <form id="assessmentForm">
  
    <input type="hidden" name="projectId" value="${pid}">
    
    <label>Ημερομηνία εξέτασης:</label>
    <input type="date" name="sched_date" value="${a.sched_date}" readonly>

    <label>Ώρα εξέτασης:</label>
    <input type="time" name="sched_time" value="${a.sched_time}" readonly>

    <label>Τρόπος εξέτασης:</label>
    <input type="text" value="${a.mode === 'onsite' ? 'Δια ζώσης' : 'Online'}" readonly>

    ${a.mode === 'onsite' ? `

      <label>Αίθουσα:</label>

      <input type="text" value="${a.room || '—'}" readonly>` : `

      <label>Σύνδεσμος Meeting:</label>

      <input type="url" value="${a.meeting_url || '—'}" readonly>`}

    ${a.notice_title || a.notice_body ? `

      <label>Ανακοίνωση:</label>

      <strong>${a.notice_title || ''}</strong>

      <p>${(a.notice_body || '').replace(/\n/g,'<br>')}</p>` : ''}

  </form>`;
}


function renderScoresForm(s, pid) {

  const uid   = Number(localStorage.getItem('userId'));

  const status = s.phase ?? ''; // status από backend (π.χ. 'marking')

  console.log(status);

  console.log(uid);

  const isMarking = status === 'marking';

  const canSup = isMarking && uid === Number(s.supervisor_id);

  const canR1  = isMarking && uid === Number(s.reviewer1_id);
  
  const canR2  = isMarking && uid === Number(s.reviewer2_id);

  const who = {
    sup : s.supervisor_name  || 'Supervisor',
    r1  : s.reviewer1_name   || 'Reviewer 1',
    r2  : s.reviewer2_name   || 'Reviewer 2'
  };

  const field = (name,val,enabled) =>
    `<input type="number" name="${name}" value="${val ?? ''}"
            min="0" max="10" ${enabled ? '' : 'disabled'}>`;

  return `
  <form id="scoresForm">
    <input type="hidden" name="projectId" value="${pid}">

    <table class="scores-table">
      <thead>
        <tr><th></th><th>Quality</th><th>Duration</th><th>Text</th><th>Presentation</th></tr>
      </thead>
      <tbody>
        <tr><th>${who.sup}</th>
          <td>${field('sup_quality'     , s.sup_quality     , canSup)}</td>
          <td>${field('sup_duration'    , s.sup_duration    , canSup)}</td>
          <td>${field('sup_text'        , s.sup_text        , canSup)}</td>
          <td>${field('sup_presentation', s.sup_presentation, canSup)}</td>
        </tr>
        <tr><th>${who.r1}</th>
          <td>${field('rev1_quality'    , s.rev1_quality    , canR1)}</td>
          <td>${field('rev1_duration'   , s.rev1_duration   , canR1)}</td>
          <td>${field('rev1_text'       , s.rev1_text       , canR1)}</td>
          <td>${field('rev1_presentation',s.rev1_presentation,canR1)}</td>
        </tr>
        <tr><th>${who.r2}</th>
          <td>${field('rev2_quality'    , s.rev2_quality    , canR2)}</td>
          <td>${field('rev2_duration'   , s.rev2_duration   , canR2)}</td>
          <td>${field('rev2_text'       , s.rev2_text       , canR2)}</td>
          <td>${field('rev2_presentation',s.rev2_presentation,canR2)}</td>
        </tr>
      </tbody>
    </table>

    <button type="submit" class="save-scores-btn"
            ${(canSup || canR1 || canR2) ? '' : 'disabled'}
            style="margin-top:18px;">Αποθήκευση</button>
  </form>`;
}



/* ------------------------------------------------------------------
   Ο Διδάσκων βλέπει τη λίστα όλων των διπλωματικών
   ------------------------------------------------------------------ */

window.loadProjectsTable = function () {

  /* ------- ποιος χρήστης / τι ρόλος --------------------------- */

  const userId = localStorage.getItem('userId');

  const role   = localStorage.getItem('userRole');   // "professor" | "secretary"

  const isSecretary = role === 'secretary';

  /* ------- τι φίλτρα έχουμε επιλέξει -------------------------- */

  const selectedPhase = $('#filterPhase').val();

  const selectedRole  = $('#filterRole').val();

  /* ------- Ajax: φέρε projects (περνάμε ΚΑΙ το role) ---------- */

  $.get('../php/get-projects.php',

    { professorId: userId, role: role },
        
    function (rows) {

    const $tbody = $('#projectsTable tbody').empty();
   
    visibleProjects = [];

    if (!rows || rows.length === 0) {
      $tbody.append('<tr><td colspan="9">Δεν υπάρχουν διπλωματικές.</td></tr>');
      return;
    }

    rows.forEach(project => {

      /* --- ρόλος του τρέχοντος χρήστη σε αυτό το project ------ */

      const myRole =

        project.supervisor_id == userId ? 'Supervisor' :

        (project.reviewer_a == userId || project.reviewer_b == userId) ? 'Reviewer' : '';


      /* --- φίλτρα Phase / Role (όχι για secretary) ------------ */

      if (!isSecretary) {

        if (selectedPhase && project.phase !== selectedPhase)          return;

        if (selectedRole  && myRole.toLowerCase() !== selectedRole)    return;

      }

      /* --- διάφοροι υπολογισμοί ------------------------------- */

      const studentName  = project.student_name || 'Δεν έχει ανατεθεί';

      const projectAge   = ageString(project.created_on);

      const isActive     = project.phase === 'active';

      const isDraft     = project.phase === 'draft';

      const isSubmitted     = project.phase === 'submitted';

      const isSupervisor = myRole === 'Supervisor';

      const isCancelable = isSupervisor &&
                           ageInYears(project.created_on) >= 2 &&
                           project.phase !== 'cancelled';

      /* --- κατασκευή κουμπιών -------------------------------- */

      let btn;

      const hasFinal   = project.final_mark !== null && project.final_mark !== '';

      const hasRepo    = project.repo_link && project.repo_link.trim() !== '';

      const canFinish  = (project.phase === 'marked') && hasFinal && hasRepo;


      if (isSecretary) {
        /* γραμματεία → μόνο More + (σε active) κουμπί ΑΠ */
        btn = {

          more : makeBtn('more', project.project_id, 'fas fa-ellipsis-h', 'Περισσότερα'),

          ga   : isActive
            ? makeBtn('ga', project.project_id, 'fas fa-file-signature', 'Καταχώρηση ΑΠ')
            : '',

          cancelSec : (isSecretary && isActive)
            ? makeBtn('cancel-sec', project.project_id,
                'fas fa-ban', 'Ακύρωση ανάθεσης') : '',

          finish : (canFinish && isSecretary)
            ? makeBtn('finish', project.project_id,
              'fas fa-flag-checkered', 'Οριστική Ολοκλήρωση') : ''

        };
      } else {
        /* καθηγητής – όλα όπως πριν */
        btn = {

          edit   : ((isDraft || isSubmitted) && isSupervisor) ? makeBtn('edit', project.project_id,'fas fa-pen','Επεξεργασία') : '',

          delete :  makeBtn('delete',  project.project_id,'fas fa-trash',      'Διαγραφή'),

          more   : makeBtn('more',    project.project_id,'fas fa-ellipsis-h', 'Περισσότερα'),

          invites: project.phase !== 'draft'
                     ? makeBtn('invites', project.project_id,'fas fa-user-plus','Προσκεκλημένοι'): '',

          notes  : isActive
                     ? makeBtn('notes', project.project_id,'fas fa-sticky-note','Σημειώσεις') : '',

          review : (isActive && isSupervisor)
                     ? makeBtn('review', project.project_id,'fas fa-arrow-right','Υπό Εξέταση') : '',

          cancel : isCancelable
                     ? makeBtn('cancel', project.project_id,'fas fa-ban','Ακύρωση') : '',

          assessment   : (project.phase === 'exam_scheduled')
                     ? makeBtn('assessment', project.project_id,'fas fa-calendar-alt','Λεπτομέρειες Εξέτασης') : '',

          startMarking : (project.phase === 'exam_scheduled')
                     ? makeBtn('start-marking', project.project_id,'fas fa-check-circle','Έναρξη Βαθμολόγησης') : '',

          grade : (['marking','marked','finished'].includes(project.phase))
                     ? makeBtn('grade-modal', project.project_id,'fas fa-pencil-alt','Βαθμολογία' ,{ phase : project.phase } ) : '',

          receipt : (['marked','finished'].includes(project.phase))
                      ? makeBtn('receipt', project.project_id,
                          'fas fa-file-pdf', 'Πρακτικό εξέτασης', { phase : project.phase } ) : '',

        };

      }

      /* --- PDF link ------------------------------------------ */
      const pdfCell = project.attachment
        ? `<a href="../${project.attachment}" target="_blank" class="pdf-link">
             <i class="fas fa-file-alt fa-xl"></i>
           </a>`
        : '—';

        /* πιο έντονα-κορεσμένα χρώματα κατάστασης */
        const phaseColors = {
          draft          : '#95a5a6',  // σκούρο γκρι
          submitted      : '#3498db',  // ζωηρό μπλε
          active         : '#2ecc71',  // έντονο πράσινο
          in_review      : '#FEBA17',  // κορεσμένο κίτρινο
          exam_scheduled : '#e91e63',  // φούξια
          cancelled      : '#DC2525',  // κόκκινο
          marking        : '#9b59b6',  // βαθύ λιλά
          marked         : '#27ae60',  // σμαραγδί
          finished       : '#34495e'   // σκούρο μπλε-γκρι
        };


        /* … μέσα στο append … */
        const phaseColor = phaseColors[project.phase] || '#ccc';

        const phaseBadge = `<span class="phase-badge" style="background:${phaseColor}">${project.phase}</span>`;

        $tbody.append(`
          <tr>
            <td>${project.title}</td>
            <td>${project.summary}</td>
            <td>${studentName}</td>
            <td>${phaseBadge}</td>        <!-- μόνο Αυτό έχει χρώμα -->
            <td>${isSecretary ? '—' : (myRole || '—')}</td>
            <td>${project.created_on}</td>
            <td>${pdfCell}</td>
            <td>${projectAge}</td>
            <td>
              <div class="actions-cell">
                ${Object.values(btn).join('')}
              </div>
            </td>
          </tr>
        `);


      /* --- buffer για export ---------------------------------- */
      visibleProjects.push({
        id: project.project_id, 
        τίτλος: project.title,
        περίληψη: project.summary, 
        φοιτητής: studentName,
        κατάσταση: 
        project.phase,  
        ρόλος: myRole,
        'ημ/νία': project.created_on, 
        ηλικία: projectAge
      });
    });
  });
};

/* ==========  Βοηθητικές συναρτήσεις  ============================= */

/* “Badge” ηλικίας (π.χ. 1 χρόνος και 3 ημέρες) */

function ageString(dateStr) {

  const totalDays = Math.floor((Date.now() - new Date(dateStr)) / 86400000);

  const yrs = Math.floor(totalDays / 365);

  const rem = totalDays % 365;

  return yrs
    ? `${yrs} ${yrs === 1 ? 'χρόνος' : 'χρόνια'}${rem ? ' και ' + rem + ' ημέρες' : ''}`

    : `${totalDays} ημέρες`;
}

/* Επιστροφή «γεμάτων» ετών (π.χ. 2, 3 …) */

function ageInYears(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr)) / (365 * 24 * 60 * 60 * 1000));
}

/* Generator κουμπιών */

function makeBtn(cls, id, iconClass, title, extra = {}) {
  /* ➜ μετατροπή του αντικειμένου extra σε data-attrs */
  const dataAttrs = Object.entries(extra)
                   .map(([k, v]) => ` data-${k}="${v}"`)
                   .join('');

  return `
    <button class="action-btn ${cls}" data-id="${id}" title="${title}"${dataAttrs}>
      ${title}
    </button>`;
}


function toJSONBlob(data) {
  
  // Μετατρέπει το αντικείμενο σε κείμενο JSON με ωραία μορφοποίηση

  const jsonText = JSON.stringify(data, null, 2);

  // Δημιουργεί και επιστρέφει ένα Blob τύπου "application/json"

  return new Blob([jsonText], { type: 'application/json' });

}

// Μετατρέπει έναν πίνακα αντικειμένων σε CSV και δημιουργεί Blob (UTF-8)

function toCSVBlob(data) {

  const keys = Object.keys(data[0]);

  const rows = data.map(obj =>

    keys.map(k => `"${String(obj[k]).replace(/"/g, '""')}"`).join(',')

  );
  rows.unshift(keys.join(','));

  return new Blob([rows.join('\n')], { type: 'text/csv' });
}


// Δημιουργεί έναν προσωρινό σύνδεσμο για να κατεβάσει ένα Blob ως αρχείο

function triggerDownload(blob, filename) {

  // Δημιουργεί προσωρινό URL από το Blob

  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);

  // Ορίζει το όνομα του αρχείου που θα κατέβει

  link.download = filename;

  // "Κλικάρει" αυτόματα τον σύνδεσμο για να ξεκινήσει το κατέβασμα

  link.click();

  URL.revokeObjectURL(link.href);
}
