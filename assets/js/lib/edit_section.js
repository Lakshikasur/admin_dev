$(document).ready(function () {
  $(".js-example-basic-multiple").select2({
    placeholder: "Select a Grade"
  });
  var getDataCountRoute = '/section/count';
  var getDataRoute = '/section/getPageData';
  var data = {
    'auth': sessionStorage.getItem('auth'),
    _csrf: $('input[name=_csrf]').val(),
  };

  function getDataCount(data, route) {

    $.ajax({
      type: 'POST',
      url: route,
      data: data,
      dataType: "json",
      success: function (status) {
        var count = status['0']['data_count'];
        pagination(count);

      }

    });


  }
  getDataCount(data, getDataCountRoute);
  function pagination(data) {

    var page = Math.ceil(data / 5);
    $(".loader-wrapper").removeClass('hide');
    if (page < 2) {
      $('.sync-pagination').twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute);

        }
      });

    }
    else {

      $('.sync-pagination').twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute);
        }
      });

    }

  }

  function getData(page, route) {


    $.ajax({
      type: 'POST',
      url: route,
      data: page,
      dataType: "json",
      success: function (status) {
        $(".loader-wrapper").addClass('hide');
        var section = status.section;
        var out_str = '';


        $("#section_table_data").empty();
        for (var i = 0; i < section.length; i++) {

          out_str += '<tr>';
          out_str += '<td data-value="'+section[i].id+'" class="hide">'+section[i].id+'</td>';
          out_str += '<td data-value="'+section[i].name+'">'+section[i].name+'</td>';
          out_str += '<td data-value="'+section[i].id+'" width="60%" >'+section[i].package+'</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Edit">';
          out_str += '<button class="btn btn-primary btn-xs usedit" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' +section[i].id + '" ';
          out_str += 'name="' + section[i].id + '" data-target="#edit"  id="' + section[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-pencil"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Delete">';
          out_str += '<button class="btn btn-danger btn-xs usdelete" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' + section[i].id + '" ';
          out_str += 'name="' +section[i].id + '" data-target="#delete">';
          out_str += '<span class="glyphicon glyphicon-trash"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '</tr>';

        }

        $("#section_table_data").html(out_str);

      }

    });

  }
  $('html').on('click','.usedit',function (e) {
    e.preventDefault();
    var packageid = $(this).attr('id');
    $('#sectionEditModel').modal({
      backdrop: 'static',
      keyboard: false
    });
    $('#sectionEditModel').modal('show');
    var currentRow = $(this).closest("tr");
    var sectionId = currentRow.find("td:eq(0)").data('value');
    var sectionName = currentRow.find("td:eq(1)").data('value');

    $('input[name=sec_name]').val(sectionName);
    $('input[name=section_id]').val(sectionId);


    //$('#packagemodel').modal('show');

  });
  $('html').on('click','.usdelete',function (e) {
    e.preventDefault();
    var packageid = $(this).attr('id');
    var data = {
      'sec_id': $(this).attr('id'),
      _csrf: $('input[name=_csrf]').val(),
    };

    $.confirm({
      title: 'Delete!',
      content: 'Are You want Remove the Section!',
      buttons: {
        OK: function () {
          $(".loader-wrapper").removeClass('hide');
          $.ajax({
            type: 'POST',
            url: '/section/remove',
            data: data,
            dataType: "json",
            success: function (status) {
              if (status.msg == "Success") {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success!',
                  content: 'Section delete successfully!',
                  buttons: {
                    Done: function () {
                      location.href = '/section/init?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });


              }


            }

          });
        },
        NO: function () {
          $(".loader-wrapper").removeClass('hide');
          location.href = '/section/init?auth=' + sessionStorage.getItem('token');
        }

      }
    });

  });
  $('#seditconfirm').click(function (e) {
    e.preventDefault();
    $(".loader-wrapper").removeClass('hide');
    var data = {
      'sec_id': $('input[name=section_id]').val(),
      'sec_name': $('input[name=sec_name]').val(),
      _csrf: $('input[name=_csrf]').val(),
    }
    $.ajax({
      type: 'POST',
      url: '/getEditSectionData',
      data: data,
      dataType: "json",
      success: function (status) {

        if (status.msg == "Success") {
          $(".loader-wrapper").addClass('hide');
          $.confirm({
            title: 'Success!',
            content: 'Section Update successfully!',
            buttons: {
              Done: function () {
                location.href = '/section/init?auth=' + sessionStorage.getItem('token');
              }

            }
          });


        }

      }

    });


  });
  $('#seditcancel').click(function (e) {
    e.preventDefault();
    location.href = "/section/init?auth=" + sessionStorage.getItem('token')

  });


});
