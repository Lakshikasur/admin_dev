$(document).ready(function() {



    $('.umedit').click(function(e) {
        e.preventDefault();
        var moduleid = $(this).attr('id');
        $('#moduleEditModel').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#moduleEditModel').modal('show');
        var currentRow = $(this).closest("tr");
        var moduleId = currentRow.find("td:eq(0)").data('value');
        var moduleName = currentRow.find("td:eq(1)").data('value');
        $('input[name=m_name]').val(moduleName);
        $('input[name=module_id]').val(moduleId);




    });
    $('.umdelete').click(function(e) {
        e.preventDefault();
        var packageid = $(this).attr('id');
        var data = {
            'module_id': $(this).attr('id'),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.confirm({
            title: 'Delete!',
            content: 'Are You want Remove the Module!',
            buttons: {
                OK: function() {
                    $(".loader-wrapper").removeClass('hide');
                    $.ajax({
                        type: 'POST',
                        url: '/module/remove',
                        data: data,
                        dataType: "json",
                        success: function(status) {
                            if (status.msg == "Success") {
                                $(".loader-wrapper").addClass('hide');
                                $.confirm({
                                    title: 'Success!',
                                    content: 'Module delete successfully!',
                                    buttons: {
                                        Done: function() {
                                            location.href = '/module/init?auth=' + sessionStorage.getItem('token');
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


        //$('#packagemodel').modal('show');

    });
    $("form[name='editModule']").validate({
        rules: {
            m_name: {
                required: true
            },
            htmlcontent: {
                required: true
            },


        },
        // Specify validation error messages
        messages: {
            m_name: "Please enter module name",
            htmlcontent: "Please Select unit description",

        }


    });
    $('#moeditconfirm').click(function(e) {
        e.preventDefault();
        var html = document.getElementById("moduleDesData").innerHTML;
        if ($("form[name='editModule']").valid()) {
            $(".loader-wrapper").removeClass('hide');
            var data = {
                'm_id': $('input[name=module_id]').val(),
                'm_name': $('input[name=m_name]').val(),
                'm_des': html,
                _csrf: $('input[name=_csrf]').val(),
            };

            $.ajax({
                type: 'POST',
                url: '/updateModule',
                data: data,
                dataType: "json",
                success: function(status) {

                    if (status.msg == 'error') {
                        $(".loader-wrapper").addClass('hide');
                        $.alert({
                            title: 'Error',
                            content: 'Data error!'
                        });
                        document.getElementById('createunits').reset();

                    } else {
                        $(".loader-wrapper").addClass('hide');
                        $.confirm({
                            title: 'Success!',
                            content: 'Module Update successfully!',
                            buttons: {
                                Done: function() {
                                    location.href = '/module/init?auth=' + sessionStorage.getItem('token');
                                }

                            }
                        });

                    }

                }
            });


        }

    });
    $('#moeditcancel').click(function(e) {
        e.preventDefault();
        location.href = "/module/init?auth=" + sessionStorage.getItem('token')

    });


});