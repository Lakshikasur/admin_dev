$(document).ready(function () {
  var _submit = document.getElementById('uploadresources'),
    _file = document.getElementById('txtUploadFile'),
    _progress = document.getElementById('_progress');



    $('#startdatepicker').datetimepicker({
      viewMode: 'days',
      format: 'YYYY-MM-DD'
    });
    $('#enddatepicker').datetimepicker({
      viewMode: 'days',
      format: 'YYYY-MM-DD'
    });


  $(function () {
   // $('#startdatepicker').datetimepicker();
    //$('#enddatepicker').datetimepicker();

    



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
  $('select[name=mu_type]').on('change',function () {

    var value = {
      'unit_id': $("#mu_type:optional").val(),
      _csrf: $('input[name=_csrf]').val(),
    };

    $.ajax({
      type: 'POST',
      url: '/checkUnitTuChallenge',
      data: value,
      dataType: "json",
      success: function (status) {

        if(status.msg=="AVAILABLE"){

          $.alert({
            title: 'Alert!',
            content: 'Already This Unit has Tutor Challenge !'
          });
        }

        else{


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
      case 8:
        st = true;
    }

    if (!st) {

      $('.fileUploadSec').addClass("hide");
      $('.fileUploadUrlSec').removeClass("hide");

    } else {

      $('.fileUploadUrlSec').addClass("hide");
      $('.fileUploadSec').removeClass("hide");


    }


  });
  $("form[name='createTutorChallange']").validate({
    rules: {

      mu_type: {
        required: true
      },
      st_limit: {
        required: true
      },

      w_count: {
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
      st_limit: "Please Select Student Limit",
      w_count: "Please Select Word Limit",
      /* r_type: "Please Enter Recourse type",
       r_tag: "Please Select Tag",
       r_summ: "Please Enter Recourse summary",
       m_des: "Please Enter Recourse Name",*/

    }


  });
  var upload = function () {
    var st;


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
      case 8:
        st = true;
    }

    var r_tag = $('#r_tag').val() != "" ? $('#r_tag').val() : null;
    var link = $('textarea#url_link').val();
    var link_url = $(link).attr('src');
    var resource_type = $('#r_type').val();
    var tu_res_name = $('input[name=tu_res_name]').val();
    var data = new FormData();


    if (_file.files.length === 0 && st) {
      $('#uploadresources').prop('disabled', false);
      $.alert({
        title: 'Empty File!',
        content: 'Please attach the resources file !'
      });
      return
    }

    if (_file.files.length !== 0 && st && tu_res_name === "") {
      $('#uploadresources').prop('disabled', false);
      $.alert({
        title: 'Empty Resource Name !',
        content: 'Please Enter Resource Name !'
      });
      return
    }

    if (link === "" && !st) {
      $('#uploadresources').prop('disabled', false);
      $.alert({
        title: 'Empty Video Url!',
        content: 'Please enter the video url !'
      });
      return
    }

    if (resource_type === "" && !st) {
      $('#uploadresources').prop('disabled', false);
      $.alert({
        title: 'Empty Resource type !',
        content: 'Please select Resource type !'
      });
      return
    }

    if (tu_res_name === "" && !st) {
      $('#uploadresources').prop('disabled', false);
      $.alert({
        title: 'Empty Resource Name !',
        content: 'Please Enter Resource Name !'
      });
      return
    }


    if (st) {

      data.append("resource", _file.files[0]);
      data.append('_csrf', $('input[name=_csrf]').val());
      data.append('resLink', 0);

    } else {
      data.append('resource', 0);
      data.append('resLink', link_url);

    }
    data.append('resourceTypeID', resource_type);
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

          _progress.style.width = '0%';
          $('#uploadresources').prop('disabled', false);
          $('#tu_res_name').val("");
          $('#r_type').val("");
          $('#url_link').val("");
          _progress.innerHTML = "";
          $("input[name=UploadFile]").val('');
          $('<li />').text(tu_res_name).appendTo($('div#resoursePrview ul'));
          $('div#resoursePrview_hide').append('<ul class="hide_inputs hide" ><li>' + resp.fileID + '<li/></ul>');
          $('div#resourseType_hide').append('<ul class="hide_typeinputs hide" ><li>' + resource_type + '<li/></ul>');
          $('div#resourseName_hide').append('<ul class="hide_typeName hide" ><li>' + tu_res_name + '<li/></ul>');
          $('<span />').addClass('filesize').text('(' + 'File ID' + ')').appendTo($('div#resoursePrview ul li:last'));


        } else {


        }

      }
    };

    request.upload.addEventListener('progress', function (e) {
      var width = e.loaded / e.total;
      _progress.style.width = width * 100 + '%';
      _progress.innerHTML = width * 100 + '%';


    }, false);

    request.open('POST', file_manager + '/files/resources/tutor_challange', true);
    request.send(data);


  };
  $('#tutor_challange_add').on('click', function () {

    if ($("form[name='createTutorChallange']").valid()) {

      var question = document.getElementById("challengeQuestion").innerHTML;
      var answer = document.getElementById("challengeAnswer").innerHTML;

      var fileIDArray = [];
      var fileNameArray = [];
      var resourceTypeArray = [];

      $('.hide_inputs').each(function () {
        var phrase = '';
        $(this).find('li').each(function () {
          var current = $(this);
          if (current.children().size() > 0) {
            return true;
          }
          phrase += $(this).text();
        });
        fileIDArray.push(phrase);
      });

      $('.hide_typeinputs').each(function () {
        var phrase1 = '';
        $(this).find('li').each(function () {
          var current = $(this);
          if (current.children().size() > 0) {
            return true;
          }
          phrase1 += $(this).text();
        });
        resourceTypeArray.push(phrase1);
      });

      $('.hide_typeName').each(function () {
        var phrase2 = '';
        $(this).find('li').each(function () {
          var current = $(this);
          if (current.children().size() > 0) {
            return true;
          }
          phrase2 += $(this).text();
        });
        fileNameArray.push(phrase2);
      });

      if (question.length === 0) {

        $.alert({
          title: 'Empty Challenge Question Field!',
          content: 'Please enter Challenge Question !'
        });
        return
      }

      if (answer.length === 0) {

        $.alert({
          title: 'Empty Challenge Answer Field!',
          content: 'Please enter Challenge Question Answer !'
        });
        return
      }

      if (fileIDArray.length === 0 && resourceTypeArray.length === 0) {

        $.alert({
          title: 'Empty Challenge Reference!',
          content: 'Please enter Challenge Reference resources!'
        });
        return
      }

      alert($("#st_date").val());
      alert($("#end_date").val());

      var data = {

        'u_id': $("#mu_type:optional").val(),
        'st_limit': $("#st_limit:optional").val(),
        'word_count': $("#w_count:optional").val(),
        'tu_ch_ques': question,
        'tu_ch_answer': answer,
        'tu_id': sessionStorage.getItem('auth'),
        'file_id': fileIDArray,
        'type_id': resourceTypeArray,
        'file_name': fileNameArray,
        _csrf: $('input[name=_csrf]').val(),
       // st_date: $("#startdatepicker").val(),
        //end_date: $("#enddatepicker").val(),
      };

      $.ajax({
        type: 'POST',
        url: '/resource/tutorChallengeAdd',
        data: data,
        dataType: "json",
        success: function (status) {

          if (status.msg == 'ok') {
            $(".loader-wrapper").addClass('hide');
            $.confirm({
              title: 'Success',
              content: 'Data insert successfully!',
              buttons: {
                Done: function () {
                  location.href = '/resource/addtutorChallenge?auth=' + sessionStorage.getItem('token');
                }

              }
            });

          }
       /*   if (status.msg == 'AVAILABLE') {

            $.confirm({
              title: 'Error',
              content: 'Unit Already has TutorChallenge!',
              buttons: {
                Done: function () {
                  location.href = '/resource/addtutorChallenge?auth=' + sessionStorage.getItem('token');
                }

              }
            });

          }*/
        }
      });

    }


  });
  _submit.addEventListener('click', upload);

});
