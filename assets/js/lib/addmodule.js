$(document).ready(function () {


  $("form[name='createmodules']").validate({
    rules: {
      m_name: {
        required: true
      },
      sec_type: {
        required: true
      },
      m_des: {
        required: true

      }


    },
    // Specify validation error messages
    messages: {
      m_name: "Please enter module name",
      p_type: "Please Select Section",
      m_des: "Please Enter Description"

    }


  });
  $('#createmodule').on("click", function () {

    if ($("form[name='createmodules']").valid()) {
      $(".loader-wrapper").removeClass('hide');

      var html = document.getElementById("moduleDesData").innerHTML;

      var data = {
        'm_name': $('input[name=m_name]').val(),
        'sec_type': sessionStorage.getItem('sec_id'),
        'm_des': html,
        _csrf: $('input[name=_csrf]').val(),
      };
      $.ajax({
        type: 'POST',
        url: '/addmodule',
        data: data,
        dataType: "json",
        success: function (status) {

          if (status.msg) {
            $(".loader-wrapper").addClass('hide');
            $.confirm({
              title: 'Success',
              content: 'Data insert successfully!',
              buttons: {
                OK: function () {
                  location.href = '/module/create?auth=' + sessionStorage.getItem('token');
                }


              }
            });


          }


        }
      });


    }

  });


});
