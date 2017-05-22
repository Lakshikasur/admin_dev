$(document).ready(function () {

  var getDataCountRoute = '/resource/unit_glossary/count';
  var getDataRoute = '/resource/unit_glossary/getPageData';


  function getDataCount(route, taget) {
    var target = taget;
    var data = {
      'token': sessionStorage.getItem('token'),
      'sec_type': sessionStorage.getItem('sec_id'),
      _csrf: $('input[name=_csrf]').val(),
    };
    $.ajax({
      type: 'POST',
      url: route,
      data: data,
      dataType: "json",
      success: function (status) {
        var count = status['0']['data_count'];
        pagination(count,target);

      }

    });


  }
  getDataCount(getDataCountRoute, 'unit_glossary_data');
  function pagination(data, ul) {

    var page = Math.ceil(data / 5);
    var select_target = "." + ul;
    $(select_target).twbsPagination('destroy');
    $(".loader-wrapper").removeClass('hide');
    if (page == 1) {
      $(select_target).twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            'sec_type': sessionStorage.getItem('sec_id'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute,ul);

        }
      });

    }
    if (page > 1) {

      $(select_target).twbsPagination({
        totalPages: page,
        onPageClick: function (event, page) {
          event.preventDefault();
          var page = {
            'page_id': page,
            'auth': sessionStorage.getItem('auth'),
            'sec_type': sessionStorage.getItem('sec_id'),
            _csrf: $('input[name=_csrf]').val(),
          };
          getData(page, getDataRoute,ul);
        }
      });

    }

    if (page == 0) {

      $('table #' + ul).append('<tr><td>No Glossary In this unit</td></tr>');

    }

  }
  function getData(page, route, target) {
    $.ajax({
      type: 'POST',
      url: route,
      data: page,
      dataType: "json",
      success: function (status) {

        $(".loader-wrapper").addClass('hide');
        var gloss = status.gloss;
        var out_str = '';
        $('#'+target).empty();
        for (var i = 0; i < gloss.length; i++) {

          gloss[i].glossary_mean=gloss[i].glossary_mean.replace(/<\/?img[^>]*>/g, "<img src='#'>");
          out_str += '<tr>';
          out_str += '<td data-value="'+gloss[i].id+'" class="hide">'+gloss[i].id+'</td>';
          out_str += '<td width="20%" data-value="'+gloss[i].name+'">'+gloss[i].name+'</td>';
          out_str += '<td width="20%"data-value="'+gloss[i].glossary_word+'" >'+gloss[i].glossary_word+'</td>';
          out_str += '<td width="30%" data-value="'+gloss[i].glossary_mean+'" >'+gloss[i].glossary_mean+'</td>';
          out_str += '<td width="10%" data-value="'+gloss[i].created_date+'" >'+gloss[i].created_date+'</td>';
          out_str += '<td width="7%">';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Confirm">';
          out_str += '<button class="btn btn-primary btn-xs tu_confirm" style="margin-top: 1px;" data-title="Confirm" ';
          out_str += 'data-toggle="modal" id="' +gloss[i].id + '" ';
          out_str += 'name="' + gloss[i].id + '" data-target="#edit"  id="' + gloss[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-eye-open"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '<td width="7%">';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Edit">';
          out_str += '<button class="btn btn-primary btn-xs usedit" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' +gloss[i].id + '" ';
          out_str += 'name="' + gloss[i].id + '" data-target="#edit"  id="' + gloss[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-pencil"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '<td width="6%">';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Delete">';
          out_str += '<button class="btn btn-danger btn-xs uglossdelete" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' + gloss[i].id + '" ';
          out_str += 'name="' +gloss[i].id + '" data-target="#delete">';
          out_str += '<span class="glyphicon glyphicon-trash"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '</tr>';

        }

        $('#'+target).html(out_str);


      }

    });

  }
  $('html').on('click','.uglossdelete',function (e) {
    e.preventDefault();
    var glossId = $(this).attr('id');
    var data = {
      'glossId':glossId,
      _csrf: $('input[name=_csrf]').val(),
    };

    $.confirm({
      title: 'Delete!',
      content: 'Are You want Remove this Glossary!',
      buttons: {
        OK: function() {
          $(".loader-wrapper").removeClass('hide');
          $.ajax({
            type: 'POST',
            url: '/deleteGlossData',
            data: data,
            dataType: "json",
            success: function(status) {
              if (status.msg == "Success") {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success!',
                  content: 'Unit Glossary delete successfully!',
                  buttons: {
                    Done: function() {
                      location.href = '/unit/glossary/init?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });


              }


            }

          });
        },
        No: function() {
          $(".loader-wrapper").removeClass('hide');
          location.href = '/unit/glossary/init?auth=' + sessionStorage.getItem('token');
        }

      }
    });

  })


});
