$(document).ready(function () {

  var _submit = document.getElementById('uploadresources'),
    _file = document.getElementById('txtUploadFile'),
    _progress = document.getElementById('_progress');
  $(".js-example-basic-multiple").select2({
    placeholder: "Select a value"
  });
  $(".js-example-basic-single").select2();
  $(".addtag").click(function () {
    var oldVal = '';
    var newVal = prompt("Enter new value:", oldVal);
    if (newVal === "") {
      // user pressed OK, but the input field was empty
      console.log("Empty value");

    } else if (newVal) {
      var value = {

        'newtag': newVal,
        _csrf: $('input[name=_csrf]').val(),
      };
      $.ajax({
        type: 'POST',
        url: '/addresoursetag',
        data: value,
        dataType: "json",
        success: function (status) {
          if (status) {
            $("#r_tag").append("<option value=" + status['0']['st'] + ">" + status['0']['tname'] + "</option>");
          }


        }
      });
    } else {
      // user hit cancel
      console.log("cancel");
    }


  });
  $(".addhead").click(function () {

    var oldVal = '';
    var newVal = prompt("Enter new value:", oldVal);
    if (newVal === "") {
      // user pressed OK, but the input field was empty
      console.log("Empty value");

    } else if (newVal) {
      var value = {

        'newhead': newVal,
        _csrf: $('input[name=_csrf]').val(),
      };
      $.ajax({
        type: 'POST',
        url: '/addresoursehead',
        data: value,
        dataType: "json",
        success: function (status) {
          if (status) {
            $("#r_head").append("<option value=" + status['0']['st'] + ">" + status['0']['hname'] + "</option>");
          }


        }
      });
    } else {
      // user hit cancel
      // console.log("cancel");
    }


  });
  $('#sec_type').change(function () {

    var value = {

      'sec_type': $("#sec_type:optional").val(),
      _csrf: $('input[name=_csrf]').val(),
    };
    //alert(val);

    $.ajax({
      type: 'POST',
      url: '/resource_module_section',
      data: value,
      dataType: "json",
      success: function (status) {
        //  alert(status['0'].length);

        if (status['0'].length != 0) {
          $("#m_type").empty();
          $("#m_type").append(" <option value=''>Select Modules</option>");
          for (var i = 0; i < status['0'].length; i++) {
            $("#m_type").append("<option value=" + status['0'][i]['module_id'] + ">" + status['0'][i]['name'] + "</option>");
          }


        } else {
          $("#m_type").empty();
          $("#m_type").append(" <option value=''>No Current Modules</option>");
        }
      }
    });


  });
  $('#m_type').change(function () {

    var value = {
      'm_type': $("#m_type:optional").val(),
      _csrf: $('input[name=_csrf]').val(),
    };

    $.ajax({
      type: 'POST',
      url: '/initresourceunits',
      data: value,
      dataType: "json",
      success: function (status) {
        // alert(status['0'].length);

        if (status['0'].length != 0) {
          $("#mu_type").empty();
          $("#mu_type").append(" <option value=''>Select Unit</option>");
          for (var i = 0; i < status['0'].length; i++) {
            $("#mu_type").append("<option value=" + status['0'][i]['unit_id'] + ">" + status['0'][i]['unit_name'] + "</option>");
          }


        } else {
          $("#mu_type").empty();
          $("#mu_type").append(" <option value=''>No Current Unit</option>");
        }
      }
    });


  });
  $('#r_type').change(function () {
    var st;
    var r_type = $(this).attr('id');
    var r_type_val = $("#r_type:optional").val();
    switch (parseInt(r_type_val)) {
      case 1:
        st = false;
        break;
      case 2:
        st = false;
        break;
      case 3:
        st = true;
        break;
      case 4:
        st = true;
        break;
      case 5:
        st = false;
        break;
      case 6:
        st = true;
        break;
      case 7:
        st = true;
        break;
    }

    if (!st) {

      $('.fileUploadSec').addClass("hide");
      $('.fileUploadUrlSec').removeClass("hide");

    } else {

      $('.fileUploadUrlSec').addClass("hide");
      $('.fileUploadSec').removeClass("hide");


    }


  });
  $("form[name='uploadresourses']").validate({
    rules: {

      mu_type: {
        required: true
      },
      url_link: {
        required: true
      },
      /*r_type: {
       required: true
       },
       r_tag: {
       required: true
       },
       m_des: {
       required: true
       }
       */
    },
    // Specify validation error messages
    messages: {

      mu_type: "Please Select Unit",
      url_link: "Please insert Video(ifarme) Link",
      /* r_type: "Please Enter Recourse type",
       r_tag: "Please Select Tag",
       r_summ: "Please Enter Recourse summary",
       m_des: "Please Enter Recourse Name",*/

    }


  });
  var upload = function () {
    var st;
    var summery_length = document.getElementsByClassName("ng-invalid").length;
    if (summery_length == 0) {
      if ($("form[name='uploadresourses']").valid()) {
        $('#uploadresources').prop('disabled', true);
        switch (parseInt($('#r_type').val())) {
          case 1:
            st = false;
            break;
          case 2:
            st = false;
            break;
          case 3:
            st = true;
            break;
          case 4:
            st = true;
            break;
          case 5:
            st = false;
            break;
          case 6:
            st = true;
            break;
          case 7:
            st = true;
            break;

        }
        if (_file.files.length === 0 && st) {
          $.alert({
            title: 'Empty File!',
            content: 'Please attach the resources file !'
          });
          return
        }
        var html = document.getElementById("resourseSummeryData").innerHTML;
        var head = $('#r_head').val() != "" ? $('#r_head').val() : 9;
        var r_tag = $('#r_tag').val() != "" ? $('#r_tag').val() : null;
        var link = $('textarea#url_link').val();
        var link_url = $(link).attr('src');
        var data = new FormData();


        if (st) {

          data.append('resource', _file.files[0]);
          data.append('resLink', 0);

        } else {
          data.append('resource', 0);
          data.append('resLink', link_url);

        }
        data.append('uid', $('#mu_type').val());
        data.append('typeid', $('#r_type').val());
        data.append('tagid', r_tag);
        data.append('hedingid', head);
        data.append('summary', html);
        data.append('name', $('input[name=m_des]').val());
        data.append('token', sessionStorage.getItem('token_tmp'));
        data.append('id', sessionStorage.getItem('auth'));


        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState == 4) {
            try {
              var resp = JSON.parse(request.response);
            } catch (e) {
              var resp = {
                status: 'error',
                data: 'Unknown error occurred: [' + request.responseText + ']'
              };
            }
            // console.log(resp.status);

            var st = resp.status == 200 ? true : false;
            if (st) {
              $.confirm({
                title: 'Success',
                content: 'File Upload successfully!',
                buttons: {
                  OK: function () {
                    _progress.style.width = '0%';
                    location.href = '/resource/add?auth=' + sessionStorage.getItem('token');
                  }

                }
              });


            } else {
              $.confirm({
                title: 'Error',
                content: 'File Upload Fail Try again',
                buttons: {
                  OK: function () {
                    _progress.style.width = '0%';
                    location.href = '/resource/add?auth=' + sessionStorage.getItem('token');
                  }


                }
              });

            }

          }
        };

        request.upload.addEventListener('progress', function (e) {

          var width = e.loaded / e.total;
          _progress.style.width = width * 100 + '%';
          _progress.innerHTML = width * 100 + '%';


        }, false);

        request.open('POST', file_manager + '/files/resources');
        request.send(data);

      }
    }

    else{

      $.alert({
        title: 'Summery To Long!',
        content: 'Summary ( maximum (Characters:160))'
      });
      return



    }



  };



  _submit.addEventListener('click', upload);


});
