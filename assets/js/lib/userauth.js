$(document).ready(function() {


    $('#product-table a:first').tab('show');
    $('.ucaction').click(function() {
        var role = $(this).attr('name');
        var id = $(this).attr('id');
        if (role == 3) {
            $('#tu_id').val(id);
            $('#tutormodal').modal('show');
        }
        if (role == 1 || role == 4) {
            var data = {
                'id': $(this).attr('id'),
                'a_id': sessionStorage.getItem('auth'),
                _csrf: $('input[name=_csrf]').val(),
            };
            $.ajax({
                type: 'POST',
                url: '/confirmuser',
                data: data,
                dataType: "json",
                success: function(status) {
                    if (status) {
                        $.confirm({
                            title: 'Success!',
                            content: 'User Confirm Success',
                            buttons: {
                                Done: function() {
                                    location.href = '/usersauth?auth=' + sessionStorage.getItem('token');
                                }

                            }
                        });
                    }

                }

            });

        }
    });
    $("form[name='tutorConfirm']").validate({
        rules: {
            sec_type: {
                required: true
            },
            h_type: {
                required: true
            },


        },
        // Specify validation error messages
        messages: {
            sec_type: "Please Select Section",
            h_type: "Please Select Helper",

        }


    });
    $("form[name='editTutorUser']").validate({
        rules: {
            sece_type: {
                required: true
            },
            he_type: {
                required: true
            },


        },
        // Specify validation error messages
        messages: {
            sec_type: "Please Select Section",
            h_type: "Please Select Helper",

        }


    });
    $('#tutorconfirm').click(function() {

        if ($("form[name='tutorConfirm']").valid()) {
            $(".loader-wrapper").removeClass('hide');
            var value = {

                'sec_type': $("#sec_type").val(),
                'uid': $('input[name=tu_id]').val(),
                'h_type': $('#h_type').val(),
                'a_id': sessionStorage.getItem('auth'),
                _csrf: $('input[name=_csrf]').val(),
            };
            $.ajax({
                type: 'POST',
                url: '/confirmtutor',
                data: value,
                dataType: "json",
                success: function(status) {


                    if (status.status) {
                        $(".loader-wrapper").addClass('hide');
                        $.confirm({
                            title: 'Success!',
                            content: 'New Tutor Assign Successfully!',
                            buttons: {
                                Done: function() {
                                    location.href = '/usersauth?auth=' + sessionStorage.getItem('token');
                                }

                            }
                        });

                    } else {
                        $(".loader-wrapper").addClass('hide');
                        $('#alertSt').addClass('form-group  col-md-8 col-lg-offset-1');
                        $('#alertSt').append('<p>User Already In this Helper Group</p>');
                    }


                }
            });

        }
    });
    $('#tutorcancel').click(function() {

        location.href = '/usersauth?auth=' + sessionStorage.getItem('token');

    });
    $('.tuseredit').click(function(e) {
        e.preventDefault();
        var tutor_u_id = $(this).attr('name');

        var data = {
            'uid': tutor_u_id,
            _csrf: $('input[name=_csrf]').val(),
        };
        $.ajax({
            type: 'POST',
            url: '/getUserEditData',
            data: data,
            dataType: "json",
            success: function(status) {

                if (status) {
                    // console.log(status[0]['selection_list_id']);
                    $('#myTutorEditLabel').empty();
                    $('#myTutorEditLabel').append('Edit Tutor(' + status.data['0'].name + ')');
                    $("#sece_type").empty();
                    $("#sece_type").prop('disabled', true);
                    $("#sece_type").append("<option value=" + status.data['0'].selection_list_id + ">" + status.data['0'].selctionList + "</option>");
                    $("#he_type").empty();
                    $("#he_type").prop('disabled', true);
                    $("#he_type").append("<option value=" + status.data['0'].helper_id + ">" + status.data['0'].helper + "</option>");
                    localStorage.setItem('section', JSON.stringify(status.section));
                    localStorage.setItem('helpers', JSON.stringify(status.helpers));
                    $('input[name=edittu_id]').val(tutor_u_id);
                    $('#tutorUserEditModel').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                  $('#tutorUserEditModel').modal('show');
                }

            }
        });






    });
    $('.tuserdelete').click(function(e) {
        e.preventDefault();
        var data = {
            'user_id': $(this).attr('name'),
            _csrf: $('input[name=_csrf]').val(),
        };
        $.confirm({
            title: 'Delete!',
            content: 'Are You want Remove the User!',
            buttons: {
                OK: function() {
                    $(".loader-wrapper").removeClass('hide');
                    $.ajax({
                        type: 'POST',
                        url: '/user/remove',
                        data: data,
                        dataType: "json",
                        success: function(status) {
                            if (status.msg == "Success") {
                                $(".loader-wrapper").addClass('hide');
                                $.confirm({
                                    title: 'Success!',
                                    content: 'Tutor delete successfully!',
                                    buttons: {
                                        Done: function() {
                                            location.href = '/usersauth?auth=' + sessionStorage.getItem('token');
                                        }

                                    }
                                });


                            }


                        }

                    });
                },
                NO: function() {
                    $(".loader-wrapper").removeClass('hide');
                    location.href = '/module/init?auth=' + sessionStorage.getItem('token');
                }

            }
        });

    });
    $('.auserdelete').click(function(e) {
        e.preventDefault();
        var data = {
            'user_id': $(this).attr('id'),
            _csrf: $('input[name=_csrf]').val(),
        };
        $.confirm({
            title: 'Delete!',
            content: 'Are You want Remove the User!',
            buttons: {
                OK: function() {
                    $(".loader-wrapper").removeClass('hide');
                    $.ajax({
                        type: 'POST',
                        url: '/user/remove',
                        data: data,
                        dataType: "json",
                        success: function(status) {
                            if (status.msg == "Success") {
                                $(".loader-wrapper").addClass('hide');
                                $.confirm({
                                    title: 'Success!',
                                    content: 'User delete successfully!',
                                    buttons: {
                                        Done: function() {
                                            location.href = '/usersauth?auth=' + sessionStorage.getItem('token');
                                        }

                                    }
                                });


                            }


                        }

                    });
                },
                NO: function() {
                    $(".loader-wrapper").removeClass('hide');
                    location.href = '/usersauth?auth=' + sessionStorage.getItem('token');
                }

            }
        });

    });
    $('.glyphicon-remove-circle').click(function(e) {
        e.preventDefault();
        var id = $(this).closest('.editTutor').attr('id');

        if (id == "divsec_type") {
            $("#sece_type").empty();
            $("#sece_type").prop('disabled', false);
            var section = [];
            section = JSON.parse(localStorage.getItem('section'));
            $("#sece_type").append("<option value=''>Select Section</option>");
            for (var i = 0; i < section.length; i++) {
                $("#sece_type").append("<option value=" + section[i].id + ">" + section[i].name + "</option>");
            }
        }

        if (id == "divh_type") {
            $("#he_type").empty();
            $("#he_type").prop('disabled', false);
            var helpers = [];
            helpers = JSON.parse(localStorage.getItem('helpers'));
            $("#he_type").append("<option value=''>Select Helper</option>");
            for (var i = 0; i < helpers.length; i++) {
                $("#he_type").append("<option value=" + helpers[i].id + ">" + helpers[i].name + "</option>");
            }
        }
    });
    $('#tuditconfirm').click(function(e) {
        e.preventDefault();
        if ($("form[name='editTutorUser']").valid()) {

            var data = {
                'sec_type': $("#sece_type").val(),
                'tutor_id': $('input[name=edittu_id]').val(),
                'h_type': $('#he_type').val(),
                _csrf: $('input[name=_csrf]').val(),

            };


            $.ajax({
                type: 'POST',
                url: '/updateTutorHelpData',
                data: data,
                dataType: "json",
                success: function(status) {
                    if (status.status) {
                        $(".loader-wrapper").addClass('hide');
                        $.confirm({
                            title: 'Success!',
                            content: 'Tutor Update successfully!',
                            buttons: {
                                Done: function() {
                                    location.href = '/usersauth?auth=' + sessionStorage.getItem('token') + '#/3';
                                    $('#tutorUserEditModel').modal('hide')
                                }

                            }
                        });
                    }
                }
            });

        }


    });
    $('#tueditcancel').click(function(e) {
        e.preventDefault();
        localStorage.removeItem('section');
        localStorage.removeItem('helpers');
        location.href = '/usersauth?auth=' + sessionStorage.getItem('token') + '#/3';

    });

});
