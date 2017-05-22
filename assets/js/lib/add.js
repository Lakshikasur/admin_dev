$(document).ready(function() {

    $(".js-example-basic-multiple").select2({
        placeholder: "Select a subjects"
    });

    $("form[name='createpakages']").validate({
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


    $('#createpackage').on("click", function() {
        if ($("form[name='createpakages']").valid()) {
            $(".loader-wrapper").removeClass('hide');

            var users = {
                'p_name': $('input[name=p_name]').val(),
                'c_type': $('#c_type').val(),
                'g_type': $('#g_type').val(),
                's_subject': $('#s_subject').val(),
                'monthly': $('input[name=monthly]').val(),
                'termly': $('input[name=termly]').val(),
                'annually': $('input[name=annually]').val(),
                'mid': $('input[name=monthly]').attr('id'),
                'tid': $('input[name=termly]').attr('id'),
                'aid': $('input[name=annually]').attr('id'),
                _csrf: $('input[name=_csrf]').val(),
            };


            $.ajax({
                type: 'POST',
                url: '/addpackage',
                data: users,
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
                                    location.href = '/section/packageToSection?auth=' + sessionStorage.getItem('token') + '&pid=' + status.pid;
                                }

                            }
                        });
                    }
                }
            });

        }
    });

    $('#addpc').on("click", function() {

        alert("test");


    });


});