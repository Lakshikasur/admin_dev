$(document).ready(function () {
  var getDataCountRoute = '/resource/count';
  var getDataRoute = '/resource/getPageData';
  var unit_id="";

  function getDataCount(type, route, taget, unit_id) {
    var type = type;
    var target = taget;
    var data = {
      'auth': sessionStorage.getItem('auth'),
      'r_type': type,
      'unit_id':unit_id,
      _csrf: $('input[name=_csrf]').val(),
    };
    $.ajax({
      type: 'POST',
      url: route,
      data: data,
      dataType: "json",
      success: function (status) {
        var count = status['0']['data_count'];
        pagination(count, type, target,unit_id);

      }

    });


  }
  getDataCount('1', getDataCountRoute, 'r_video_table_body',unit_id);
  function pagination(data_count, type, ul, unit_id) {
    var page_count = Math.ceil(data_count / 5);

    var select_target = "." + ul;
    $(select_target).twbsPagination('destroy');

    $(".loader-wrapper").removeClass('hide');
    if (page_count == 1) {
      $(select_target).twbsPagination({
        totalPages: page_count,
        onPageClick: function (event, page) {
          event.preventDefault();
          var data = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            'r_type': type,
            'unit_id':unit_id,
            _csrf: $('input[name=_csrf]').val(),
          };

          getData(data, getDataRoute);

        }
      });

    }
    if (page_count > 1) {

      $('.' + ul).twbsPagination({
        totalPages: page_count,
        onPageClick: function (event, page) {
          event.preventDefault();
          var data = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            'r_type': type,
            'unit_id':unit_id,
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(data, getDataRoute);
        }
      });

    }
    if (page_count == 0) {
      $('table #' + ul).empty();
      $('table #' + ul).append('<tr><td>No Resource In this unit</td></tr>');
      $('.' + ul).twbsPagination({
        totalPages: page_count,
        onPageClick: function (event, page) {
          event.preventDefault();
        }
      });

    }

  }

  function getData(data, route) {
    $.ajax({
      type: 'POST',
      url: route,
      data: data,
      dataType: "json",
      success: function (status) {
        $(".loader-wrapper").addClass('hide');
        $('table .r_table_body').empty();
        for (var i = 0; i < status.length; i++) {

          if (status[i].resource_type_id == "1") {
            var type = "Video",
              mod = "r_video_table";

          }
          if (status[i].resource_type_id == "2") {
            var type = "Animation",
              mod = "r_anim_table";

          }
          if (status[i].resource_type_id == "3") {
            var type = "Presentation",
              mod = "r_pres_table";

          }
          if (status[i].resource_type_id == "4") {
            var type = "Interactive Activity",
              mod = "r_ia_table";

          }
          if (status[i].resource_type_id == "5") {
            var type = "Revision Notes",
              mod = "r_rn_table";

          }
          if (status[i].resource_type_id == "6") {
            var type = "Knowledge Nugget",
              mod = "r_kn_table";

          }

          var str = '<tr>' +
            '<td class="hide" data-value="' + status[i].resourceID + '">' + status[i].resourceID + '</td>' +
            '<td data-value="' + status[i].resourceName + '">' + status[i].resourceName + '</td>' +
            '<td data-value="' + status[i].resource_type_id + '">' + type + '</td>' +
            '<td data-value="' + status[i].h_name + '">' + status[i].h_name + '</td>' +
            '<td data-value="' + status[i].resourceID + '">' +
            '<p data-placement="top" data-toggle="tooltip" title="Confirm">' +
            '<button class="btn btn-primary btn-xs reConfirm" style="margin-top:1px;" data-title="Edit" data-toggle="modal" name="' + status[i].resourceID + '" data-target="#edit">' +
            '<span class="glyphicon glyphicon glyphicon-ok">' +
            '</span>' +
            '</button>' +
            '</p>' +
            '</td>' +
            '<td data-value="' + status[i].resourceID + '">' +
            '<p data-placement="top" data-toggle="tooltip" title="Delete">' +
            '<button class="btn btn-danger btn-xs reDelete" style="margin-top:1px;" data-title="Edit" data-toggle="modal" name="' + status[i].resourceID + '" data-target="#edit">' +
            '<span class="glyphicon glyphicon glyphicon-trash">' +
            '</span>' +
            '</button>' +
            '</p>' +
            '</td>' +
            '</tr>';

          $('table #' + mod + '_body').append(str);


        }


      }

    });

  }

  /* function toggle(type,target) {
   var st_url ="/resource/confirmData";
   var data = {
   'resource_id': type,
   _csrf: $('input[name=_csrf]').val(),
   };
   $.ajax({
   type: 'POST',
   url: st_url,
   data: data,
   dataType: "json",
   success: function(status) {
   if (status) {
   /!* if (status.length != 0 && status.status != "401" && status['details']) {
   $("#" + target).empty();
   for (var i = 0; i < status['details'].length; i++) {
   $("#" + target).append('<tr><td class="hide" data-value=' + status["details"][i].user_id + '>' + status['details'][i].user_id + '</td><td class="hide" data-value=' + status["details"][i].amount + '>' + status['details'][i].amount + '</td><td class="hide" data-value=' + status["details"][i].payment_method + '>' + status["details"][i].payment_method + '</td><td data-value=' + status["details"][i].email + '>' + status["details"][i].email + '</td><td data-value=' + status["details"][i].reference + '>' + status["details"][i].reference + '</td><td class="hide" data-value=' + status["details"][i].token + '>' + status["details"][i].token + '</td><td><p data-placement="top" data-toggle="tooltip" title="Confirm"><button class="btn btn-primary btn-xs ucaction" data-title="Edit"  id=' + status["details"][i].id + 'data-target=".bd-example-modal-lg"><span class="glyphicon glyphicon-check"></span></button> </p></td></tr>');
   }

   }

   if (!status['details']) {

   $("#" + target).empty();
   for (var i = 0; i < status.length; i++) {
   $("#" + target).append('<tr><td class="hide" data-value=' + status[i].user_id + '>' + status[i].user_id + '</td><td class="hide" data-value=' + status[i].amount + '>' + status[i].amount + '</td><td class="hide" data-value=' + status[i].payment_method + '>' + status[i].payment_method + '</td><td data-value=' + status[i].email + '>' + status[i].email + '</td><td data-value=' + status[i].reference + '>' + status[i].reference + '</td><td class="hide" data-value=' + status[i].token + '>' + status[i].token + '</td><td><p data-placement="top" data-toggle="tooltip" title="Confirm"><button class="btn btn-primary btn-xs ucactive_action" data-title="Edit"  id=' + status[i].id + 'data-target=".bd-example-modal-lg"><span class="glyphicon glyphicon-check"></span></button> </p></td></tr>');
   }


   }
   if (status.status == "401") {

   $("#" + target).empty();
   $("#" + target).append('<div class="form-group col-md-5 col-lg-offset-5 notfound">No Student Found</div>');

   }*!/


   }


   }

   });

   };
   toggle('1','r_video_table_body');
   $('[data-toggle="tab"]').click(function(e) {

   var $this = $(this),
   target = $this.attr('data-url'),
   r_type = $this.attr('data-path');
   //toggle(r_type,target);


   });*/

  $('[data-toggle="tab"]').click(function (e) {
    var unit_id= $("#u_type:optional").val();
    var $this = $(this),
      target = $this.attr('data-url'),
      r_type = $this.attr('data-path');
    //toggle(r_type,target);

    getDataCount(r_type, getDataCountRoute, target,unit_id);


  });
  $("select[name=sec_type]").on('change', function (e) {
    e.preventDefault();
    var $this = $(this),
      sec_id = $this.val();


    var data = {
      sec_type: sec_id,
      _csrf: $('input[name=_csrf]').val(),
    };

    $.ajax({
      type: 'POST',
      url: '/module/getModuleSec',
      data: data,
      dataType: "json",
      success: function (status) {
        if (status.data.length > 0) {
          $("#m_type").empty();
          $("#m_type").append("<option value=''>Select Modules</option>");
          for (var i = 0; i < status.data.length; i++) {
            $("#m_type").append("<option value=" + status.data[i].module_id + ">" + status.data[i].name + "</option>");
          }

        } else {

          $("#m_type").empty();
          $("#m_type").append(" <option value=''>No current module</option>");


        }

      }
    });


  });
 $('select[name=m_type]').on('change', function (e) {
    e.preventDefault();
    var $this = $(this),
      m_id = $this.val();


    var data = {
      m_type: m_id,
      _csrf: $('input[name=_csrf]').val(),
    };

    $.ajax({
      type: 'POST',
      url: '/initresourceunits',
      data: data,
      dataType: "json",
      success: function (status) {
        if (status['0'].length != 0) {
          $("#u_type").empty();
          $("#u_type").append(" <option value=''>Select Unit</option>");
          for (var i = 0; i < status['0'].length; i++) {
            $("#u_type").append("<option value=" + status['0'][i]['unit_id'] + ">" + status['0'][i]['unit_name'] + "</option>");
          }


        } else {
          $("#u_type").empty();
          $("#u_type").append(" <option value=''>No Current Unit</option>");
        }
      }
    });


  });
  $('select[name=u_type]').on('change', function (e) {
    e.preventDefault();
    var $this = $(this),
      u_id = $this.val();
    var data = {
      u_type: u_id,
      _csrf: $('input[name=_csrf]').val(),
    };

    $(".loader-wrapper").removeClass('hide');

    $.ajax({
      type: 'POST',
      url: '/unitResource',
      data: data,
      dataType: "json",
      success: function (status) {

        if (status.data.length > 0) {
          $('table .r_table_body').empty();
           for (var i = 0; i < status.data.length; i++) {
            i = i.toString();
            if (status.data[i].resource_type_id == "1") {
              var type = "Video",
                mod = "r_video_table";

            }
            if (status.data[i].resource_type_id == "2") {
              var type = "Animation",
                mod = "r_anim_table";


            }
            if (status.data[i].resource_type_id == "3") {
              var type = "Presentation",
                mod = "r_pres_table";


            }
            if (status.data[i].resource_type_id == "4") {
              var type = "Interactive Activity",
                mod = "r_ia_table";


            }
            if (status.data[i].resource_type_id == "5") {
              var type = "Knowledge Nugget",
                mod = "r_kn_table";


            }
            if (status.data[i].resource_type_id == "6") {
              var type = "Revision Notes",
                mod = "r_rn_table";


            }

             var str='<tr>' +
               '<td class="hide" data-value="' + status.data[i].resourceID + '">' + status.data[i].resourceID + '</td>' +
               '<td data-value="' + status.data[i].resourceName + '">' + status.data[i].resourceName + '</td>' +
               '<td data-value="' + status.data[i].resource_type_id + '">' + type + '</td>' +
               '<td data-value="' + status.data[i].h_name + '">' + status.data[i].h_name + '</td>' +
               '<td data-value="' + status.data[i].resourceID + '"><p data-placement="top" data-toggle="tooltip" title="Edit">' +
               '<button class="btn btn-primary btn-xs reConfirm" style="margin-top:1px;" data-title="Edit" data-toggle="modal" name="' + status.data[i].resourceID + '" data-target="#edit">' +
               '<span class="glyphicon glyphicon glyphicon-ok">' +
               '</span>' +
               '</button>' +
               '</p>' +
               '</td>' +
               '<td data-value="' + status.data[i].resourceID + '"><p data-placement="top" data-toggle="tooltip" title="Delete">' +
               '<button class="btn btn-danger btn-xs reDelete" style="margin-top:1px;" data-title="Delete" data-toggle="modal" name="' + status.data[i].resourceID + '" data-target="#edit">' +
               '<span class="glyphicon glyphicon glyphicon-trash">' +
               '</span>' +
               '</button>' +
               '</p>' +
               '</td>' +
               '</tr>';

             $('table #' + mod + '_body').append(str);

             $(".loader-wrapper").addClass('hide');


          }

        } else {
          $(".loader-wrapper").addClass('hide');
          $('table .r_table_body').empty();
          $('table .r_table_body').append('<tr><td>No Resource In this unit</td></tr>');


        }

      }
    });


  });
  $('html').on('click', '.reConfirm', function (e) {
    var id = $(this).attr('name');
    var target=$(this).closest('table').attr('id')+'_body';
    var currentRow = $(this).closest("tr");
    var rType = currentRow.find("td:eq(2)").data('value');
    var data = {
      'resource_id': id,
      _csrf: $('input[name=_csrf]').val(),
    };

    $.confirm({
      title: 'Confirm!',
      content: 'Are You want Confirm this Resource!',
      buttons: {
        OK: function () {
          $(".loader-wrapper").removeClass('hide');
          $.ajax({
            type: 'POST',
            url: '/resource/confirm',
            data: data,
            dataType: "json",
            success: function (status) {
              if (status.msg == "updated") {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success!',
                  content: 'Resource Confirm successfully!',
                  buttons: {
                    Done: function () {
                      getDataCount(rType, getDataCountRoute, target);
                    }

                  }
                });


              }


            }

          });
        },
        NO: function () {
          $(".loader-wrapper").removeClass('hide');
          getDataCount(rType, getDataCountRoute, target);
        }

      }
    });


  });
  $('html').on('click', '.confirmAll', function (e) {
    var type_id = $(this).attr('id');
    var target=  $(this).attr('data-path');
    var currentRow = $(this).closest("tr");
    var data = {
      'type_id': type_id,
      _csrf: $('input[name=_csrf]').val(),
    };

    $.confirm({
      title: 'Confirm!',
      content: 'Are You want Confirm All this Resource!',
      buttons: {
        OK: function () {
          $(".loader-wrapper").removeClass('hide');
          $.ajax({
            type: 'POST',
            url: '/resource/confirmAll',
            data: data,
            dataType: "json",
            success: function (status) {
              if (status.msg == "updated") {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success!',
                  content: 'Resource Confirm successfully!',
                  buttons: {
                    Done: function () {
                      getDataCount(type_id, getDataCountRoute, target);
                    }

                  }
                });


              }


            }

          });
        },
        NO: function () {
          $(".loader-wrapper").removeClass('hide');
          getDataCount(type_id, getDataCountRoute, target);
        }

      }
    });


  });
  $('html').on('click', '.reDelete', function (e) {
    var id = $(this).attr('name');
    var target=$(this).closest('table').attr('id')+'_body';
    var currentRow = $(this).closest("tr");
    var rType = currentRow.find("td:eq(2)").data('value');
    var resource_id = $(this).attr('name');
    var data = {
      'res_id': resource_id,
      'token': sessionStorage.getItem('token_tmp')

    };

    $.confirm({
      title: 'Confirm!',
      content: 'Are You want Delete this Resource!',
      buttons: {
        OK: function () {
          $(".loader-wrapper").removeClass('hide');
          $.ajax({
            type: 'POST',
            url: file_manager + '/files/resources/delete/',
            data: data,
            dataType: "json",
            success: function (status) {
          if (status.message == "Successfull") {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success!',
                  content: 'Resource Delete successfully!',
                  buttons: {
                    Done: function () {
                      getDataCount(rType, getDataCountRoute, target);
                    }

                  }
                });


              }


            }

          });
        },
        NO: function () {
          $(".loader-wrapper").removeClass('hide');
          getDataCount(rType, getDataCountRoute, target);
        }

      }
    });


  });


});
