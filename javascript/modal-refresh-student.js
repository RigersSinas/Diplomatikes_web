$(document).ready(function () {
    $('.dashboard-btn[data-modal="refresh"]').click(function () {
      const studentId = localStorage.getItem("userId");
  
      if (!studentId) {
        alert('Δεν βρέθηκε ID φοιτητή.');
        return;
      }
  
      $.ajax({
        url: '../php/get-student-info.php',
        type: 'GET',
        data: { id: studentId },
        success: function (data) {
          if (!data || !data.id) {
            alert('Δεν βρέθηκαν στοιχεία φοιτητή.');
            return;
          }
  
          $('#modalTitle').html('<h3>Στοιχεία Φοιτητή</h3>');
          $('#modalBody').html(`
            <form id="studentInfoForm">
              <div style="margin-bottom: 5px;">
                <button type="button" id="editBtn">Επεξεργασία</button>
                <button type="submit" id="saveBtn" style="display: none;">Αποθήκευση</button>
              </div>
    
              <div class="form-row"><label>Όνομα:</label><input type="text" name="name" readonly value="${data.name || ''}"></div>
              <div class="form-row"><label>Επώνυμο:</label><input type="text" name="surname" readonly value="${data.surname || ''}"></div>
              <div class="form-row"><label>Αρ. Μητρώου:</label><input type="text" name="student_number" readonly value="${data.student_number || ''}"></div>
              <div class="form-row"><label>Οδός:</label><input type="text" name="street" readonly value="${data.street || ''}"></div>
              <div class="form-row"><label>Αριθμός:</label><input type="text" name="number" readonly value="${data.number || ''}"></div>
              <div class="form-row"><label>Πόλη:</label><input type="text" name="city" readonly value="${data.city || ''}"></div>
              <div class="form-row"><label>Ταχ. Κώδικας:</label><input type="text" name="postcode" readonly value="${data.postcode || ''}"></div>
              <div class="form-row"><label>Όνομα Πατέρα:</label><input type="text" name="father_name" readonly value="${data.father_name || ''}"></div>
              <div class="form-row"><label>Σταθερό Τηλέφωνο:</label><input type="text" name="landline_telephone" readonly value="${data.landline_telephone || ''}"></div>
              <div class="form-row"><label>Κινητό Τηλέφωνο:</label><input type="text" name="mobile_telephone" readonly value="${data.mobile_telephone || ''}"></div>
              <div class="form-row"><label>Email:</label><input type="text" name="email" readonly value="${data.email || ''}"></div>
              </form>
              <div id="updateResponse" class="alert-message"></div>

          `);
  
          $('#genericModal').fadeIn();
        },
        error: function () {
          alert('Σφάλμα κατά τη φόρτωση των στοιχείων.');
        }
      });
    });
  
    // Κλείσιμο Modal
    $('.close').click(function () {
      $('#genericModal').fadeOut();
    });
  
    // Ενεργοποίηση επεξεργασίας
    $(document).on('click', '#editBtn', function () {
        $('#studentInfoForm input').prop('readonly', false).addClass('editable');
        $('#editBtn').hide();
      $('#saveBtn').show();
    });
  
    // Υποβολή ενημέρωσης
    $(document).on('submit', '#studentInfoForm', function (e) {
      e.preventDefault();
      const formData = $(this).serialize() + '&id=' + localStorage.getItem("userId");
  
      $.ajax({
        url: '../php/update-student-info.php',
        type: 'POST',
        data: formData,
        success: function (response) {
          const $message = $('#updateResponse');
          if (response.success) {
            $message
              .removeClass('alert-error')
              .addClass('alert-success')
              .text('Τα στοιχεία ενημερώθηκαν επιτυχώς!')
              .fadeIn();
              $('#studentInfoForm input').prop('readonly', true).removeClass('editable');
              $('#saveBtn').hide();
            $('#editBtn').show();
          } else {
            $message
              .removeClass('alert-success')
              .addClass('alert-error')
              .text('❌ Σφάλμα: ' + (response.error || 'Η ενημέρωση απέτυχε.'))
              .fadeIn();
          }
        },
        error: function () {
          $('#updateResponse')
            .removeClass('alert-success')
            .addClass('alert-error')
            .text('❌ Σφάλμα επικοινωνίας με τον server.')
            .fadeIn();
        }
      });
    });
  });
  