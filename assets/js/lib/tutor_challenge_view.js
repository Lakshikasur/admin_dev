$(document).ready(function () {

  var getDataCountRoute = '/resource/tutor_challenge_mark/count';
  var getDataRoute = '/resource/tutor_challenge_mark/getPageData';

  function getDataCount(route, taget) {
    var target = taget;
    var data = {
      'sec_id': sessionStorage.getItem('sec_id'),
      _csrf: $('input[name=_csrf]').val(),
    };
    $.ajax({
      type: 'POST',
      url: route,
      data: data,
      dataType: "json",
      success: function (status) {
        var count = status['0']['data_count'];
        pagination(count, target);

      }

    });


  }
  function pagination(data, ul) {

    var page = Math.ceil(data / 5);
    var select_target = "." + ul;
    $(select_target).twbsPagination('destroy');

    $(".loader-wrapper").removeClass('hide');
    if (page == 1) {
      $(select_target).twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'sec_id': sessionStorage.getItem('sec_id'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute, ul);

        }
      });

    }
    if (page > 1) {

      $(select_target).twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'sec_id': sessionStorage.getItem('sec_id'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute, ul);
        }
      });

    }

    if (page == 0) {
      $('table #' + ul).empty();
      $('table #' + ul).append('<tr><td>No Marking Available</td></tr>');

    }

  }
  function getData(page, route, target) {
    $.ajax({
      type: 'POST',
      url: route,
      data: page,
      dataType: "json",
      success: function (status) {

        $(".loader-wrapper").addClass('hide');
        var tu_challenge = status;
        var out_str = '';
        $("#" + target).empty();
        for (var i = 0; i < tu_challenge.length; i++) {

          out_str += '<tr>';
          out_str += '<td data-value="' + tu_challenge[i].a_id + '" class="hide">' + tu_challenge[i].a_id + '</td>';
          out_str += '<td data-value="' + tu_challenge[i].question_id + '" class="hide">' + tu_challenge[i].question_id + '</td>';
          out_str += '<td data-value="' + tu_challenge[i].student_id + '"  width="30%" >' + tu_challenge[i].full_name + '</td>';
          out_str += '<td data-value="' + tu_challenge[i].unit_id + '" width="40%" >' + tu_challenge[i].name + '</td>';
          out_str += '<td data-value="' + tu_challenge[i].last_mod_date + '" width="20%" >' + tu_challenge[i].last_mod_date + '</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Mark">';
          out_str += '<button class="btn btn-primary btn-xs tu_mark" style="margin-top: 1px;" data-title="Mark" ';
          out_str += 'data-toggle="modal" id="' + tu_challenge[i].a_id + '" ';
          out_str += 'name="' + tu_challenge[i].student_id + '" data-target="#edit"  id="' + tu_challenge[i].student_id + '" >';
          out_str += '<span class="glyphicon glyphicon-ok"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '</tr>';

        }

        $("#" + target).html(out_str);


      }

    });

  };
  $('html').on('click', '.tu_confirm', function (e) {
    e.preventDefault();
    var tu_chid = $(this).attr('name');
    $.confirm({
      title: 'Confirm!',
      content: 'Are You want Confirm this Tutor Challenge!',
      buttons: {
        OK: function () {
          $(".loader-wrapper").removeClass('hide');
          var data = {
            'tu_chid': tu_chid,
            'token': sessionStorage.getItem('token'),
            _csrf: $('input[name=_csrf]').val()
          };
          $.ajax({
            type: 'POST',
            url: '/resource/tu_challengeConfirm',
            data: data,
            dataType: "json",
            success: function (status) {
              if (status.msg == "updated") {
                $.confirm({
                  title: 'Success!',
                  content: 'TutorChallenge Confirm successfully!',
                  buttons: {
                    Done: function () {
                      location.href = '/resource/tutorChallengeActive?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });


              }

            }
          });
        },
        NO: function () {
          $(".loader-wrapper").removeClass('hide');
          location.href = '/resource/tutorChallengeActive?auth=' + sessionStorage.getItem('token');
        }

      }
    });

  });
  $('[data-toggle="tab"]').click(function (e) {

      var $this = $(this),
      target = $this.attr('data-url');
      getDataCount(getDataCountRoute, target);


  });
  $('html').on('click', '.tu_mark', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var answer_id = currentRow.find("td:eq(0)").data('value');
    var question_id = currentRow.find("td:eq(1)").data('value');
    var student_id = currentRow.find("td:eq(2)").data('value');


    var data = {
      'a_id': answer_id,
      'tuch_qid': question_id,
      'st_id': student_id,
      _csrf: $('input[name=_csrf]').val(),

    };


    $.ajax({
      type: 'POST',
      url: "/resource/tutor_challenge_mark/getAnswerData",
      data: data,
      dataType: "json",
      success: function (status) {


        $(".loader-wrapper").addClass('hide');
        $('#tuchMarkModel').modal({
          backdrop: 'static',
          keyboard: false
        });

        $('input[name=a_id]').val(answer_id);
        $('input[name=st_id]').val(student_id);
        $('textarea[name=question]').val(status.question[0].question);
        $('textarea[name=tw_answer]').val(status.question[0].correct_answer);
        $('textarea[name=st_answer]').val(status.answer[0].answer);

        $('#tuchMarkModel').modal('show');


      }

    });


  });
  $("form[name='markTuchMarkModel']").validate({
    rules: {
      t_bonus: {
        required: true
      },


    },
    // Specify validation error messages
    messages: {

      t_bonus: "Please Select Mark",


    }


  });
  $('html').on('click', '#markTuCh', function (e) {
    e.preventDefault();

    if ($("form[name='markTuchMarkModel']").valid()) {

      var answer_id = $('input[name=a_id]').val();
      var student_id = $('input[name=st_id]').val();


      var data = {
        'a_id': answer_id,
        'st_id': student_id,
        'tu_id': sessionStorage.getItem('auth'),
        'marks': $("#t_bonus:optional").val(),
        _csrf: $('input[name=_csrf]').val(),

      };

      var star_data = {
        'marks': $("#t_bonus:optional").val(),
      };


      $.ajax({
        type: 'POST',
        url: "/resource/tutor_challenge_mark/addMark",
        data: data,
        dataType: "json",
        success: function (status) {
          if (status.msg = "UPDATED") {

            $(".loader-wrapper").addClass('hide');
            $("#marking_challenge_table_body").empty();
            $.confirm({
              title: 'Success!',
              content: 'Mark Add successfully!',
              buttons: {
                Done: function () {
                  $('#tuchMarkModel').modal('hide');
                  getDataCount(getDataCountRoute, 'marking_challenge_table_body');

                }

              }
            });
            /*   $.ajax({
             type: 'POST',
             url: student_portal_service+"/assesment/calcchallengestars",
             data: star_data,
             dataType: "json",
             success: function (status) {
             $(".loader-wrapper").addClass('hide');
             if(status.status){
             $.ajax({
             type: 'POST',
             url: "/resource/tutor_challenge_mark/addStar",
             data: status.data,
             dataType: "json",
             success: function (status) {
             $(".loader-wrapper").addClass('hide');
             if(status.status){


             alert()

             }



             }

             });

             }



             }

             });*/


          }


        }

      });

    }


  });


});
