$(document).ready(function() {

    $('#sec_type').change(function() {

        var value = {
            'sec_type': $("#sec_type:optional").val(),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.ajax({
            type: 'POST',
            url: '/initmodulesfromesec',
            data: value,
            dataType: "json",
            success: function(status) {
                // alert(status['0'].length);

                if (status['0'].length != 0) {
                    $("#m_type").empty();
                    $("#m_type").append(" <option value=''>Select Modules</option>");
                    for (var i = 0; i < status['0'].length; i++) {
                        $("#m_type").append("<option value=" + status['0'][i]['module_id'] + ">" + status['0'][i]['name'] + "</option>");
                    }


                } else {
                    $("#m_type").empty();
                    $("#m_type").append(" <option value=''>No Current Modules</option>");
                }
            }
        });


    });
    $('#ufaq_type').change(function() {
        var value = {
            'm_type': $("#ufaq_type:optional").val(),
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
                    $("#m_ufaq_type").empty();
                    $("#m_ufaq_type").append(" <option value=''>Select Unit</option>");
                    for (var i = 0; i < status['0'].length; i++) {
                        $("#m_ufaq_type").append("<option value=" + status['0'][i]['unit_id'] + ">" + status['0'][i]['unit_name'] + "</option>");
                    }


                } else {
                    $("#mu_type").empty();
                    $("#mu_type").append(" <option value=''>No Current Unit</option>");
                }
            }
        });

    });
    $('#ug_type').change(function() {
        var value = {
            'm_type': $("#ug_type:optional").val(),
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
                    $("#m_ug_type").empty();
                    $("#m_ug_type").append(" <option value=''>Select Unit</option>");
                    for (var i = 0; i < status['0'].length; i++) {
                        $("#m_ug_type").append("<option value=" + status['0'][i]['unit_id'] + ">" + status['0'][i]['unit_name'] + "</option>");
                    }


                } else {
                    $("#mu_type").empty();
                    $("#mu_type").append(" <option value=''>No Current Unit</option>");
                }
            }
        });

    });
    $("form[name='createunits']").validate({
        rules: {
            m_type: {
                required: true
            },
            u_des: {
                required: true
            },
            u_name: {
                required: true
            }

        },
        // Specify validation error messages
        messages: {

            m_type: "Please Select Module",
            u_des: "Please Enter unit description",
            u_name: "Please Enter unit name"

        }


    });
    $('#createunit').on("click", function() {
        var desData = document.getElementById("unitDesData").innerHTML;
        /*  var faqData= document.getElementById("faq_data").innerHTML;
          var glosseryData= document.getElementById("glossary_data").innerHTML;*/
        if ($("form[name='createunits']").valid()) {
            $(".loader-wrapper").removeClass('hide');
            var data = {
                'u_name': $('input[name=u_name]').val(),
                'm_type': $('#m_type').val(),
                'u_des': desData,
                /* 'u_faq':faqData,
                 'u_gloss':glosseryData,*/
                _csrf: $('input[name=_csrf]').val(),
            };

            $.ajax({
                type: 'POST',
                url: '/addunit',
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
                        $.alert({
                            title: 'Success',
                            content: 'Data insert successfully!'
                        });
                        document.getElementById('createunits').reset();

                    }

                }
            });


        }

    });
  /*  $('#add_gloss').on("click", function() {
        var glosseryData = document.getElementById("glossary_data").innerHTML;
        $(".loader-wrapper").removeClass('hide');
        var data = {
            'unit_id': $("#m_ug_type:optional").val(),
            'u_glossary': glosseryData,
            'tutor_id': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.ajax({
            type: 'POST',
            url: '/unit/addGlossary',
            data: data,
            dataType: "json",
            success: function(status) {

                if (status.msg == 'error') {

                    $(".loader-wrapper").addClass('hide');
                    $.confirm({
                        title: 'Error',
                        content: 'Data error!',
                        buttons: {
                            Done: function() {
                                location.href = '/unit/glossary?auth=' + sessionStorage.getItem('token');
                            }

                        }
                    });

                } else {
                    $(".loader-wrapper").addClass('hide');
                    $.confirm({
                        title: 'Success',
                        content: 'Data insert successfully!',
                        buttons: {
                            Done: function() {
                                location.href = '/unit/glossary?auth=' + sessionStorage.getItem('token');
                            }

                        }
                    });

                }

            }
        });




    });*/
    $('#m_ufaq_type').on('change',function() {
      sessionStorage.setItem('faq_unitId',$("#m_ufaq_type:optional").val());

   });

  $('#m_ug_type').on('change',function() {
    sessionStorage.setItem('gloss_unitId',$("#m_ug_type:optional").val());

  });


  /*  $('#add_faq').on("click", function() {
        var faqData = document.getElementById("faq_data").innerHTML;
      console.log(faqData);
        $(".loader-wrapper").removeClass('hide');
        var data = {
            'unit_id': $("#m_ufaq_type:optional").val(),
            'u_faq': faqData,
            'tutor_id': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.ajax({
            type: 'POST',
            url: '/unit/addFaq',
            data: data,
            dataType: "json",
            success: function(status) {

                if (status.msg == 'error') {
                    $(".loader-wrapper").addClass('hide');
                    $.confirm({
                        title: 'Error',
                        content: 'Data error!',
                        buttons: {
                            Done: function() {
                                location.href = '/unit/faq?auth=' + sessionStorage.getItem('token');
                            }

                        }
                    });

                } else {
                    $(".loader-wrapper").addClass('hide');
                    $.confirm({
                        title: 'Success',
                        content: 'Data insert successfully!',
                        buttons: {
                            Done: function() {
                                location.href = '/unit/faq?auth=' + sessionStorage.getItem('token');
                            }

                        }
                    });

                }

            }
        });




    });*/




});
