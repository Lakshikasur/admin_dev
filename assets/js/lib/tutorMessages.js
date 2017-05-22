/**
 * Created by TW-SD-05 on 13-Jan-17.
 */
$(document).ready(function() {

    _file = document.getElementById('fileupload'),

        $('#product-table a:first').tab('show');


    $('.tab-content').on('click', '.msgtble .h_inbox', function(e) {

        var data = {
            'msg_id': this.id,
        }


        $.ajax({
            type: 'POST',
            url: '/message/helperMsgView',
            crossOrigin: true,
            data: data,
            dataType: "json",
            cache: false,
            success: function(status) {
                $(".msgHlpTopic").empty();
                $(".msgContent").empty();
                if (status) {
                    $(".msgHlpTopic").append('<h3>' + status['0']['title'] + '</h3>');
                    $(".msgContent").append('<p>' + status['0']['content'] + '</p>');
                    $("#messageUserEmail").append('<span aria-hidden="true">&lt;</span>Lakshithaf@gmail.com<span aria-hidden="true">&gt;</span>');
                    $("#messageUserName").append("lakshithaf@gmail.com");
                    $("#messageHelperName").append("Physics Helper");
                    $(".messageModuleName").append(status['0']['module']);
                    $(".messageUnitName").append(status['0']['unit']);
                    $("#messageHelperName").css("color", "white");
                    $("#messageHelperName").css("background-color", "blue");
                    $(".msgMessageSendTime").append(status['0']['date_time']);

                    /*    if (status.attachmentData['0'].length > 0) {

                          localStorage.setItem('fileID', status.attachmentData["0"]["file_id"]);

                          $(".msgUserDataAttagement").css("border-bottom", "1px dotted #d8d8d8");
                          $(".msgUserDataAttagement").css("margin", "0 0 10px 0");
                          $(".msgUserDataAttagement").append('<span class="stu_attachment" ><div class="msg_attach_name" id="' + status.attachmentData["0"]["0"]["file_id"] + '">' + status.attachmentData["0"]["0"]["name"] + '.' + status.attachmentData["0"]["0"]["extension"] + '</div><span class="actionMsgView glyphicon glyphicon-eye-open"></span></span>');
                          $(".stu_attachment").css("margin", "10px 0 10px 0");
                          $('.msg_attach_name').css({
                            "background-image": "url('" + file_manager + "/files/message/" + token + "/" + status.attachmentData["0"]["0"]["file_id"] + "')",
                            "background-size": "cover",

                          });


                        }*/


                    $("#msg_id").val(status['0']['messageID'])



                }

            }

        });

        $('.adminMsgPanel').addClass('hide');
        $('.adminMsgReply').removeClass('hide');

    });
    $('#t_reply').on('click', function(event, cb) {
        event.preventDefault();

        var data = {
            'content': $('textarea#t_rcontent').val(),
            'msg_id': $('#msg_id').val(),
            'u_id': sessionStorage.getItem('auth'),
            _csrf: $('input[name=_csrf]').val(),
        };

        $.ajax({
            type: 'POST',
            url: '/message/helperMsgReply',
            crossOrigin: true,
            data: data,
            dataType: "json",
            cache: false,
            success: function(status) {
                var stat = status.msg ? true : false;
                if (stat) {

                    $.alert({
                        title: 'Success',
                        content: 'Reply Send successfully!',
                    });
                    location.href = '/messages/hinit?auth=' + sessionStorage.getItem('token');

                    /* upload($('#msg_id').val());*/


                }


            }

        });

        var upload = function(id) {

            if (_file.files.length === 0) {
                return;
            }

            var data = new FormData();
            data.append('attachment', _file.files[0]);
            data.append('token', sessionStorage.getItem('token'));
            data.append('msgID', id);


            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    try {
                        var resp = JSON.parse(request.response);
                    } catch (e) {
                        var resp = {
                            status: 'error',
                            data: 'Unknown error occurred: [' + request.responseText + ']'
                        };
                    }
                    // console.log(resp.status);

                    var st = resp.status == 200 ? true : false;
                    if (st) {


                    } else {


                    }

                }
            };

            request.open('POST', file_manager + '/files/upload/message/');
            request.send(data);

        }


    });

});