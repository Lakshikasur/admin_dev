$(document).ready(function () {

  var getDataCountRoute = '/prize_conf/count';
  var getDataRoute = '/prize_conf/get_prize_smry';
  $(function () {
    getDataCount(data, getDataCountRoute);
    $('#startdatepicker').datetimepicker({
      viewMode: 'days',
      format: 'YYYY-MM-DD'
    });
    $('#enddatepicker').datetimepicker({
      viewMode: 'days',
      format: 'YYYY-MM-DD'
    });
  });
  var data = {
    'auth': sessionStorage.getItem('auth'),
    _csrf: $('input[name=_csrf]').val(),
  };
  function getDataCount(data, route) {
    $.ajax({
      type: 'POST',
      url: route,
      data: data,
      dataType: "json",
      success: function (status) {
        var count = status['0']['data_count'];
        pagination(count);
      }
    });
  }
  function pagination(data) {
    var page = Math.ceil(data / 5);
    $('.sync-pagination').twbsPagination('destroy');
    $(".loader-wrapper").removeClass('hide');
    if (page > 1) {
      $('.sync-pagination').twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute);
        }
      });
    }  if (page == 1) {
      $('.sync-pagination').twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute);
        }
      });
    }

    if (page == 0) {
      $("#prize_conf_table").empty();
      $("#prize_conf_table").html('<tr><td>No Prize Config Available</td></tr>');
    }
  }
  function getData(page, route) {
    $.ajax({
      type: 'POST',
      url: route,
      data: page,
      dataType: "json",
      success: function (status) {
        $(".loader-wrapper").addClass('hide');
        var out_str = '';
        $("#prize_conf_table").empty();
        for (var i = 0; i < status.length; i++) {
          out_str += '<tr>';
          out_str += '<td>' + status[i].id;
          out_str += '</td>';
          out_str += '<td>' + status[i].config_name;
          out_str += '</td>';
          out_str += '<td>' + status[i].curriculum;
          out_str += '</td>';
          out_str += '<td>' + status[i].grade;
          out_str += '</td>';
          out_str += '<td>' + status[i].subject;
          out_str += '</td>';
          out_str += '<td>' + status[i].prize_type;
          out_str += '</td>';
          out_str += '<td>' + status[i].price_start_date;
          out_str += '</td>';
          out_str += '<td>' + status[i].price_end_date;
          out_str += '</td>';
          out_str += '<td>' + status[i].status;
          out_str += '</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Edit">';
          out_str += '<button class="btn btn-primary btn-xs upedit" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' + status[i].id + '" ';
          out_str += 'name="' + status[i].id + '" data-target="#edit"  id="' + status[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-pencil"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '</tr>';
        }
        $("#prize_conf_table").html(out_str);
        /*
         var package = status.package;
         var ptype = status.ptype;
         for (var i = 0; i < package.length; i++) {
         out_str += '<td class="hide">'+package[i].id+'</td>';
         out_str += '<td class="hide">'+package[i].id +'</td>';
         out_str += '<td>'+package[i].p_name+'</td>';
         out_str += '<td>'+package[i].c_name+'</td>';
         out_str += '<td>'+package[i].grade+'</td>';
         out_str += '<td>';
         out_str += '<p data-placement="top" data-toggle="tooltip" title="Edit">';
         out_str += '<button class="btn btn-primary btn-xs upedit" style="margin-top: 1px;" data-title="Edit" ';
         out_str += 'data-toggle="modal" id="' +package[i].id + '" ';
         out_str += 'name="' + package[i].id + '" data-target="#edit"  id="' + package[i].id + '" >';
         out_str += '<span class="glyphicon glyphicon-pencil"></span></button>';
         out_str += '</p>';
         out_str += '</td>';
         out_str += '<td>';
         out_str += '<p data-placement="top" data-toggle="tooltip" title="Delete">';
         out_str += '<button class="btn btn-danger btn-xs updelete" style="margin-top: 1px;" data-title="Edit" ';
         out_str += 'data-toggle="modal" id="' + package[i].id + '" ';
         out_str += 'name="' +package[i].id + '" data-target="#delete">';
         out_str += '<span class="glyphicon glyphicon-trash"></span></button>';
         out_str += '</p>';
         out_str += '</td>';
         out_str += '</tr>';
         }
         */
      }
    });
  }
  $('#sec_type').change(function() {
    var data = {
      'sec_type': $("#sec_type:optional").val(),
      'token': sessionStorage.getItem('token'),
      _csrf: $('input[name=_csrf]').val(),
    };
    $.ajax({
      type: 'POST',
      url: '/assessment/sectionData',
      data: data,
      dataType: "json",
      success: function(status) {
        $("#s_type").empty();
        if (status.s_id && status.s_name) {
          $("#s_type").append("<option value=" + status.s_id + ">" + status.s_name + "</option>");



        }

        else {
          $("#s_type").empty();
          $("#s_type").append("<option value=''>No Data Found</option>");
        }

      }






    });

  });
  $('.subjdivhide').hide();
  $('#prize_type').change(function () {
    $('.subjdivhide').hide();
    if ($("#prize_type:optional").val() == 'GRADE_PRIZE') {
      $('#pzsubject').hide();
    }
    if ($("#prize_type:optional").val() == 'SUBJECT_PRIZE') {
      $('#pzsubject').show();
    }
  });
  $("form[name='prizeconfigadd']").validate({
    rules: {
      sec_type: {
        required: true
      },
      prize_type: {
        required: true
      },
      pzconf_name:{
        required: true
      },
      st_date:{
        required: true
      },
      end_date:{
        required: true
      },



    },
    // Specify validation error messages
    messages: {
      sec_type: "Please Select Section name",
      prize_type: "Please Select prize type",
      pzconf_name: "Please Enter Config name",
      st_date: "Please Select start date",
      end_date: "Please Select end date"

    }


  });
  $('#confirmprize').on('click',function (e) {
     e.preventDefault();
    if ($("form[name='prizeconfigadd']").valid()) {
      if ($("#prize_type").val() == 'GRADE_PRIZE') {
        var data = {
          'sec_id': $("#sec_type").val(),
          'prize_type': $("#prize_type").val(),
          'pzconf_name': $("#pzconf_name").val(),
          'st_date': $("#st_date").val(),
          'end_date': $("#end_date").val(),
          'id': sessionStorage.getItem('auth'),
          _csrf: $('input[name=_csrf]').val(),
        };

      }
      if ($("#prize_type").val() == 'SUBJECT_PRIZE') {
        var data = {

          'sec_id': $("#sec_type").val(),
          'prize_type': $("#prize_type").val(),
          's_id': $("#s_type").val(),
          'pzconf_name': $("#pzconf_name").val(),
          'st_date': $("#st_date").val(),
          'end_date': $("#end_date").val(),
          'id': sessionStorage.getItem('auth'),
          _csrf: $('input[name=_csrf]').val(),

        };

      }
      $.ajax({
        type: 'POST',
        url: '/prize/configData',
        data: data,
        dataType: "json",
        success: function(status) {
          $('#error_section').hide();
          $('#error_quiz_type').hide();
          $('#error_no_of_q').hide();
          $('#error_subject').hide();
          $('#error_module').hide();

          if (status.section_id != undefined) {
            $('#error_section').html("<p class='error'>" + status.section_id + "</p>");
            $('#error_section').show();
          }
          if (status.quiz_type != undefined) {
            $('#error_quiz_type').html("<p class='error'>" + status.quiz_type + "</p>");
            $('#error_quiz_type').show();
          }
          if (status.no_of_q != undefined) {
            $('#error_no_of_q').html("<p class='error'>" + status.no_of_q + "</p>");
            $('#error_no_of_q').show();
          }
          if (status.subject_id != undefined) {
            $('#error_subject').html("<p class='error'>" + status.subject_id + "</p>");
            $('#error_subject').show();
          }
          if (status.module_id != undefined) {
            $('#error_module').html("<p class='error'>" + status.module_id + "</p>");
            $('#error_module').show();
          }

          if (status.msg=="ok") {
            $.confirm({
              title: 'Success!',
              content: 'Prize configuration Success',
              buttons: {
                Done: function() {
                  location.href = '/prize/prize_summery?auth=' + sessionStorage.getItem('token');
                }

              }
            });
          }
          if (status.msg=="Exits") {
            $.confirm({
              title: 'Exits!',
              content: 'Already Active Prize configuration Exits',
              buttons: {
                Done: function() {
                  location.href = '/prize_conf/add_new?auth=' + sessionStorage.getItem('token');
                }

              }
            });
          }
        }

      });

    }


  })


});
