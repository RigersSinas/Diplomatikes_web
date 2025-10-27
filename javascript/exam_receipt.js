/* ------------------------------------------------------------
   exam_receipt.js  –  συμπλήρωση πρακτικού + (προαιρετικά) PDF
------------------------------------------------------------ */

/* id διπλωματικής από query  ?pid=123  */
const pid = new URLSearchParams(location.search).get('pid');
if (!pid) { alert('Missing pid'); }

/* helper για κενές τιμές */
const txt = v => (v ?? '—');

$(function () {

  /* 1. Project + Meta  --------------------------------------- */
  $.post(
    '../php/get-project-details.php',
    { project_id: pid },
    function (det) {

      if (!det.success) { alert('Σφάλμα project'); return; }
      const p = det.data;

      /* 2. Scores / βαθμολογία  ------------------------------- */
      $.getJSON(
        '../php/get-scores.php',
        { projectId: pid },
        function (sc) {

          const mark = sc.success && sc.row
                        ? (sc.row.final_mark ?? '—')
                        : '—';

          /* 3. Populate template ------------------------------ */

          /* --- Ονόματα φοιτητή --- */
          $('#stName , #stName2 , #stName3 , #stName4 , #stName5 , #stName6')
            .text( txt(p.student_name) );

          /* --- Χώρος & ημερομηνία εξέτασης --- */
          $('#room')     .text( txt(p.room) );
          $('#examDate') .text( txt(p.sched_date) );
          $('#examTime') .text( txt(p.sched_time) );

          /* --- Επιβλέπων --- */
          $('#supName , #supName2 , #supName3 , #supName4 , #supName5')
            .text( txt(p.supervisor_name) );

          /* --- Reviewer 1 --- */
          $('#rev1Name , #rev1Name2 , #rev1Name3')
            .text( txt(p.reviewer_a_name) );

          /* --- Reviewer 2 --- */
          $('#rev2Name , #rev2Name2 , #rev2Name3')
            .text( txt(p.reviewer_b_name) );

          /* --- Λοιπά πεδία --- */
          $('#gsNumber')   .text( txt(p.ga_number) );
          $('#projectTitle').text( txt(p.title) );
          $('#grade1 , #grade2').text( mark );

          /* --- ρόλοι στον πίνακα (σταθεροί) --- */
          $('#supTopic') .text('Επιβλέπων');
          $('#rev1Topic').text('Μέλος');
          $('#rev2Topic').text('Μέλος');

           //(προαιρετικό) αυτόματο export σε PDF
          /*html2pdf()
            .from(document.querySelector('.page'))
            .save(`practical_${pid}.pdf`);
          */
        }
      );
    },
    'json'
  )
  .fail(() => alert('Server error'));
});
