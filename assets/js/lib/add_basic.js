$(document).ready(function() {



    $("form[name='addQuestionBasic']").validate({
        rules: {
            m_type: {
                required: true
            },
            mu_type: {
                required: true

            }

        },
        // Specify validation error messages
        messages: {
            m_type: "Please Select module",
            mu_type: "Please Select unit"
        }


    });
    $('#m_type').change(function() {

        var value = {
            'm_type': $("#m_type:optional").val(),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.ajax({
            type: 'POST',
            url: '/initresourceunits',
            data: value,
            dataType: "json",
            success: function(status) {
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
    $('#addquizmetadata').click(function() {

        if ($("form[name='addQuestionBasic']").valid()) {
            $(".loader-wrapper").removeClass('hide');
            var value = {

                'm_type': $("#m_type option:selected").text(),
                'mu_type': $("#mu_type option:selected").text(),
                'token': sessionStorage.getItem('token'),
                _csrf: $('input[name=_csrf]').val(),



            };
            localStorage.setItem('m_typeid', $("#m_type").val());
            localStorage.setItem('mu_typeid', $("#mu_type").val());

            $.ajax({
                type: 'POST',
                url: '/assessment/addQuestion',
                data: value,
                dataType: "json",
                success: function(status) {
                    $(".loader-wrapper").addClass('hide');

                    location.href = '/assessment/addQuestionInit?auth=' + sessionStorage.getItem('token') + '&m=' + status.m_type + '&u=' + status.mu_type;

                }
            });

        }
    });





});