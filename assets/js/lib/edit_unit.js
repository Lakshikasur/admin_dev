$(document).ready(function() {
    $('#product-table a:first').tab('show');
    $('.uuedit').click(function(e) {
        e.preventDefault();
        var unitid = $(this).attr('id');
        $('#unitEditModel').modal({
            backdrop: 'static',
            keyboard: false
        });
      $('#unitEditModel').modal('show');
        var currentRow = $(this).closest("tr");
        var unitId = currentRow.find("td:eq(0)").data('value');
        var unitName = currentRow.find("td:eq(1)").data('value');
        $('input[name=u_name]').val(unitName);
        $('input[name=unit_id]').val(unitId);



    });
    $('.uudelete').click(function(e) {
        e.preventDefault();
        var packageid = $(this).attr('id');
        var data = {
            'unit_id': $(this).attr('id'),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.confirm({
            title: 'Delete!',
            content: 'Are You want Remove the Unit!',
            buttons: {
                OK: function() {
                    $(".loader-wrapper").removeClass('hide');
                    $.ajax({
                        type: 'POST',
                        url: '/unit/remove',
                        data: data,
                        dataType: "json",
                        success: function(status) {
                            if (status.msg == "Success") {
                                $(".loader-wrapper").addClass('hide');
                                $.confirm({
                                    title: 'Success!',
                                    content: 'Unit delete successfully!',
                                    buttons: {
                                        Done: function() {
                                            location.href = '/unit/init?auth=' + sessionStorage.getItem('token');
                                        }

                                    }
                                });


                            }


                        }

                    });
                },
                NO: function() {
                    $(".loader-wrapper").removeClass('hide');
                    location.href = '/unit/init?auth=' + sessionStorage.getItem('token');
                }

            }
        });


        //$('#packagemodel').modal('show');

    });
    $("form[name='editUnit']").validate({
        rules: {
            u_name: {
                required: true
            },
            htmlcontentdes: {
                required: true
            },


        },
        // Specify validation error messages
        messages: {
            u_name: "Please enter unit name",
            htmlcontentdes: "Please Select unit description",

        }


    });
    $('#ueditconfirm').click(function(e) {
        e.preventDefault();
        var html = document.getElementById("unitDesData").innerHTML;
        if ($("form[name='editUnit']").valid()) {
            $(".loader-wrapper").removeClass('hide');
            var data = {
                'u_id': $('input[name=unit_id]').val(),
                'u_name': $('input[name=u_name]').val(),
                'u_des': html,
                _csrf: $('input[name=_csrf]').val(),
            };

            $.ajax({
                type: 'POST',
                url: '/updateUnit',
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
                            content: 'Unit Update successfully!',
                            buttons: {
                                Done: function() {
                                    location.href = '/unit/init?auth=' + sessionStorage.getItem('token');
                                }

                            }
                        });

                    }

                }
            });


        }

    });
    $('#ueditcancel').click(function(e) {
        e.preventDefault();
        location.href = "/unit/init?auth=" + sessionStorage.getItem('token');

    });


});
