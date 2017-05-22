$(document).ready(function() {

    $(".js-example-basic-multiple").select2({
        placeholder: "Select a Grade"
    });
    $("form[name='createsection']").validate({
        rules: {
            sec_name: {
                required: true
            },
            c_type: {
                required: true
            },
            g_type: {
                required: true

            },
            s_subject: {
                required: true

            }


        },
        // Specify validation error messages
        messages: {
            sec_name: "Please enter section name",
            c_type: "Please Select Curriculum",
            g_type: "Please Select Grade",
            s_subject: "Please Select subject"

        }


    });
    $('#btncreatesection').on("click", function() {

        if ($("form[name='createsection']").valid()) {

            $(".loader-wrapper").removeClass('hide');

            var data = {
                'sec_name': $('input[name=sec_name]').val(),
                'c_type': $('#c_type').val(),
                'g_type': $('#g_type').val(),
                's_subject': $('#s_subject').val(),
                _csrf: $('input[name=_csrf]').val(),

            };


            $.ajax({
                type: 'POST',
                url: '/section/addsection',
                data: data,
                dataType: "json",
                success: function(status) {

                    // alert(status.msg);
                    if (status.msg) {
                        $(".loader-wrapper").addClass('hide');

                        $.alert({
                            title: 'Success',
                            content: 'Data insert successfully!'
                        });

                        document.getElementById('createsection').reset();
                    }
                }
            });

        }



    });

});