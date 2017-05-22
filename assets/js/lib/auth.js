$(document).ready(function() {

    $("form[name='loginform']").validate({
        rules: {

            email: {
                required: true,
                email: true
            },

            pwd: {
                required: true
            }


        },
        // Specify validation error messages
        messages: {

            email: {
                required: "Username cannot be blank",
                maxlength: "Your telephone number length is 10"
            },
            pwd: {
                required: "Password cannot be blank",
                minlength: "Your password must be at least 5 characters long"
            }

        }


    });


    $('#login').on("click", function() {

        if ($("form[name='loginform']").valid()) {


            var users = {
                'pwd': $('input[name=pwd]').val(),
                'email': $('input[name=email]').val(),
                'csrf': $('input[name=_csrf]').val(),
                _csrf: $('input[name=_csrf]').val(),
            };
            $.ajax({
                type: 'POST',
                url: '/auth',
                data: users,
                dataType: "json",
                success: function(status) {

                    // console.log(status.uid+"-------"+status.role);
                    if (status.uid != null && status.role) {
                        //alert(status.auth);
                        sessionStorage.setItem('auth', status.auth);
                        sessionStorage.setItem('role', status.role);
                        sessionStorage.setItem('token', status.uid);
                        sessionStorage.setItem('token_tmp', status.token_tmp);
                        sessionStorage.setItem('sec_id', status.sec_id);


                        // alert(localStorage.getItem('token'));
                        localStorage.setItem('page_url', "/dashboard?auth=" + status.uid);
                        location.href = "/dashboard?auth=" + status.uid;


                    }
                    if (status.uid == null && !status.role) {
                        $("#login_error").addClass("help-block help-block-error").html("UserName & Password Incorrect").fadeIn('slow');
                    }

                }

            });

        }
    });


});