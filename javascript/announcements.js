
$(function(){

  // Ορισμός default τιμών:

  const today   = new Date();

  const week7   = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const isoDate = d => d.toISOString().slice(0,10);

  $('#from').val( isoDate(today) );

  $('#to')  .val( isoDate(week7) );

  // Φόρτωμα feed με το αρχικό εύρος

  loadFeed();

  // Όταν ο χρήστης πατήσει "Φόρτωση"

  $('#rangeForm').on('submit', e => {
    e.preventDefault();
    loadFeed();
  });
});


function loadFeed() {

  const from = $('#from').val();  // "YYYY-MM-DD"

  const to   = $('#to').val();    // "YYYY-MM-DD"

  const url  = `../php/assessments.php?from=${from}&to=${to}`;

  // Link για XML, αν θες

  $('#xmlLink').attr('href', url + '&format=xml');

  const $tb = $('#annTable tbody').html('<tr><td colspan="5">Φόρτωση…</td></tr>');

  $.getJSON(url)
  
    .done(rows => {

      $tb.empty();

      if (!rows.length) {
        $tb.append('<tr><td colspan="5">Δεν βρέθηκαν ανακοινώσεις.</td></tr>');
        return;
      }

      rows.forEach(r => {

    const place = r.mode === 'onsite'
    ? (r.room || '—')
    : (r.meeting_url
        ? `<button class="see-online-btn" onclick="window.open('${r.meeting_url}','_blank')">Online</button>`
        : '—');

        $tb.append(`
          <tr>
            <td>${r.sched_date}</td>
            <td>${r.sched_time.slice(0,5)}</td>
            <td>${r.project_title}</td>
            <td>${r.student_name || '—'}</td>
            <td>${place}</td>
          </tr>
        `);
      });
    })

    .fail(() => {
      $tb.html('<tr><td colspan="5">⚠️ Σφάλμα φόρτωσης feed.</td></tr>');
    });
}
