$(document).ready(function () {

  var getDataCountRoute = '/resource/unit_faq/count';
  var getDataRoute = '/resource/unit_faq/getPageData';


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
  getDataCount(getDataCountRoute, 'unit_faq_data');
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

      $('table #' + ul).append('<tr><td>No Resource In this unit</td></tr>');

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
        var faq = status.faq;
        var out_str = '';
        $('#'+target).empty();
        for (var i = 0; i < faq.length; i++) {

          faq[i].faq_answer= faq[i].faq_answer.replace(/<\/?img[^>]*>/g, "<img src='#'>");
          out_str += '<tr>';
          out_str += '<td data-value="'+faq[i].id+'" class="hide">'+faq[i].id+'</td>';
          out_str += '<td width="20%"  data-value="'+faq[i].name+'">'+faq[i].name+'</td>';
          out_str += '<td width="20%" data-value="'+faq[i].faq+'" >'+faq[i].faq+'</td>';
          out_str += '<td width="40%"  data-value="'+faq[i].faq_answer+'" >'+faq[i].faq_answer+'</td>';
          out_str += '<td data-value="'+faq[i].created_date+'" >'+faq[i].created_date+'</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Confirm">';
          out_str += '<button class="btn btn-primary btn-xs ufaq_view" style="margin-top: 1px;" data-title="Confirm" ';
          out_str += 'data-toggle="modal" id="' +faq[i].id + '" ';
          out_str += 'name="' + faq[i].id + '" data-target="#edit"  id="' + faq[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-eye-open"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Edit">';
          out_str += '<button class="btn btn-primary btn-xs ufaqedit" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' +faq[i].id + '" ';
          out_str += 'name="' + faq[i].id + '" data-target="#edit"  id="' + faq[i].id + '" >';
          out_str += '<span class="glyphicon glyphicon-pencil"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '<td>';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="Delete">';
          out_str += '<button class="btn btn-danger btn-xs ufaqdelete" style="margin-top: 1px;" data-title="Edit" ';
          out_str += 'data-toggle="modal" id="' + faq[i].id + '" ';
          out_str += 'name="' +faq[i].id + '" data-target="#delete">';
          out_str += '<span class="glyphicon glyphicon-trash"></span></button>';
          out_str += '</p>';
          out_str += '</td>';
          out_str += '</tr>'
          out_str += '<div>'+faq[i].faq+'</div>';;

        }

        $('#'+target).append(out_str);


      }

    });

  }
  $('html').on('click','.ufaqdelete',function (e) {
    e.preventDefault();
    var faqId = $(this).attr('id');
    var data = {
      'faqId':faqId,
      _csrf: $('input[name=_csrf]').val(),
    };

    $.confirm({
      title: 'Delete!',
      content: 'Are You want Remove this FAQ!',
      buttons: {
        OK: function() {
          $(".loader-wrapper").removeClass('hide');
          $.ajax({
            type: 'POST',
            url: '/deleteFaqData',
            data: data,
            dataType: "json",
            success: function(status) {
              if (status.msg == "Success") {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success!',
                  content: 'Unit FAQ delete successfully!',
                  buttons: {
                    Done: function() {
                      location.href = '/unit/faq/init?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });


              }


            }

          });
        },
        No: function() {
          $(".loader-wrapper").removeClass('hide');
          location.href = '/unit/faq/init?auth=' + sessionStorage.getItem('token');
        }

      }
    });

  })


});
