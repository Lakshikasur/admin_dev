$(document).ready(function () {

  var getDataCountRoute = '/resource/tutor_challenge/count';
  var getDataRoute = '/resource/tutor_challenge/getPageData';


  function getDataCount(route, taget) {
    var target = taget;
    var data = {
      'token': sessionStorage.getItem('token'),
      _csrf: $('input[name=_csrf]').val(),
    };
    $.ajax({
      type: 'POST',
      url: route,
      data: data,
      dataType: "json",
      success: function (status) {
        var count = status['0']['data_count'];
        pagination(count,target);

      }

    });


  }
  getDataCount(getDataCountRoute, 'non_active_table_body');
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
            'auth': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute, ul );

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
            'auth': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute,ul);
        }
      });

    }

    if (page == 0) {

      $('table #' + ul).append('<tr><td>No Resource In this unit</td></tr>');

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
        var tu_challenge = status.tu_challenge;
        var out_str = '';
        $("#"+target).empty();
        for (var i = 0; i < tu_challenge.length; i++) {

          out_str += '<tr>';
          out_str += '<td data-value="'+tu_challenge[i].id+'" class="hide">'+tu_challenge[i].id+'</td>';
          out_str += '<td data-value="'+tu_challenge[i].unit_id+'"  width="40%" >'+tu_challenge[i].name+'</td>';
          out_str += '<td data-value="'+tu_challenge[i].student_limit+'" width="10%" >'+tu_challenge[i].student_limit+'</td>';
          out_str += '<td data-value="'+tu_challenge[i].answer_word_limit+'" width="10%" >'+tu_challenge[i].answer_word_limit+'</td>';
          out_str += '<td data-value="'+tu_challenge[i].created_date+'" width="20%" >'+tu_challenge[i].created_date+'</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Confirm">';
          out_str += '<button class="btn btn-primary btn-xs tu_confirm" style="margin-top: 1px;" data-title="Confirm" ';
          out_str += 'data-toggle="modal" id="' +tu_challenge[i].id + '" ';
          out_str += 'name="' + tu_challenge[i].id + '" data-target="#edit"  id="' + tu_challenge[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-ok"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Edit">';
          out_str += '<button class="btn btn-primary btn-xs usedit" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' +tu_challenge[i].id + '" ';
          out_str += 'name="' + tu_challenge[i].id + '" data-target="#edit"  id="' + tu_challenge[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-pencil"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Delete">';
          out_str += '<button class="btn btn-danger btn-xs tu_delete" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' + tu_challenge[i].id + '" ';
          out_str += 'name="' +tu_challenge[i].id + '" data-target="#delete">';
          out_str += '<span class="glyphicon glyphicon-trash"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '</tr>';

        }

        $("#"+target).html(out_str);


      }

    });

  };
  $('html').on('click','.tu_confirm',function (e) {
      e.preventDefault();
     var tu_chid = $(this).attr('name');
     $.confirm({
      title: 'Confirm!',
      content: 'Are You want Confirm this Tutor Challenge!',
      buttons: {
        OK: function() {
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
            success: function(status) {
              if (status.msg=="updated") {
                $.confirm({
                  title: 'Success!',
                  content: 'TutorChallenge Confirm successfully!',
                  buttons: {
                    Done: function() {
                      location.href = '/resource/tutorChallengeActive?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });


              }

            }
          });
        },
        NO: function() {
          $(".loader-wrapper").removeClass('hide');
          location.href = '/resource/tutorChallengeActive?auth=' + sessionStorage.getItem('token');
        }

      }
    });

  });
  $('html').on('click','.tu_delete',function (e) {
    e.preventDefault();
    var tu_chid = $(this).attr('name');
    $.confirm({
      title: 'Delete!',
      content: 'Are You want Delete this Tutor Challenge!',
      buttons: {
        OK: function() {
          $(".loader-wrapper").removeClass('hide');
          var data = {
            'tu_chid': tu_chid,
            'token': sessionStorage.getItem('token'),
            _csrf: $('input[name=_csrf]').val()
          };
          $.ajax({
            type: 'POST',
            url: '/resource/tu_challengeDelete',
            data: data,
            dataType: "json",
            success: function(status) {
              if (status.msg=="updated") {
                $.confirm({
                  title: 'Success!',
                  content: 'TutorChallenge Confirm successfully!',
                  buttons: {
                    Done: function() {
                      location.href = '/resource/tutorChallengeActive?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });


              }

            }
          });
        },
        NO: function() {
          $(".loader-wrapper").removeClass('hide');
          location.href = '/resource/tutorChallengeActive?auth=' + sessionStorage.getItem('token');
        }

      }
    });

  });


});
