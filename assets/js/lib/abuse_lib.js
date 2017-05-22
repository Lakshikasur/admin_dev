
$(document).ready(function () {

  var getDataCountRoute = '/abuse/count';
  var getDataRoute = '/abuse/get_abuse_smry';
  $(function () {
      getDataCount(data, getDataCountRoute); 
  });
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


  function pagination(data) {
    var page = Math.ceil(data / 5);
    $('.sync-pagination').twbsPagination('destroy');
    $(".loader-wrapper").removeClass('hide');
    if (page > 1) {
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
    }  if (page == 1) {
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

    if (page == 0) {
      $("#abuse_smy_tbl").empty();
      $("#abuse_smy_tbl").html('<tr><td>No Prize Config Available</td></tr>');
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
        var out_str = '';
        $("#abuse_smy_tbl").empty();
        for (var i = 0; i < status.length; i++) {
          out_str += '<tr>';
          out_str += '<td>' + status[i].reference;
          out_str += '</td>';
          out_str += '<td>' + status[i].first_name+' '+ status[i].family_name;
          out_str += '</td>';
          out_str += '<td>' + status[i].email;
          out_str += '</td>';
          out_str += '<td>' + status[i].subject;
          out_str += '</td>';
          out_str += '<td>' + status[i].content;
          out_str += '</td>';          
          out_str += '<td><div class="input-group">';
          out_str += '<p data-placement="top" data-toggle="tooltip" title="View">';
          out_str += '<button   type="button" id="'+status[i].abuse_id+'" ';
          out_str += 'class="btn btn-primary btn-xs ab_btn" data-toggle="modal" data-target="#myModal" data-title="Edit" style="margin-top: 1px;">';
          out_str += '<span class="glyphicon glyphicon-eye-open"></span></button>';
          out_str += '</p>';
          out_str += '</div></td>';
          out_str += '</tr>';
        }
        $("#abuse_smy_tbl").html(out_str);
      
      }
    });
  }


 $('html').on('click','.ab_btn',function(){
      var abuse_id = $(this).attr("id");
      var route = '/abuse/details';
      var data = {
                'abuse_id': abuse_id,
                'auth': sessionStorage.getItem('auth'),
                _csrf: $('input[name=_csrf]').val(),
              };
       $.ajax({
          type: 'POST',
          url: route,
          data: data,
          dataType: "json",
          success: function (status) { }
      });

 })

  
 


});
