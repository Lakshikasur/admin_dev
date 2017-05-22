$(document).ready(function() {

    $(".js-example-basic-multiple").select2({
        placeholder: "Select a subjects",
    });
    var getDataCountRoute = '/package/count';
    var getDataRoute = '/package/getPageData';
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
      if (page == 1) {
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
      if(page>1) {

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
      if(page==0) {

        $("#package_table_data").empty();
        $("#package_table_data").html('<tr><td>No any Packages Available</td></tr>');

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
          var package = status.package;
          var ptype = status.ptype;
          var out_str = '';


          $("#package_table_data").empty();
          for (var i = 0; i < package.length; i++) {

            out_str += '<tr>';
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

          $("#package_table_data").html(out_str);

        }

      });

    }
    $('html').on('click','.upedit',function(e) {
        e.preventDefault();
        var packageid = $(this).attr('id');
        var data = {
            'pid': $(this).attr('id'),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.ajax({
            type: 'POST',
            url: '/getEditPackageData',
            data: data,
            dataType: "json",
            success: function(status) {

                if (status) {

                    $("#p_name").empty();
                    $('input[name=p_name]').val(status.pgdata['0'].package_name);
                    $("#c_type").empty();
                    $("#c_type").append("<option value=" + status.pgdata['0'].curriculum_id + ">" + status.pgdata['0'].curriculum_name + "</option>");
                    $("#g_type").empty();
                    $("#g_type").append("<option value=" + status.pgdata['0'].grade_id + ">" + status.pgdata['0'].grade_name + "</option>");
                    $("#subject_modal").empty();
                    for (var i = 0; i < status.psubject.length; i++) {
                        $("#subject_modal").append("<option value=" + status.psubject[i].subject_id + " selected>" + status.psubject[i].subject_name + "</option>");
                    }

                    $('input[name=monthly]').empty();
                    $('input[name=monthly]').val(status.pricetype[0].price);
                    $('input[name=termly]').empty();
                    $('input[name=termly]').val(status.pricetype[1].price);
                    $('input[name=annually]').empty();
                    $('input[name=annually]').val(status.pricetype[2].price);
                    $('input[name=package_id]').val(packageid);
                    localStorage.setItem('currculluarry', JSON.stringify(status.curriculum));
                    localStorage.setItem('gradearry', JSON.stringify(status.grade));
                    localStorage.setItem('subjectarray', JSON.stringify(status.subjects));
                    localStorage.setItem('currentsubjectarray', JSON.stringify(status.psubject));
                    $('#packagemodel').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                   $('#packagemodel').modal('show');

                    $(".currency").prop('disabled', true);


                }

            }

        });


        //$('#packagemodel').modal('show');

    });
    $('html').on('click','.updelete',function(e) {
        e.preventDefault();
        var packageid = $(this).attr('id');
        var data = {
            'pid': $(this).attr('id'),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.confirm({
            title: 'Delete!',
            content: 'Are You want Remove the Package!',
            buttons: {
                OK: function() {
                    $(".loader-wrapper").removeClass('hide');
                    $.ajax({
                        type: 'POST',
                        url: '/deletePackageData',
                        data: data,
                        dataType: "json",
                        success: function(status) {
                            if (status.msg == "Success") {
                                $(".loader-wrapper").addClass('hide');
                                $.confirm({
                                    title: 'Success!',
                                    content: 'Package delete successfully!',
                                    buttons: {
                                        Done: function() {
                                            location.href = '/package/init?auth=' + sessionStorage.getItem('token');
                                        }

                                    }
                                });


                            }


                        }

                    });
                },
                Cancel: function() {
                $(".loader-wrapper").removeClass('hide');
                  location.href = '/package/init?auth=' + sessionStorage.getItem('token');
                }

            }
        });


        //$('#packagemodel').modal('show');

    });
    $('.glyphicon-remove-circle').click(function(e) {
        e.preventDefault();
        var id = $(this).closest('.editpackgemodal').attr('id');
        if (id == "divpname") {
            $("#p_name").prop('disabled', false);
        }

        if (id == "divmonthly") {
            $("input[name=monthly]").prop('disabled', false);
        }

        if (id == "divtermly") {
            $("input[name=termly]").prop('disabled', false);
        }

        if (id == "divannually") {
            $("input[name=annually]").prop('disabled', false);
        }


        if (id == "divcname") {
            $("#c_type").empty();
            $("#c_type").prop('disabled', false);
            var currcullum = [];
            currcullum = JSON.parse(localStorage.getItem('currculluarry'));
            $("#c_type").append("<option value=''>Select Currcullum</option>");
            for (var i = 0; i < currcullum.length; i++) {
                $("#c_type").append("<option value=" + currcullum[i].id + ">" + currcullum[i].name + "</option>");
            }
        }

        if (id == "divgname") {
            $("#g_type").empty();
            $("#g_type").prop('disabled', false);
            var grade = [];
            grade = JSON.parse(localStorage.getItem('gradearry'));
            $("#g_type").append("<option value=''>Select Grade</option>");
            for (var i = 0; i < grade.length; i++) {
                $("#g_type").append("<option value=" + grade[i].id + ">" + grade[i].grade + "</option>");
            }
        }

        if (id == "divsname") {
            $("#subject_modal").empty();
            $("#subject_modal").prop('disabled', false);
            var subject = [];
            subject = JSON.parse(localStorage.getItem('subjectarray'));
            for (var i = 0; i < subject.length; i++) {
                $("#subject_modal").append("<option value=" + subject[i].id + ">" + subject[i].name + "</option>");
            }
        }


    });
    $("form[name='editPackage']").validate({
        rules: {
            p_name: {
                required: true
            },
            c_type: {
                required: true
            },
            g_type: {
                required: true
            },
            s_subject: {
                required: true,
                maxlength: 10
            },
            monthlypay: {
                required: true

            },
            termlypay: {
                required: true
            },
            annullaypay: {
                required: true
            }

        },
        // Specify validation error messages
        messages: {
            p_name: "Please enter package name",
            c_type: "Please Select curriculum name",
            g_type: "Please Select Grade",
            s_subject: "Please Select Subject",
            monthlypay: {
                required: "Please Set the payment"

            },
            termlypay: {
                required: "Please Set the payment"
            },
            annullaypay: {
                required: "Please Set the payment"
            }
        }


    });
    $('#peditconfirm').click(function(e) {
        e.preventDefault();
        if ($("form[name='editPackage']").valid()) {
            $(".loader-wrapper").removeClass('hide');
            var oldSubjects = JSON.parse(localStorage.getItem('currentsubjectarray'));
            var newSubjects = $('#subject_modal').val();
            var arrayOfNumbers = newSubjects.map(Number);
            var ExitSubject = [];

            for (var i = 0; i < oldSubjects.length; i++) {

                ExitSubject[i] = oldSubjects[i]['subject_id'];

            }
            if (newSubjects.length < oldSubjects.length) {
                var diff = $(ExitSubject).not(arrayOfNumbers).get();

            }
            if (newSubjects.length >= oldSubjects.length) {
                var diff = 0;

            }

            var data = {
                'pid': $('input[name=package_id]').val(),
                'p_name': $('input[name=p_name]').val(),
                'c_type': $('#c_type').val(),
                'g_type': $('#g_type').val(),
                's_subject': $('#subject_modal').val(),
                'monthly': $('input[name=monthly]').val(),
                'termly': $('input[name=termly]').val(),
                'annually': $('input[name=annually]').val(),
                'mid': $('input[name=monthly]').attr('id'),
                'tid': $('input[name=termly]').attr('id'),
                'aid': $('input[name=annually]').attr('id'),
                'removeSubjects': diff,
                _csrf: $('input[name=_csrf]').val(),

            };


            $.ajax({
                type: 'POST',
                url: '/updatePackageData',
                data: data,
                dataType: "json",
                success: function(status) {

                    // alert(status.pid);
                    if (status.msg) {
                        //$('#psucsees_msg').addClass("alert alert-success").html("Data insert successfully").fadeIn('slow');
                        $(".loader-wrapper").addClass('hide');
                        $.confirm({
                            title: 'Success!',
                            content: 'Data insert successfully!',
                            buttons: {
                                Done: function() {
                                    location.href = '/package/init?auth=' +  sessionStorage.getItem('token');
                                }

                            }
                        });
                    }
                }
            });

        }


    });
    $('#peditcancel').click(function(e) {
        e.preventDefault();
        localStorage.removeItem('currculluarry');
        localStorage.removeItem('gradearry');
        localStorage.removeItem('subjectarray');
        location.href = "/package/init?auth=" + sessionStorage.getItem('token');

    });


});
