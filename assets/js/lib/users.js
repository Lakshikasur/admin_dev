$(document).ready(function() {


    $("form[name='registration']").validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            type: {
                required: true
            },
            country_type: {
                required: true
            },
            tel: {
                required: true,
                maxlength: 10
            },
            pwd: {
                required: true,
                minlength: 5
            },
            confirmpwd: {
                required: true,
                minlength: 5
            }

        },
        // Specify validation error messages
        messages: {
            name: "Please enter your name",
            email: "Please enter a valid email address",
            type: "Please Select type",
            country_type: "Please Select Country type",
            tel: {
                required: "Please provide a telephone number",
                maxlength: "Your telephone number length is 10"
            },
            pwd: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            confirmpwd: {
                required: "Please provide a confirm password"
            }
        }


    });
    $('#create').on("click", function() {


        if ($("form[name='registration']").valid()) {
            $(".loader-wrapper").removeClass('hide');

            var users = {
                'pwd': $('input[name=pwd]').val(),
                'confirmpwd': $('input[name=confirmpwd]').val(),
                'name': $('input[name=name]').val(),
                'email': $('input[name=email]').val(),
                'type': $('#type').val(),
                'tel': $('input[name=tel]').val(),
                'country': $('#country_type').val(),
                _csrf: $('input[name=_csrf]').val(),
            };


            $.ajax({
                type: 'POST',
                url: '/register',
                data: users,
                dataType: "json",
                success: function(status) {


                    if (status.msg == 'success') {
                        $(".loader-wrapper").addClass('hide');

                        $.alert({
                            title: 'Sign up success',
                            content: 'Please wait for system admin confirm'
                        });
                        document.getElementById('registration').reset();
                        /* $('#signup_msg').addClass("alert alert-success").html("Data insert successfully").fadeIn('slow');*/
                    }

                    if (status.msg == 'danger') {
                        $(".loader-wrapper").addClass('hide');
                        $.alert({
                            title: 'Sign up Fail',
                            content: 'Your email exits'
                        });
                        document.getElementById('registration').reset();
                    }
                }
            })

        }
    });


});