$(document).ready(function() {
    function toggle(url, target) {
    var st_url = student_portal_service + "/" + url;
    $.ajax({
      type: 'GET',
      url: st_url,
      dataType: "json",
      success: function(status) {
        if (status) {
          if (status.length != 0 && status.status != "401" && status['details']) {
            $('.notfound').remove();
            $("#" + target).empty();
            for (var i = 0; i < status['details'].length; i++) {
              $("#" + target).append('<tr><td class="hide" data-value=' + status["details"][i].user_id + '>' + status['details'][i].user_id + '</td><td class="hide" data-value=' + status["details"][i].amount + '>' + status['details'][i].amount + '</td><td class="hide" data-value=' + status["details"][i].payment_method + '>' + status["details"][i].payment_method + '</td><td data-value=' + status["details"][i].email + '>' + status["details"][i].email + '</td><td data-value=' + status["details"][i].reference + '>' + status["details"][i].reference + '</td><td class="hide" data-value=' + status["details"][i].token + '>' + status["details"][i].token + '</td><td><p data-placement="top" data-toggle="tooltip" title="Confirm"><button class="btn btn-primary btn-xs ucaction" data-title="Edit"  id=' + status["details"][i].id + 'data-target=".bd-example-modal-lg"><span class="glyphicon glyphicon-check"></span></button> </p></td></tr>');
            }

          }

          if (!status['details']) {

            $('.notfound').remove();
            $("#" + target).empty();
            for (var i = 0; i < status.length; i++) {
              $("#" + target).append('<tr><td class="hide" data-value=' + status[i].user_id + '>' + status[i].user_id + '</td><td class="hide" data-value=' + status[i].amount + '>' + status[i].amount + '</td><td class="hide" data-value=' + status[i].payment_method + '>' + status[i].payment_method + '</td><td data-value=' + status[i].email + '>' + status[i].email + '</td><td data-value=' + status[i].reference + '>' + status[i].reference + '</td><td class="hide" data-value=' + status[i].token + '>' + status[i].token + '</td><td><p data-placement="top" data-toggle="tooltip" title="Confirm"><button class="btn btn-primary btn-xs ucactive_action" data-title="Edit"  id=' + status[i].id + 'data-target=".bd-example-modal-lg"><span class="glyphicon glyphicon-check"></span></button> </p></td></tr>');
            }


          }
          if (status.status == "401") {
            $('.notfound').remove();
            $("#" + target).empty();
            $("#" + target).append('<div class="form-group col-md-5 col-lg-offset-5 notfound">No Student Found</div>');

          }


        }


      }

    });

  };
    toggle("admin/get/active/users", "activeStudentData");
    $('#searchInActive').click(function() {
        var ref = $.trim($('input[name=search]').val());
        $.ajax({
            type: 'GET',
            url: student_portal_service + '/admin/' + ref,
            dataType: "json",
            success: function(status) {

                if (status.data.email) {
                    $('.notfound').remove();
                    $('#studentdata').empty();
                    $('#studentdata').append('<tr>');
                    $('#studentdata').append('<td>' + status.data.email + '</td>');
                    $('#studentdata').append('<td><p data-placement="top" data-toggle="tooltip" title="Confirm"><button class="btn btn-primary btn-xs ucactionSer" data-title="Edit"  id="' + status.data.email + '" data-toggle="modal" data-target=".bd-example-modal-lg"><span class="glyphicon glyphicon-check"></span></button> </p></td>');
                    $('#studentdata').append('</tr>');
                    $('#m_ename').val(status.data.email);
                    $('#sttoken').val(status.data.token);

                }

                if (!status.data.email) {
                    $('.notfound').remove();
                    $('#studentdata').empty();
                    $('#studentdata').append('<div class="form-group col-md-5 col-lg-offset-5 notfound">No Student Found</div>');

                }

            }

        });

    });
    $("form[name='Confirmform']").validate({
        rules: {
            m_ename: {
                required: true
            },
            m_amount: {
                required: true
            },
            pa_type: {
                required: true
            },
            st_type: {
                required: true
            }

        },
        // Specify validation error messages
        messages: {
            m_ename: "Please Enter package name",
            m_amount: "Please Enter Amount",
            pa_type: "Please Select Payment Method",
            st_type: "Please Enter Status",
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
    $('#payconfirm').click(function() {

        if ($("form[name='Confirmform']").valid()) {
            $(".loader-wrapper").removeClass('hide');
            var data = {
                'email': $('input[name=m_ename]').val(),
                'amount': $('input[name=m_amount]').val(),
                'status': $('input[name=st_name] ').val(),
                'payment_method': $('#pa_type').val(),
                'signup_token':$('input[name=sttoken]').val()
            };


            $.ajax({
                type: 'POST',
                url: student_portal_service + '/paymentgateway/activate/student',
                data : data,
                dataType: "json",
                success: function(status) {

                    if (status) {
                        //  alert(status.data)
                        $(".loader-wrapper").addClass('hide');
                        $('#payconfirm').prop('disabled', true);
                        $('#alertSt').removeClass('form-group  col-md-8 col-lg-offset-1');
                        $('#alertSt').addClass('form-group  col-md-8 col-lg-offset-1');
                        $('#alertSt').append('<p>' + status.data + '</p>');
                    }

                }

            });
        }
    });
    $('#paycancel').click(function() {

        location.href = '/student/init?auth=' + sessionStorage.getItem('token');

    });
    $('[data-toggle="tab"]').click(function(e) {
        var $this = $(this),
            url = $this.attr('data-url'),
            target = $this.attr('data-path');
        toggle(url, target);


    });
    $('html').on('click', '.ucaction', function(e) {
        e.preventDefault();
        var studentId = $(this).attr('id');
        var currentRow = $(this).closest("tr");
        var amount = currentRow.find("td:eq(1)").data('value');
        var pay_method = currentRow.find("td:eq(2)").html();
        var convert_pay = decodeEntities(pay_method);
        var email = currentRow.find("td:eq(3)").data('value');
        var token = currentRow.find("td:eq(5)").data('value');
        $('#m_ename').val(email);
        $('#sttoken').val(token);
        $('#m_amount').val(amount);
        $('#pa_type').val(convert_pay);
        $('#payConfirmModel').modal('show');
        $('#payConfirmModel').modal({
            backdrop: 'static',
            keyboard: false
        });
        $("input[name=m_amount]").prop('disabled', true);
        $('#payconfirm').prop('disabled', false);


    });
    $('.editPaymentModel').click(function(e) {
        e.preventDefault();
        var id = $(this).closest('.editstpaymnetmodal').attr('id');

        if (id == "divamount") {
            $("input[name=m_amount]").prop('disabled', false);
        }

    });
    function decodeEntities(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }
    $('[data-path="updatePackageDetails"]').click(function (e) {
    var $this = $(this),
      url = $this.attr('data-url'),
      target = $this.attr('data-path');
    var st_url = student_portal_service + "/" + url;
    $.ajax({
      type: 'GET',
      url: st_url,
      dataType: "json",
      success: function (status) {
        if (status.status == '200') {
          $('.notfound').remove();
          $("#" + target).empty();
          for (var i = 0; i < status.data.length; i++) {
               $("#" + target).append('<tr> <td>' +
               status.data[i].email +
              '</td> <td>' + status.data[i].package_price +
              ' </td>  <td> ' +
               status.data[i].payment_method +
              '</td> <td><p data-placement="top" data-toggle="tooltip" title="Confirm"><button class="btn btn-primary btn-xs update_package" data-title="Edit"  id=' +
               status.data[i].id +
              ' data-target=".bd-example-modal-lg"><span class="glyphicon glyphicon-check"></span></button> </p></td>\n\
               </td><td class="hide" data-value="'+ status.data[i].signup_token +'"</td></tr>');
          }
        } else {
          $("#" + target).empty();
        }
      }

    });


  });
    $('html').on('click', '#upadte_pkg', function () {
    $(".loader-wrapper").removeClass('hide');

    var email = $('#email').val();
    var paid_amount = $('#amount').val();
    var signup_token = $('#signup_token').val();
    var payment_method = $('#payment_method').val();
    var status = $('#status').val();
    var data= {
      "email" :email,
      "paid_amount" :paid_amount,
      "signup_token" :signup_token,
      "payment_method":payment_method,
      "status":status
    }

    var st_url = student_portal_service + "/student/update/package/direct/payments" ;
    $.ajax({
      type: 'POST',
      url: st_url,
      data : data,
      dataType: "json",
      success: function (status) {
        //alert(status);
        $(".loader-wrapper").addClass('hide');
        $('#responseText').append('<h5>Package Updated Successfully </h5>');
        console.log(status)
      },
      error : function(){
        console.log(status.status) ;
      }
    });


  });
    $('html').on('click', '.update_package', function () {

      var currentRow = $(this).closest("tr");
      var email = currentRow.find("td:eq(0)").html();
      var package_price = currentRow.find("td:eq(1)").html();
      var payment_method = currentRow.find("td:eq(2)").html();
      var signup_token = currentRow.find("td:eq(4)").data('value');

      $('#email').val(email);
      $('#signup_token').val(signup_token);
      $('#amount').val(package_price);
      $('#payment_method').val(payment_method);
      $('#update_student_package').modal('show');

  });

});
