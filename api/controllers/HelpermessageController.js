module.exports = {
    loadinterface: function(req, res) {


        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));

        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            if (auth && auth1) {
                return res.view('messages/helper', {
                    role: role0,
                    name: name0,
                    auth: key
                });
            }
        } else {

            return res.redirect("/login");
        }


    },
    loadHelperView: function(req, res) {

        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            var u_id = dataSet.id ? dataSet.id : false;

            if (auth && auth1) {
                Message.query('SELECT id, `title`, `content`, `date_time`, `sender_id` AS user_id,helper_id FROM `tutor_help_message` WHERE delete_msg = 0 AND reply_count =0 AND helper_id IN ( SELECT `helper_id` FROM `user_helpers` WHERE user_id =' + u_id + ' ) ORDER BY date_time DESC;', function(err, msg) {

                    if (err) {

                        //console.log(err);
                        //res.send(401,JSON.stringify({msg:"Something wrong"}));
                        return res.view('404');
                    }

                    if (msg) {


                        //console.log(JSON.stringify(msg));
                        res.send(msg);

                        // res.send(200, msg);

                    }


                });

            }

        } else {

            return res.redirect("/login");
        }

    },
    viewHelperMessage: function(req, res) {

        var msg_id = req.body.msg_id;
        Message.query('SET @p0 =  ' + msg_id + '; CALL `spGetTuttorHelpMessageDetails` (@p0);', function(err, hlpermsg) {

            if (err) {

                // console.log(err);
                // res.send(401,JSON.stringify({msg:"Something wrong"}));
                return res.view('404');
            }

            if (hlpermsg) {


                var data_array = [];
                data_array = hlpermsg;
                data_array.splice(0, 1);
                data_array.splice((data_array.length - 1), 1);
                res.send(200, data_array[0]);
            }


        });

    },
    helperReply: function(req, res) {


        var content = req.body.content ? req.body.content : false;
        var messageID = req.body.msg_id ? req.body.msg_id : false;
        var u_id = req.body.u_id ? req.body.u_id : false;
        var d = new Date();
        var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        if (content && messageID && u_id && date) {
            Message.query('INSERT INTO `tutor_help_reply`(`content`, `status`, `replier_id`, `message_id`, `msg_delete`, `date_time`) VALUES ("' + content + '",' + 1 + ',' + u_id + ',' + messageID + ',' + 0 + ',"' + date + '");', function(err, msg) {

                if (err) {

                    // console.log(err);
                    // res.send(401,JSON.stringify({msg:"Something wrong"}));
                    return res.view('404');
                }

                if (msg) {

                    //console.log(msg);
                    res.send(200, { 'msg': 'ok' });
                }


            });


        }

    },
    gethelpermessage: function(req, res) {

        var unit_id = req.body.unit_id ? req.body.unit_id : false;
        var helper_id = req.body.helper_id ? req.body.helper_id : false;
        var token = req.body.token ? req.body.token : false;
        //  console.log(unit_id+'-'+helper_id+'-'+token);

        if (token && helper_id && unit_id) {
            Helpermessage.query('SET @p0="' + token + '"; CALL spGetStudentFromToken(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS userID, @p2 AS stdID, @p3 AS packID, @p4 AS countryID, @p5 AS gradeID, @p6 AS role;', function(err, msg) {
                if (err) {
                    // console.log(err);
                    // res.send(401,JSON.stringify({msg:"Something wrong"}));
                    return res.view('404');
                }
                if (msg) {

                    // console.log(msg);
                    var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
                    if (uid) {
                        Helpermessage.query('SELECT m.id as msg_id, m.title as msg_subject, m.content AS msg_content,' +
                            ' m.date_time AS message_date, r.content AS reply_content, r.date_time AS reply_date ' +
                            ' FROM tutor_help_message as m LEFT OUTER JOIN tutor_help_reply as r ON m.id = r.message_id where ' +
                            ' m.sender_id = ' + uid + ' AND  m.helper_id = ' + helper_id + ' AND m.unit_id = ' + unit_id +
                            ' ORDER BY m.date_time;',
                            function(err, msg) {
                                if (err) {
                                    // console.log(err);
                                    // res.send(401,JSON.stringify({msg:"Something wrong"}));
                                    return res.view('404');
                                }
                                if (msg) {
                                    res.send(200, msg);
                                } else {
                                    res.send(200, ({ "message": "no data" }));
                                }
                            });
                    }
                }
            });
        }
    },
    addMessage: function(req, res) {
        var st_token = req.body.st_token ? req.body.st_token : false;
        var subject_id = req.body.subject_id ? req.body.subject_id : false;
        var module_id = req.body.module_id ? req.body.module_id : false;
        var title = req.body.title ? req.body.title : false;
        var content = req.body.content ? req.body.content : false;
        var unit_id = req.body.unit_id ? req.body.unit_id : false;
        var helper_id = req.body.helper_id ? req.body.helper_id : false;
        var response_msg = 'error';

        if (st_token && content && helper_id) {
            Helpermessage.query('SET @p0="' + st_token + '"; CALL spGetStudentFromToken(@p0, @p1, @p2, @p3, @p4, @p5, @p6); ' +
                'SELECT @p1 AS userID, @p2 AS stdID, @p3 AS packID, @p4 AS countryID, @p5 AS gradeID, @p6 AS role;',
                function(err, msg) {
                    if (err) {
                        //console.log(err);
                        response_msg = "error";
                    }
                    if (msg) {
                        var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
                        if (uid) {
                            Helpermessage.query('SET @p0=' + uid + '; SET @p1=' + subject_id + '; SET @p2=' + module_id +
                                '; SET @p3=' + unit_id + '; SET @p4="' + title + '";SET @p5="' + content + '"; SET @p6=' + helper_id +
                                '; SELECT fnInsertTutorHelpMessage(@p0, @p1, @p2, @p3, @p4, @p5, @p6 ) AS fnInsertTutorHelpMessage;',
                                function(err, msg) {
                                    if (err) {
                                        response_msg = "error";
                                        //  console.log(err);
                                        res.send(200, ({ "message": response_msg }));
                                    }
                                    if (msg) {
                                        response_msg = "success";
                                        var id = msg['7']['0']['fnInsertTutorHelpMessage']
                                        res.send(200, ({ "message": response_msg, "id": id }));
                                        //  console.log(msg[4]);
                                    }
                                });
                        } else {
                            response_msg = "invalid";
                            res.send(200, ({ "message": response_msg }));
                        }
                    }
                });
        } else {
            response_msg = "invalid";
            res.send(200, ({ "message": response_msg }));
        }
        //res.send(200, ({"message":response_msg}));
    }
};