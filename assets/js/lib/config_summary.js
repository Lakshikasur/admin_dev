$(document).ready(function() {

      var getDataCountRoute = '/assessment/quizConfirm/count';
      var getDataRoute = '/assessment/quizConfirm/getPageData';
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
     getDataCount(data, getDataCountRoute);
     function pagination(data) {

      var page = Math.ceil(data / 5);
      $(".loader-wrapper").removeClass('hide');
      if (page < 2) {
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
      else {

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

    }
     function getData(page, route) {

      $.ajax({
        type: 'POST',
        url: route,
        data: page,
        dataType: "json",
        success: function (status) {
          $(".loader-wrapper").addClass('hide');
          var question = status.question;
          var out_str = '';


          $("#quiz_confirm_table_data").empty();
          for (var i = 0; i < question.length; i++) {

            out_str += '<tr>';
            out_str += '<td data-value="'+question[i].id+'" class="hide">'+question[i].id+'</td>';
            out_str += '<td data-value="'+question[i].curriculum+'">'+question[i].curriculum+'</td>';
            out_str += '<td data-value="'+question[i].module+'"  >'+question[i].module+'</td>';
            out_str += '<td data-value="'+question[i].unit+'"  >'+question[i].unit+'</td>';
            out_str += '<td data-value="'+question[i].subject+'"  >'+question[i].subject+'</td>';
            out_str += '<td data-value="'+question[i].style+'" width="30%" >'+question[i].style+'</td>';
            out_str += '<td>';
            out_str += '<p data-placement="top" data-toggle="tooltip" title="View">';
            out_str += '<button class="btn btn-primary btn-xs qview" style="margin-top: 1px;" data-title="View" ';
            out_str += 'data-toggle="modal" id="' +question[i].id + '" ';
            out_str += 'name="' + question[i].id + '" data-target="#edit"  id="' + question[i].id + '" >';
            out_str += '<span class="glyphicon glyphicon-eye-open"></span></button>';
            out_str += '</p>';
            out_str += '</td>';
            out_str += '<td>';
            out_str += '<p data-placement="top" data-toggle="tooltip" title="Confirm">';
            out_str += '<button class="btn btn-primary btn-xs qconfirm" style="margin-top: 1px;" data-title="Confirm" ';
            out_str += 'data-toggle="modal" id="' + question[i].id + '" ';
            out_str += 'name="' +question[i].id + '" data-target="#delete">';
            out_str += '<span class="glyphicon glyphicon-ok"></span></button>';
            out_str += '</p>';
            out_str += '</td>';
            out_str += '</tr>';


          }

          $("#quiz_confirm_table_data").html(out_str);

        }

      });

    }

    $('#sel_grade').change(function() {
        var fltr_data = {
            'c_id': $("#sel_qcurriculum").val(),
            'g_id': $("#sel_grade:optional").val(),
            _csrf: $('input[name=_csrf]').val(),
        };
        $.ajax({
            type: 'POST',
            url: '/assessment/subjectinit',
            data: fltr_data,
            dataType: "json",
            success: function(status) {
                $("#sel_subject").empty();
                if (status.length != 0) {
                    $("#sel_subject").append("<option value=''>Select Subjects</option>");
                    for (var i = 0; i < status.length; i++) {
                        $("#sel_subject").append("<option value=" + status[i]['id'] + ">" + status[i]['name'] + "</option>");
                    }
                }

                if (status.length == 0) {
                    $("#sel_subject").append("<option value=''>No Data Found</option>");
                }
            }
        });

    });
    $('#sel_qsection').change(function(e) {
        e.preventDefault();
        var sec_id = $("#sel_qsection").val();
        getQuizData(sec_id);


    });
    $('html').on('click','.qconfirm',function (e) {

        var qid = $(this).attr('name');
        $.confirm({
            title: 'Confirm!',
            content: 'Are You want Confirm the Question!',
            buttons: {
                OK: function() {
                    $(".loader-wrapper").removeClass('hide');
                    var data = {
                        'qid': qid,
                        'token': sessionStorage.getItem('token'),
                        _csrf: $('input[name=_csrf]').val()
                    };
                    $.ajax({
                        type: 'POST',
                        url: '/assessment/quesConfirm',
                        data: data,
                        dataType: "json",
                        success: function(status) {
                            if (status) {
                                $.confirm({
                                    title: 'Success!',
                                    content: 'Question Confirm successfully!',
                                    buttons: {
                                        Done: function() {
                                            location.href = '/assessment/init?auth=' + sessionStorage.getItem('token');
                                        }

                                    }
                                });


                            }

                        }
                    });
                },
                NO: function() {
                    $(".loader-wrapper").removeClass('hide');
                    location.href = '/assessment/init?auth=' + sessionStorage.getItem('token');
                }

            }
        });


    });
    $('.qview').click(function(e) {
        e.preventDefault();
        var qid = $(this).attr('name');
        $('#questionViewModel').modal('show');


    });
    $(document).on('click', '.quizedit', function(e) {
        e.preventDefault();
        var $form = $('form[name="editQuiz"]');
        $form.validate().resetForm();
        $form.find('.error').removeClass('error');

        var currentRow = $(this).closest("tr");
        var test_type = currentRow.find("td:eq(0)").data('value');
        var subject = currentRow.find("td:eq(1)").data('value');
        var module = currentRow.find("td:eq(2)").data('value');
        var amount = currentRow.find("td:eq(3)").data('value');
        var quiz_duration = currentRow.find("td:eq(4)").data('value');
        var time_bonus = currentRow.find("td:eq(5)").data('value');
        var curriculum_id = currentRow.find("td:eq(8)").data('value');
        var subject_id = currentRow.find("td:eq(9)").data('value');
        var module_id = currentRow.find("td:eq(10)").data('value');
        var sec_type = $('select[name=sel_qsection]').val();


        $("#q_amount").prop('disabled', true);
        $("#s_time").prop('disabled', true);
        $("#t_bonus").prop('disabled', true);

        $("#qiz_type").empty();
        $("#qiz_type").append("<option value=" + test_type + ">" + test_type + "</option>");
        $("#s_type").empty();
        $("#s_type").append("<option value=" + test_type + ">" + subject + "</option>");

        if (module != "") {
            $("#qmodule").removeClass('hide');
            $("#m_type").empty();
            $("#m_type").append("<option value=" + module + ">" + module + "</option>");

        }

        if (module == "") {
            $("#m_type").empty();
            $("#qmodule").addClass('hide');


        }
        $("#q_amount").empty();
        $("#q_amount").append("<option value=" + amount + ">" + amount + "</option>");
        $("#s_time").empty();
        $("#s_time").append("<option value=" + quiz_duration + ">" + quiz_duration + "</option>");
        $("#t_bonus").empty();
        $("#t_bonus").append("<option value=" + time_bonus + ">" + time_bonus + "</option>");

        $('input[name=curr_id]').val(curriculum_id);
        $('input[name=sub_id]').val(subject_id);
        $('input[name=module_id]').val(module_id);
        $('input[name=test_type]').val(test_type);
        $('input[name=sec_type]').val(sec_type);
        $(".loader-wrapper").addClass('hide');
        $('#quizEditModel').modal('show');

    });
    $(document).on('click', '.quizdelete', function(e) {
        e.preventDefault();
        var quiz_id = $(this).attr('name');
        var currentRow = $(this).closest("tr");
        var test_type = currentRow.find("td:eq(0)").data('value');
        var curriculum_id = currentRow.find("td:eq(8)").data('value');
        var subject_id = currentRow.find("td:eq(9)").data('value');
        var module_id = currentRow.find("td:eq(10)").data('value');
        var sec_type = $('select[name=sel_qsection]').val();
        var data = {
            curriculum_id: curriculum_id,
            subject_id: subject_id,
            module_id: module_id,
            token: sessionStorage.getItem('token'),
            test_type: test_type,
            _csrf: $('input[name=_csrf]').val()

        };
        $.confirm({
            title: 'Delete!',
            content: 'Are You want Remove the Quiz!',
            buttons: {
                OK: function() {
                    $(".loader-wrapper").removeClass('hide');
                    $.ajax({
                        type: 'POST',
                        url: '/assessment/deleteQuizTypeData',
                        data: data,
                        dataType: "json",
                        success: function(status) {
                            if (status.data == "success") {
                                $(".loader-wrapper").addClass('hide');
                                $.confirm({
                                    title: 'Success!',
                                    content: 'Quiz delete successfully!',
                                    buttons: {
                                        Done: function() {
                                            getQuizData(sec_type);
                                        }

                                    }
                                });

                            }

                        }
                    });
                },
                NO: function() {
                    $(".loader-wrapper").removeClass('hide');
                    location.href = '/assessment/init?auth=' + sessionStorage.getItem('token') + '#/configuration';
                }

            }
        });

    });
    $('.glyphicon-remove-circle').click(function(e) {
        e.preventDefault();

        var id = $(this).closest('.editquizmodal').attr('id');
        if (id == "divq_amount") {
            $("#q_amount").empty();
            $("#q_amount").prop('disabled', false);
            $("#q_amount").append('<option value="">Select Question Amount</option>');
            $("#q_amount").append('<option value="5">05</option>');
            $("#q_amount").append('<option value="10">10</option>');
            $("#q_amount").append('<option value="15">15</option>');
            $("#q_amount").append('<option value="20">20</option>');
            $("#q_amount").append('<option value="25">25</option>');
            $("#q_amount").append('<option value="30">30</option>');
            $("#q_amount").append('<option value="35">35</option>');
            $("#q_amount").append('<option value="40">40</option>');
            $("#q_amount").append('<option value="45">45</option>');
            $("#q_amount").append('<option value="50">50</option>');

        }
        if (id == "divs_time") {
            $("#s_time").empty();
            $("#s_time").prop('disabled', false);
            $("#s_time").append('<option value="">Select Time(Min)</option>');
            $("#s_time").append('<option value="00:05:00">05(Min)</option>');
            $("#s_time").append('<option value="00:10:00">10(Min)</option>');
            $("#s_time").append('<option value="00:15:00">15(Min)</option>');
            $("#s_time").append('<option value="00:20:00">20(Min)</option>');
            $("#s_time").append('<option value="00:25:00">25(Min)</option>');
            $("#s_time").append('<option value="00:30:00">30(Min)</option>');
            $("#s_time").append('<option value="00:35:00">35(Min)</option>');
            $("#s_time").append('<option value="00:40:00">40(Min)</option>');
            $("#s_time").append('<option value="00:45:00">45(Min)</option>');
            $("#s_time").append('<option value="00:50:00">50(Min)</option>');
            $("#s_time").append('<option value="00:55:00">55(Min)</option>');
            $("#s_time").append('<option value="01:00:00">60(Min)</option>');

        }
        if (id == "divt_bonus") {
            $("#t_bonus").empty();
            $("#t_bonus").prop('disabled', false);
            $("#t_bonus").append('<option value="">Select Time(Min)</option>');
            $("#t_bonus").append('<option value="05:00">05(Min)</option>');
            $("#t_bonus").append('<option value="10:00">10(Min)</option>');
            $("#t_bonus").append('<option value="15:00">15(Min)</option>');
            $("#t_bonus").append('<option value="20:00">20(Min)</option>');
            $("#t_bonus").append('<option value="25:00">25(Min)</option>');
            $("#t_bonus").append('<option value="30:00">30(Min)</option>');
            $("#t_bonus").append('<option value="35:00">35(Min)</option>');
            $("#t_bonus").append('<option value="40:00">40(Min)</option>');
            $("#t_bonus").append('<option value="45:00">45(Min)</option>');
            $("#t_bonus").append('<option value="50:00">50(Min)</option>');
            $("#t_bonus").append('<option value="55:00">55(Min)</option>');


        }


    });
    $("form[name='editQuiz']").validate({
        rules: {

            qiz_type: {
                required: true
            },
            s_id: {
                required: true
            },
            q_amount: {
                required: true
            },
            s_time: {
                required: true
            },
            t_bonus: {
                required: true
            }


        },
        // Specify validation error messages
        messages: {
            qiz_type: "Please Select Test Type",
            s_id: "Please Select Subject",
            q_amount: "Please Enter Number Of Question",
            s_time: "Please Enter Schedule Time Correctly",
            t_bonus: "Please Enter Time Bonus Correctly",

        }


    });
    $('#updatequiz').click(function() {
        if ($("form[name='editQuiz']").valid()) {
            var curriculum_id = $('input[name=curr_id]').val();
            var subject_id = $('input[name=sub_id]').val();
            var module_id = $('input[name=module_id]').val();
            var sec_id = $('input[name=sec_type]').val();
            var data = {
                curriculum_id: curriculum_id,
                subject_id: subject_id,
                module_id: module_id,
                q_amount: $('select[name=q_amount]').val(),
                s_time: $('select[name=s_time]').val(),
                t_bonus: $('select[name=t_bonus]').val(),
                token: sessionStorage.getItem('token'),
                test_type: $('input[name=test_type]').val(),
                _csrf: $('input[name=_csrf]').val(),

            };

            $.ajax({
                type: 'POST',
                url: '/assessment/getQuizTypeEditData',
                data: data,
                dataType: "json",
                success: function(status) {

                    if (status.data == "success") {
                        $.confirm({
                            title: 'Success!',
                            content: 'Quiz Update successfully!',
                            buttons: {
                                Done: function() {

                                    getQuizData(sec_id);
                                    var $form = $('form[name="editQuiz"]');
                                    $('#quizEditModel').modal('hide');
                                    $form.validate().resetForm();
                                }

                            }
                        });


                    }

                }
            });

        }
    });
    var getQuizData = function(section) {
        var fltr_data = {
            'sec_type': section,
            _csrf: $('input[name=_csrf]').val(),
        };
        $.ajax({
            type: 'POST',
            url: '/assessment/filter_qConfig',
            data: fltr_data,
            dataType: "json",
            success: function(cnf_data) {
                $('#qconfigtable').remove();
                var cnf_data2 = $.map(cnf_data.data, function(value, index) {
                    return [value];
                });
                out_str = '';
                out_str += '<table id="qconfigtable" class="table table-bordred table-striped"><thead>';
                out_str += '<th>Test Type</th>';
                out_str += '<th>subject</th>';
                out_str += '<th>Module</th>';
                out_str += '<th>No of questions</th>';
                out_str += '<th>Test Duration</th>';
                out_str += '<th>Time Bonus</th>';
                out_str += '<th>Created Date</th>';
                out_str += '<th>Created By</th>';
                out_str += '<th>Edit</th>';
                out_str += '<th>Delete</th>';
                out_str += '</thead>';
                out_str += '<tbody>';

                if (cnf_data2.length > 0) {
                    for (var i = 0; i < cnf_data2.length; i++) {
                        out_str += '<tr>';
                        out_str += '<td data-value="' + cnf_data2[i]["quiz_type"] + '">' + cnf_data2[i]["test_type"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["subject"] + '">' + cnf_data2[i]["subject"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["module_name"] + '">' + cnf_data2[i]["module_name"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["num_of_ques"] + '">' + cnf_data2[i]["num_of_ques"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["schedule_time"] + '">' + cnf_data2[i]["schedule_time"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["time_bonus"] + '">' + cnf_data2[i]["time_bonus"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["created_date"] + '">' + cnf_data2[i]["created_date"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["created_by"] + '">' + cnf_data2[i]["created_by"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["curriculum_id"] + '" class="hide">' + cnf_data2[i]["curriculum_id"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["subject_id"] + '" class="hide">' + cnf_data2[i]["subject_id"] + '</td>';
                        out_str += '<td data-value="' + cnf_data2[i]["module_id"] + '" class="hide">' + cnf_data2[i]["module_id"] + '</td>';
                        out_str += '<td><p data-placement="top" data-toggle="tooltip" title="Edit"> <button class="btn btn-primary btn-xs quizedit" style="margin-top: 1px;" data-title="view" data-toggle="modal" name="" data-target="#Edit"><span class="glyphicon glyphicon-pencil"></span></button></p></td>';
                        out_str += '<td><p data-placement="top" data-toggle="tooltip" title="Delete"> <button class="btn btn-danger btn-xs quizdelete" style="margin-top: 1px;" data-title="view" data-toggle="modal" name="" data-target="#Delete"><span class="glyphicon glyphicon-trash"></span></button></p></td>';
                        out_str += '</tr>';
                    }
                } else {
                    out_str += '<tr>';
                    out_str += '<td>No Records Found!</td>';
                    out_str += '</tr>';
                }
                out_str += '</tbody>';
                out_str += '</table>';
                $("#div_qconfigtable").append(out_str);
            }
        });
    }
    $('html').on('click','.confirmAll',function (e) {
      e.preventDefault();
      var data = {
        'token':  sessionStorage.getItem('token'),
        _csrf: $('input[name=_csrf]').val(),
      };

      $.confirm({
        title: 'Confirm!',
        content: 'Are You want Confirm All this Resource!',
        buttons: {
          OK: function () {
            $(".loader-wrapper").removeClass('hide');
            $.ajax({
              type: 'POST',
              url: '/assessment/questionConfirmAll',
              data: data,
              dataType: "json",
              success: function (status) {
                if (status.msg == "updated") {
                  $(".loader-wrapper").addClass('hide');
                  $.confirm({
                    title: 'Success!',
                    content: 'Question Confirm successfully!',
                    buttons: {
                      Done: function () {
                        location.href = '/assessment/init?auth=' + sessionStorage.getItem('token');
                      }

                    }
                  });


                }


              }

            });
          },
          NO: function () {
            $(".loader-wrapper").removeClass('hide');
            location.href = '/initResourceConfirm?auth=' + sessionStorage.getItem('token');
          }

        }
      });

    });





});
