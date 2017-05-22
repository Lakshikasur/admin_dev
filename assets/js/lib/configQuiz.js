$(document).ready(function() {
    $('.divhide').hide();
    $('#qiz_type').change(function() {
        $('.divhide').hide();

        if ($("#qiz_type:optional").val() == 'SUBJECT_TEST') {

            $('#qsubject').show();


        }

        if ($("#qiz_type:optional").val() == 'MODULE_TEST') {

            $('#qsubject').show();
            $('#qmodule').show();


        }

    });
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

                if (status.module.length != 0) {
                    $("#m_type").empty();
                    $("#m_type").append('<option value="">Select Module</option>');
                    for (var i = 0; i < status.module.length; i++) {
                        $("#m_type").append("<option value=" + status.module[i]['module_id'] + ">" + status.module[i]['name'] + "</option>");
                    }


                }

                if (status.module.length == 0) {
                    $("#m_type").empty();
                    $("#m_type").append("<option value=''>No Data Found</option>");
                }

            }






        });

    });
    $("form[name='quizconfig']").validate({
        rules: {

            c_type: {
                required: true
            },
            g_type: {
                required: true
            },
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

            c_type: "Please Select Curriculum",
            g_type: "Please Select Grade",
            qiz_type: "Please Select Test Type",
            s_id: "Please Select Subject",
            q_amount: "Please Enter Number Of Question",
            s_time: "Please Enter Schedule Time Correctly",
            t_bonus: "Please Enter Time Bonus Correctly",

        }


    });
    $('#confirmquiz').on('click', function() {

        if ($("form[name='quizconfig']").valid()) {
            if ($("#qiz_type").val() == 'MODULE_TEST') {
                var data = {
                    'sec_id': $("#sec_type").val(),
                    'qiz_type': $("#qiz_type").val(),
                    's_id': $("#s_type").val(),
                    'm_type': $("#m_type").val(),
                    'q_amount': $("#q_amount").val(),
                    's_time': $("#s_time").val(),
                    't_bonus': $("#t_bonus").val(),
                    'id': sessionStorage.getItem('auth'),
                    _csrf: $('input[name=_csrf]').val(),
                };

            }
            if ($("#qiz_type").val() == 'SUBJECT_TEST') {
                var data = {

                    'sec_id': $("#sec_type").val(),
                    'qiz_type': $("#qiz_type").val(),
                    's_id': $("#s_type").val(),
                    'q_amount': $("#q_amount").val(),
                    's_time': $("#s_time").val(),
                    't_bonus': $("#t_bonus").val(),
                    'id': sessionStorage.getItem('auth'),
                    _csrf: $('input[name=_csrf]').val(),

                };

            }
            $.ajax({
                type: 'POST',
                url: '/assessment/configData',
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

                    if (status) {
                        $.confirm({
                            title: 'Success!',
                            content: 'Quiz configuration Success',
                            buttons: {
                                Done: function() {
                                    location.href = '/assessment/init?auth=' + sessionStorage.getItem('token');
                                }

                            }
                        });
                    }
                }

            });

        }

    });


});