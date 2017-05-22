/**
 * Created by TW-SD-05 on 13-Jan-17.
 */

$(document).ready(function() {

    $("#tabs").tabs({
        show: function(event, ui) {
            window.location.hash = ui.panel.id;
        }
    });

    _file = document.getElementById('fileupload'),

        $('#product-table a:first').tab('show');


    $('.tab-content').on('click', '.msgtble .h_inbox', function(e) {

       alert("test");

        var data = {
            'msg_id': this.id,
            _csrf: $('input[name=_csrf]').val(),
        }


        $.ajax({
            type: 'POST',
            url: '/message/adminInboxMsgView',
            crossOrigin: true,
            data: data,
            dataType: "json",
            cache: false,
            success: function(status) {
                $(".msgTopic").empty();
                $(".msgContent").empty();
                $("#messageUserName").empty();
                $("#messageUserEmail").empty();
                $(".msgMessageSendTime").empty();
                var token = sessionStorage.getItem('token_tmp');
                $(".fancybox").fancybox({
                    width: 600,
                    height: 300,
                    type: 'iframe'
                });
                if (status) {
                    $(".msgTopic").append('<h3>' + status.data['0']['0']['subject'] + '</h3>');
                    $(".msgContent").append('<p>' + status.data['0']['0']['content'] + '</p>');
                    $("#messageUserEmail").append('<span aria-hidden="true">&lt;</span>' + status.data['0']['0']['reference'] + '<span aria-hidden="true">&gt;</span>');
                    $("#messageUserName").append(status.data['0']['0']['full_name']);
                    $("#messageHelperName").append(status.data['0']['0']['name']);
                    $("#messageHelperName").css("background-color", status.data['0']['0']['color']);
                    $("#messageHelperName").css("color", "white");
                    $(".msgMessageSendTime").append(status.data['0']['0']['date_time']);

                    if (status.attachmentData['0'].length > 0) {

                        localStorage.setItem('fileID', status.attachmentData["0"]["0"]["file_id"]);

                        $(".msgUserDataAttagement").css("border-bottom", "1px dotted #d8d8d8");
                        $(".msgUserDataAttagement").css("margin", "0 0 10px 0");
                        $(".msgUserDataAttagement").append('<span class="stu_attachment" ><div class="msg_attach_name" id="' + status.attachmentData["0"]["0"]["file_id"] + '">' + status.attachmentData["0"]["0"]["name"] + '.' + status.attachmentData["0"]["0"]["extension"] + '</div><span class="actionMsgView glyphicon glyphicon-eye-open"></span></span>');
                        $(".stu_attachment").css("margin", "10px 0 10px 0");
                        $('.msg_attach_name').css({
                            "background-image": "url('" + file_manager + "/files/message/" + token + "/" + status.attachmentData["0"]["0"]["file_id"] + "')",
                            "background-size": "cover",

                        });


                    }


                    $("#msg_id").val(status.data['0']['0']['messageID'])

                }

            }

        });


        $('.adminMsgPanel').addClass('hide');
        $('.adminMsgReply').removeClass('hide');


    });
    $('.tab-content').on('click', '.msgtbleReply .h_reply', function(e) {

        //alert("test");
        var data = {
            'msg_id': this.id,
            _csrf: $('input[name=_csrf]').val(),
        }


        $.ajax({
            type: 'POST',
            url: '/message/ShowReplyData',
            crossOrigin: true,
            data: data,
            dataType: "json",
            cache: false,
            success: function(status) {
                $(".msgTopic").empty();
                $(".msgContent").empty();
                $("#messageUserName").empty();
                $("#messageUserEmail").empty();
                $(".msgMessageSendTime").empty();
                var token = sessionStorage.getItem('token_tmp');
                $(".fancybox").fancybox({
                    width: 600,
                    height: 300,
                    type: 'iframe'
                });
                if (status) {
                    $(".msgTopic").append('<h3>' + status.data['0']['0']['subject'] + '</h3>');
                    $(".msgContent").append('<p>' + status.data['0']['0']['content'] + '</p>');
                    $("#messageUserEmail").append('<span aria-hidden="true">&lt;</span>' + status.data['0']['0']['reference'] + '<span aria-hidden="true">&gt;</span>');
                    $("#messageUserName").append(status.data['0']['0']['full_name']);
                    $("#messageHelperName").append(status.data['0']['0']['name']);
                    $("#messageHelperName").css("background-color", status.data['0']['0']['color']);
                    $("#messageHelperName").css("color", "white");
                    $(".msgMessageSendTime").append(status.data['0']['0']['date_time']);

                    if (status.attachmentData['0'].length > 0) {

                        localStorage.setItem('fileID', status.attachmentData["0"]["0"]["file_id"]);
                        $(".msgUserDataAttagement").css("border-bottom", "1px dotted #d8d8d8");
                        $(".msgUserDataAttagement").css("margin", "0 0 10px 0");
                        $(".msgUserDataAttagement").append('<span class="stu_attachment" ><div class="msg_attach_name" id="' + status.attachmentData["0"]["0"]["file_id"] + '">' + status.attachmentData["0"]["0"]["name"] + '.' + status.attachmentData["0"]["0"]["extension"] + '</div><span class="actionMsgView glyphicon glyphicon-eye-open"></span></span>');
                        $(".stu_attachment").css("margin", "10px 0 10px 0");
                        $('.msg_attach_name').css({
                            "background-image": "url('" + file_manager + "/files/message/" + token + "/" + status.attachmentData["0"]["0"]["file_id"] + "')",
                            "background-size": "cover",
                        });


                    }
                    if (status.reply.length > 0) {

                        for (var i = 0; i < status.reply.length; i++) {


                            out_str = '';
                            out_str += '<div class="col-md-8 ">';
                            out_str += '<img src="/images/profile_mask.png" class="ajn " style="background-color: #cccccc" aria-hidden="true">';
                            out_str += '<span id="replyUserName">' + status.reply[i]["id"] + '</span>';
                            out_str += '<span id="replyUserEmail"><span aria-hidden="true" class="' + status.reply[i]["id"] + '">&lt;</span>Tutor<span aria-hidden="true">&gt;</span></span>';
                            out_str += '<span id="replyHelperName">Lakshitha</span>';
                            out_str += '</div>';
                            out_str += '<div class="col-md-3 msgUserDataReplyTime">' + status.reply[i]["date_time"] + '</div>';
                            out_str += '<div class="col-md-10 replyContent"><p>' + status.reply[i]["content"] + '</p></div>';


                            $(".msgUserDataReply").append(out_str);
                            $(".msgUserDataReply").removeClass("hide");


                        }

                    }
                    $("#msg_id").val(status.data['0']['0']['messageID'])

                }

            }

        });


        $('.adminMsgPanel').addClass('hide');
        $('.adminMsgReply').removeClass('hide');


    });
    $('html').on('click', '.actionMsgView', function(e) {
        var token = sessionStorage.getItem('token_tmp');
        $('.enlargeMsgAttachment').css({
            "background-image": "url('" + file_manager + "/files/message/" + token + "/" + localStorage.getItem('fileID') + "')",
            "background-size": "cover",
            "height": "500px"
        });
        $('#msgAttachmentViewModal').modal('show');
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
            url: '/message/adminMsgReply',
            crossOrigin: true,
            data: data,
            dataType: "json",
            cache: false,
            success: function(status) {

                var stat = status.msg ? true : false;
                if (stat) {
                    $.confirm({
                        title: 'Success!',
                        content: 'Reply Send successfully!',
                        buttons: {
                            OK: function() {
                                location.href = '/messages/init?auth=' + sessionStorage.getItem('token');
                                /*upload($('#msg_id').val());*/
                            }

                        }
                    });


                }


            }

        });

        var upload = function(id) {

            if (_file.files.length === 0) {
                return;
            }

            var data = new FormData();
            data.append('attachment', _file.files[0]);
            data.append('token', localStorage.getItem('token'));
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
                        alert("Sucsess")

                    } else {


                    }

                }
            };

            request.open('POST', file_manager + '/files/upload/message/');
            request.send(data);

        }


    });
    $("div.adminMsgReply ul.breadcrumb li.inbox").on('click', 'a', function() {
        window.location.reload();

    });


});
