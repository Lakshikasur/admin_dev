

$(document).ready(function() {



  $('select[name=sel_module]').on('change', function(e) {
    e.preventDefault();
    var $this = $(this),
      m_id      = $this.val();
    var data  = {
      m_type: m_id,
      _csrf: $('input[name=_csrf]').val(),
    };
    $.ajax({
      type: 'POST',
      url: '/initresourceunits',
      data: data,
      dataType: "json",
      success: function(status) {
        if (status['0'].length != 0) {
          $("#sel_unit").empty();
          $("#sel_unit").append(" <option value=''>Select Unit</option>");

          for (var i = 0; i < status['0'].length; i++) {
            $("#sel_unit").append("<option value=" + status['0'][i]['unit_id'] + ">" + status['0'][i]['unit_name'] + "</option>");
          }
        } else {
          $("#sel_unit").empty();
          $("#sel_unit").append(" <option value=''>No Current Unit</option>");
        }
      }
    });
  });
  $('select[name=sel_unit]').on('change',function(e) {
    var getDataCountRoute = '/quest/count';
    var getDataRoute      = '/quest/get_quest_smry';
    var sel_module_id     = $("#sel_module").val();
    var sel_unit_id       = $("#sel_unit").val();


    var data = {
      'auth': sessionStorage.getItem('auth'),
      _csrf: $('input[name=_csrf]').val(),
      'sec_id': sessionStorage.getItem('sec_id'),
      'sel_module_id':sel_module_id,
      'sel_unit_id':sel_unit_id,
    };
    getDataCount(data, getDataCountRoute);




    function getDataCount(data, route ) {
      $.ajax({
        type:     'POST',
        url:      route,
        data:     data,
        dataType: "json",
        success: function (status) {
          var count = status['0']['data_count'];
          //alert(count);
          pagination(count);
        }
      });
    }


    function pagination(count) {
      var page = Math.ceil( count/5);
      $('.sync-pagination').twbsPagination('destroy');
      $(".loader-wrapper").removeClass('hide');
      if (page == 1) {
         $('.sync-pagination').twbsPagination({
          totalPages: page,
          onPageClick: function (event, page) {
            event.preventDefault();
            var page = {
              'page_id': page,
              'auth': sessionStorage.getItem('auth'),
              'sec_id': sessionStorage.getItem('sec_id'),
              _csrf: $('input[name=_csrf]').val(),
              'sel_module_id': $("#sel_module").val(),
              'sel_unit_id':   $("#sel_unit").val(),
            };
            getData(page, getDataRoute);

          }
        });

      }
      if (page > 1) {

        $('.sync-pagination').twbsPagination({
          totalPages: page,
          onPageClick: function (event, page) {
            event.preventDefault();
            var page = {
              'page_id': page,
              'auth': sessionStorage.getItem('auth'),
              'sec_id': sessionStorage.getItem('sec_id'),
              _csrf: $('input[name=_csrf]').val(),
              'sel_module_id': $("#sel_module").val(),
              'sel_unit_id':   $("#sel_unit").val(),
            };
            getData(page, getDataRoute);
          }
        });

      }
      if (page == 0) {
        $("#qsmry_table").empty();
        $("#qsmry_table").html('<tr><td>No Question In this unit</td></tr>');

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
          $("#qsmry_table").empty();
          for (var i = 0; i < status.length; i++) {
            out_str += '<tr>';
            out_str += '<td>'+status[i].question;
            out_str += '</td>';
            out_str += '<td>'+status[i].question_type;
            out_str += '</td>';
            out_str += '<td>'+status[i].description;
            out_str += '</td>';
            out_str += '<td>'+status[i].subject;
            out_str += '</td>';
            out_str += '<td>'+status[i].module_id;
            out_str += '</td>';
            out_str += '<td>'+status[i].unit_id;
            out_str += '</td>';
            out_str += '<td>'+status[i].grade;
            out_str += '</td>';
            out_str += '<td>'+status[i].curriculum;
            out_str += '</td>';
            out_str += '<td><div class="input-group">';

            out_str += '<p data-placement="top" data-toggle="tooltip" title="View">';
            out_str += '<button onclick="loadQuestDetails('+status[i].id+')" type="button" name="<%=status[i].id %>" ';
            out_str += 'class="btn btn-primary btn-xs upedit" data-toggle="modal" data-target="#myModal" data-title="Edit" style="margin-top: 1px;">';
            out_str += '<span class="glyphicon glyphicon-eye-open"></span></button>';
            out_str += '</p>';


            out_str += '<span data-placement="top" data-toggle="tooltip" title="Edit">';
            out_str += '<button class="btn btn-primary btn-xs upedit" style="margin-top: 1px;" data-title="Edit" ';
            out_str += 'data-toggle="modal" id="' +status[i].id + '" ';
            out_str += 'name="' + status[i].id + '" data-target="#edit"  id="' + status[i].id + '" >';
            out_str += '<span class="glyphicon glyphicon-pencil"></span></button>';
            out_str += '</span>';

            out_str += '<p data-placement="top" data-toggle="tooltip" title="Delete">';
            out_str += '<button onclick="deleteQuestion('+status[i].id+')" type="button" name="<%=status[i].id %>" ';
            out_str += ' class="btn btn-danger btn-xs updelete" style="margin-top: 1px;"  data-target="#delete" data-title="Edit"  data-toggle="modal" id="' + status[i].id + '" >';
            out_str += '<span class="glyphicon glyphicon-trash"></span></button>';
            out_str += '</p>';


            out_str += '</div></td>';
            out_str += '</tr>';
          }
          $("#qsmry_table").html(out_str);
        }
      });
    }



  });
  function deleteQuestion( question_id)  {
    var data = {
      'auth': sessionStorage.getItem('auth'),
      _csrf: $('input[name=_csrf]').val(),
      'sec_id': sessionStorage.getItem('sec_id'),
      'question_id': question_id,
    };
    $.confirm({
      title: 'Delete!',
      content: 'Are you want delete this Question?',
      buttons: {
        OK: function() {
          $(".loader-wrapper").removeClass('hide');
          path = 'quest/del_question';
          $.ajax({
            type: 'POST',
            url: path,
            data: data,
            dataType: "json",
            success: function (status) {
              if (status.msg == "success") {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success!',
                  content: 'Successfully Deleted!',
                  buttons: {
                    Done: function() {
                      location.href = 'quest/del_questio?auth=' + sessionStorage.getItem('token');
                    }
                  }
                });
              }
            }
          });
        },
        NO: function() {
          $(".loader-wrapper").removeClass('hide');
          //location.href = '/unit/init?auth=' + sessionStorage.getItem('token');
        }
      }
    });
  }
  function loadQuestDetails(question_id) {
    var data = {
      'auth': sessionStorage.getItem('auth'),
      _csrf: $('input[name=_csrf]').val(),
      'sec_id': sessionStorage.getItem('sec_id'),
      'question_id': question_id,
    };
    path = 'quest/get_details';
    $.ajax({
      type: 'POST',
      url: path,
      data: data,
      dataType: "json",
      success: function (rest ) {
        var quest_detl = rest.quest_data;

        var out_str = '';
        $("#quest_detail").empty();
        var out_strs = '';
        // out_strs  +=  '<div class="container">';
        out_strs  += '<table class="table ">';
        out_strs  += '<tbody>';
        out_strs  += '<tr><td><b>Question Id</b></td><td>'+quest_detl.id+'</td></tr>';
        out_strs  += '<tr><td><b>Question</b></td><td>'+quest_detl.question+'</td></tr>';
        out_strs  += '<tr><td><b>Question Type</b></td><td>'+quest_detl.quest_type_id+'</td></tr>';
        out_strs  += '<tr><td><b>Description</b></td><td>'+quest_detl.description+'</td></tr>';
        out_strs  += '<tr><td><b>Status</b></td><td>'+quest_detl.status+'</td></tr>';
        out_strs  += '<tr><td><b>Curriculum</b></td><td>'+quest_detl.curriculum+'</td></tr>';
        out_strs  += '<tr><td><b>Grade</b></td><td>'+quest_detl.grade+'</td></tr>';
        out_strs  += '<tr><td><b>Subject</b></td><td>'+quest_detl.subject+'</td></tr>';
        out_strs  += '<tr><td colspan=2>';

        out_strs  += '<table class="table ">';
        out_strs  += ' </table>';
        out_strs  += '<tbody>';
        out_strs  += '<tr><td><b>Question Id</b></td><td>'+quest_detl.id+'</td></tr>';
        out_strs  += '</td></tr>';
        out_strs  += '</tbody>';
        out_strs  += ' </table>';
        //  out_strs  += '</div>';

        /*
         var out_strs = '';
         out_strs  += '<div class="container">';
         out_strs  += '<div class="row">';
         out_strs  += '<div class="col-md4 col-md-offset-4 well"> ';
         out_strs  += '<div class="form-group">';
         out_strs  += '<label for="name">Email-ID</label>';
         // out_strs  += '<di class="form-control"   </span>';
         out_strs  += '</div>';
         out_strs  += '</div>';
         out_strs  += '</div>';
         out_strs  += '</div>';
         */
        /*
         out_str += '<form role="form">';
         out_str += '<div class="form-group">';
         out_str += '<label for="name">Question Id</label>';
         out_str += '<h5>'+quest_detl.id+'</h5> ';
         out_str += '</div>';

         out_str += '<div class="form-group">';
         out_str += '<label for="name">Question</label>';
         out_str += '<h5>'+quest_detl.question+'</h5> ';
         out_str += '</div>';

         out_str += '<div class="form-group">';
         out_str += '<label for="name">Question Type</label>';
         out_str += '<h5>'+quest_detl.quest_type_id+'</h5> ';
         out_str += '</div>';

         out_str += '<div class="form-group">';
         out_str += '<label for="name">Description</label>';
         out_str += '<h5>'+quest_detl.description+'</h5> ';
         out_str += '</div>';

         out_str += '<div class="form-group">';
         out_str += '<label for="name">Status</label>';
         out_str += '<h5>'+quest_detl.status+'</h5> ';
         out_str += '</div>';

         out_str += '<div class="form-group">';
         out_str += '<label for="name">Curriculum</label>';
         out_str += '<h5>'+quest_detl.curriculum+'</h5> ';
         out_str += '</div>';

         out_str += '<div class="form-group">';
         out_str += '<label for="name">Grade</label>';
         out_str += '<h5>'+quest_detl.grade+'</h5> ';
         out_str += '</div>';

         out_str += '<div class="form-group">';
         out_str += '<label for="name">Subject</label>';
         out_str += '<h5>'+quest_detl.subject+'</h5> ';
         out_str += '</div>';
         out_str += '</form>';

         */

        $("#quest_detail").html(out_strs);



        /*


         <label for="name">First name</label>
         <input type="name" class="form-control" id="fname" placeholder="Enter name">

         <div class="form-group">
         <label for="address">Second name</label>
         <input type="address" class="form-control" id="sname" placeholder="Enter surname">
         </div>
         <div class="form-group">
         <label for="email">Email</label>
         <input type="email" class="form-control" id="email" placeholder="Enter email">
         </div>
         <div class="form-group">
         <label for="pwd">Password</label>
         <input type="password" class="form-control" id="pwd" placeholder="Enter password">
         </div>


         */






        // alert(quest_data);


        //for (var i = 0; i < status.length; i++) {


        // }
        // $("#qsmry_table").html(out_str);
      }
    });



  }


});



