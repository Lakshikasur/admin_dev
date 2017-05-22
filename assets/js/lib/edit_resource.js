$(document).ready(function () {

  $('html').on('click','.uredit',function (e) {

    e.preventDefault();
    var resource_id = $(this).attr('name');

    var currentRow = $(this).closest("tr");
    var rName = currentRow.find("td:eq(1)").data('value');
    var rType = currentRow.find("td:eq(2)").data('value');
    var rSubTopic = currentRow.find("td:eq(3)").data('value') == "undefined" ? "No sub-topic" : currentRow.find("td:eq(3)").data('value');
    var file_id= currentRow.find("td:eq(4)").data('value');
    var rType_id= currentRow.find("td:eq(5)").data('value');
    $("#r_name").empty();
    $('input[name=r_name]').val(rName);
    $("#r_type").empty();
    $("#r_type").append("<option value=" + resource_id + " >" + rType + "</option>");
    $("#r_head").empty();
    $("#r_head").append("<option value=" + rSubTopic + " >" + rSubTopic + "</option>");
    $("#resource_id").empty();
    $("#resource_id").val(resource_id);
    $("input[name=r_name]").prop('disabled', true);
    $("textarea[name=url_link]").prop('disabled', true);
    $("#file_id").empty();
    $("#file_id").val(file_id);
    $('#url_link').val('');
    $('.fileUploadUrlSec').addClass('hide');


    if (rType_id == 1 || rType_id == 2 || rType_id == 5 ) {

      $('.fileUploadUrlSec').removeClass('hide');

    }
    $('#resourceEditModel').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#resourceEditModel').modal('show');


  });
  $('.glyphicon-remove-circle').click(function (e) {
    e.preventDefault();
    var id = $(this).closest('.editresourcemodal').attr('id');
    if (id == "divrname") {
      $("input[name=r_name]").prop('disabled', false);
    }

    if (id == "divurl") {
      $("textarea[name=url_link]").prop('disabled', false);
    }

  });
  $("form[name='editResource']").validate({
    rules: {
      r_type: {
        required: true
      },
      htmlcontentdes: {
        required: true
      },
      url_link: {
        required: true
      },


    },
    // Specify validation error messages
    messages: {
      u_name: "Please enter resource name",
      url_link: "Please Enter url",
      htmlcontentdes: "Please Enter resource description",

    }


  });
  $('#updateresource').on('click', function (e) {
    e.preventDefault();
    var html = document.getElementById("resourceDesData").innerHTML;
    var link = $('textarea#url_link').val();

    if (link != "") {

      var link_url = $(link).attr('src') ? $(link).attr('src') : false;
      if (!link_url) {
        var st=false;
        $.confirm({
          title: 'Alert!',
          content: 'Please Enter valid url!',
          buttons: {
            Done: function () {
              return;
            }

          }
        });

      }
    }
    if (link == "") {

      var link_url = "";
      var st=true;

    }


    if ($("form[name='editResource']").valid()  && st) {
      $(".loader-wrapper").removeClass('hide');
      var data = {
        'r_id': $('input[name=resource_id]').val(),
        'r_name': $('input[name=r_name]').val(),
        'r_des': html,
        'url_link': link_url,
        'file_id':$('input[name=file_id]').val(),
        _csrf: $('input[name=_csrf]').val(),
      };

      $.ajax({
        type: 'POST',
        url: '/resource/update',
        data: data,
        dataType: "json",
        success: function (status) {

          if (status.msg == 'error') {
            $(".loader-wrapper").addClass('hide');
            $.alert({
              title: 'Error',
              content: 'Data error!'
            });
            document.getElementById('createunits').reset();

          }
          if (status.msg == 'ok') {
            $(".loader-wrapper").addClass('hide');
            $.confirm({
              title: 'Success!',
              content: 'Resource Update successfully!',
              buttons: {
                Done: function () {
                  location.href = '/resource/init?auth=' + sessionStorage.getItem('token');
                }

              }
            });

          }

        }
      });


    }


  })


});
