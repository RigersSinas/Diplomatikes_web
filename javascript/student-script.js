/* --------------------------------------------------------------
   student-script.js  (ολόκληρο)
-------------------------------------------------------------- */

$(document).ready(() => {

  const username  = localStorage.getItem('loggedInUser');

  const role      = localStorage.getItem('userRole');

  const studentId = localStorage.getItem('userId');

  /* --- προστασία --- */

  if (role !== 'student' || !username || !studentId) {
    return location.replace('../pages/login-page.html');
  }

  $('#studentName').text(username);

  $('#logoutBtn').on('click', () => {
    localStorage.clear();
    location.replace('../pages/login-page.html');
  });

  /* πρώτη φόρτωση */

  loadStudentProject();

});

/* --------------------------------------------------------------
   κεντρική ρουτίνα
-------------------------------------------------------------- */

window.loadStudentProject = function () {

  const daysSince = d => Math.floor((Date.now() - new Date(d)) / 86_400_000);

  const studentId = localStorage.getItem('userId');

  if (!studentId) return;

  /* 1) Project + Meta ------------------------------------------------ */

  $.get('../php/get-student-projects.php', { studentId }, async res => {

    if (!res || !res.length) { alert('Δεν βρέθηκαν δεδομένα.'); return; }

    const p = res[0];

    const projectId = p.project_id;

    localStorage.setItem('currentProjectId', projectId);

    /* 2) -- Scores (βλέπουμε final_mark) --------------------------- */

    let finalMark = null;

    try {

      const sc = await $.getJSON('../php/get-scores.php', { projectId });

      if (sc.success && sc.row) finalMark = sc.row.final_mark;

    } catch { /* αγνοούμε σφάλμα */ }


    /* --- εμφανίζουμε βασικά στοιχεία ------------------------------- */

    const phaseColors = {
      draft:'#808080',
      submitted:'#1e90ff',
      active:'#17c964',
      in_review:'#ffb41f',
      exam_scheduled:'#ff69b4',
      cancelled:'#ff4d4f',
      marking:'#9b59b6',
      marked:'#22c55e',
      finished:'#34495e'
    };

    const phase = (p.phase || '').trim();

    $('#project_phase').html(
      `<span class="phase-badge" style="background:${phaseColors[phase]||'#ccc'}">${phase||'—'}</span>`
    );
    $('#project_id').text(projectId||'-');

    $('#project_title').text(p.title||'—');

    $('#supervisor_id').text(p.supervisor_name||'—');

    $('#reviewer_a').text(p.reviewer_a_name||'-');

    $('#reviewer_b').text(p.reviewer_b_name||'-');

    $('#created_on').text(p.created_on);

    $('#modified_on').text(p.modified_on);

    $('#finished_on').text(p.finished_on||'-');

    $('#project_age').text(p.created_on ? `${daysSince(p.created_on)} ημέρες` : '—');

    $('#summary').text(p.summary || '-');

    $('#attachment').html(p.attachment ? linkIcon(p.attachment) : '-');

    $('#draft_attachment').html(p.draft_attachment ? linkIcon(p.draft_attachment) : '-');

    $('#receipt_code').text(p.receipt_code || '-');

    $('#repo_link').html(
      p.repo_link
        ? `<a href="${p.repo_link}" target="_blank" class="repo-link-clean">Προβολή</a>`
        : '<span class="no-link">-</span>'
    );

    $('#cancelled_by').text(p.cancelled_by || '-');

    $('#cancellation_reason').text(p.cancellation_reason || '-');

    $('#cancellation_year').text(p.cancellation_year || '-');
    
    $('#ga_number').text(p.ga_number || '-');

    $('#resources').html(renderLinks(p.links));

    /* 3)  Δυναμικά κουμπιά Πρακτικού & Repository ------------------ */

    const $dash = $('.dashboard-buttons');


    // 1. Απόκρυψη κουμπιών ανάλογα με phase
    if (phase === 'finished') {

      // ► μόνο «Ανανέωση Στοιχείων»

      $('.dashboard-buttons .dashboard-btn').each(function () {

        const modal = $(this).data('modal');

        (modal !== 'refresh') ? $(this).hide() : $(this).show();
        
      });

    } else if (phase === 'in_review') {

      // ► refresh / upload / add-link / schedule-assessment

      const allow = ['refresh','upload','add-link','schedule-assessment'];

      $('.dashboard-buttons .dashboard-btn').each(function () {

        const modal = $(this).data('modal');

        allow.includes(modal) ? $(this).show() : $(this).hide();

      });

    } else if (phase === 'submitted') {

      // ► refresh / invite

      const allow = ['refresh','invite'];

      $('.dashboard-buttons .dashboard-btn').each(function () {

        const modal = $(this).data('modal');

        allow.includes(modal) ? $(this).show() : $(this).hide();

      });

    } else {

      // ► σε κάθε άλλη φάση δείξε όλα

      $('.dashboard-buttons .dashboard-btn').show();
    }


    if (finalMark !== null && finalMark !== '' && !isNaN(finalMark)) {

      // Πάντα προσθέτουμε "Πρακτικό Εξέτασης"

      $dash.find('[data-modal="view-receipt"]').remove(); // καθάρισε τυχόν προηγούμενο

      $dash.append(`
        <button class="dashboard-btn" data-modal="view-receipt">
          Πρακτικό Εξέτασης
        </button>`);

      // Προσθέτουμε "Καταχώρηση Repository" μόνο αν ΔΕΝ είναι finished

      if (phase !== 'finished') {

        $dash.find('[data-modal="add-repo"]').remove(); // καθάρισε τυχόν προηγούμενο
        
        $dash.append(`
          <button class="dashboard-btn" data-modal="add-repo">
            Καταχώρηση Repository
          </button>`);
      }

    }

    /*  handlers  --------------------------------------------------- */

    /* άνοιγμα πρακτικού */

    $(document).off('click.viewReceipt')

    .on('click.viewReceipt', '.dashboard-btn[data-modal="view-receipt"]', () => {

      window.open(`exam_receipt.html?pid=${projectId}`, '_blank');

    });

    /* καταχώρηση repo */

    $(document).off('click.addRepo')

    .on('click.addRepo', '.dashboard-btn[data-modal="add-repo"]', () => {

      const url = prompt('Επικόλλησε το URL του repository (https://…)');

      if (!url) return;

      const urlPat = /^(https?:\/\/)[\w\-._~:/?#[@\]!$&'()*+,;=]+$/i;

      if (!urlPat.test(url)) { alert('Μη έγκυρο URL.'); return; }

      $.post('../php/update-repo-link.php',
        
        { projectId, repo_link:url },

        r => {

          const o = typeof r === 'object' ? r : JSON.parse(r);

          alert(o.message || (o.success ? 'OK' : 'Σφάλμα'));

          if (o.success) loadStudentProject();   // refresh

        }

      ).fail(()=>alert('Σφάλμα αποθήκευσης.'));

    });

  }).fail(() => alert('Σφάλμα server.'));
};

/* --------------------------------------------------------------
   helpers
-------------------------------------------------------------- */

function linkIcon(path){

  return `<a href="../${path}" target="_blank">

            <i class="fas fa-file-pdf fa-xl" style="color:red;"></i>

          </a>`;
}


function renderLinks(arr){

  if (!Array.isArray(arr)||!arr.length) return '-';

  const payload = JSON.stringify(arr);

  return `<button class="see-links-btn" data-links='${payload}'>See links</button>`;

}


/* modal λίστα links */

$(document).on('click','.see-links-btn',function(){

    const links = JSON.parse($(this).attr('data-links')||'[]');

    $('#modalTitle').html('<h3>Πόροι</h3>');
    
    const html = links.map(l=>`<li><a href="${l}" target="_blank">${l}</a></li>`).join('');

    $('#modalBody').html(`<ul class="res-list">${html||'<li>—</li>'}</ul>`);

    $('#genericModal').fadeIn();
  })

  .on('click','.modal .close',()=>$('#genericModal').fadeOut())

  .on('keyup',e=>{ if(e.key==='Escape') $('#genericModal').fadeOut(); 

  });
