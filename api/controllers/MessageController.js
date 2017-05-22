/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  loadinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    // console.log(dataSet);

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      if (auth && auth1) {
        return res.view('messages/index', {
          role: role0,
          name: name0,
          auth: key
        });
      }
    } else {

      return res.redirect("/login");
    }
    //
    // console.log("test");
  },
  loadAdminView: function (req, res) {
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var u_id = dataSet.id ? dataSet.id : false;

      if (auth && auth1) {
        Message.query('SELECT id, `subject`, `content`, `date_time`, `user_id` ,helper_id FROM `message` WHERE msg_delete = 0 AND reply_count =0 AND helper_id IN ( SELECT `helper_id` FROM `user_helpers` WHERE user_id =' + u_id + ') ORDER BY date_time DESC', function (err, msg) {

          if (err) {

            // console.log(err);
            res.send(401, JSON.stringify({msg: "Something wrong"}));
            // return res.view('404');
          }

          if (msg) {


            //console.log(JSON.stringify(msg));
            res.send(200, msg);

            // res.send(200, msg);

          }


        });

      }

    } else {
      return res.redirect("/login");
    }


  },
  loadAdminSend: function (req, res) {
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var u_id = dataSet.id ? dataSet.id : false;

      if (auth && auth1) {
        Message.query('SELECT id, `subject`, `content`, `date_time`, `user_id` ,helper_id FROM `message` WHERE msg_delete = 0 AND reply_count =1 AND helper_id IN ( SELECT `helper_id` FROM `user_helpers` WHERE user_id =' + u_id + ') ORDER BY id DESC', function (err, msg) {

          if (err) {
            res.send(401, JSON.stringify({msg: "Something wrong"}));

          }
          if (msg) {
            /* var loop_count = 0;
             var msg_data = [];
             for (var i = 0; i < msg.length; i++) {
             Message.query('SELECT  `id`, `date_time`,`content` FROM `reply` WHERE `msg_delete`=0 AND `message_id`=' + msg[i]['id'] + ' ORDER BY date_time ASC;', function (err, reply) {

             if (err) {
             loop_count++;
             if (loop_count == msg.length) {
             res.send(401, JSON.stringify({msg: "Something wrong"}));
             }

             }

             if (reply) {

             loop_count++;
             msg_data[loop_count - 1] = {message: msg[loop_count - 1], reply: reply};

             if (loop_count == msg.length) {

             res.send(200, msg_data);
             }


             }


             });


             }*/

            res.send(200, msg);

          }


        });

      }

    } else {
      return res.redirect("/login");
    }

  },
  loadAdminSendDataByID: function (req, res) {
    var msg_id = req.body.msg_id;
    Message.query('SET @p0=' + msg_id + '; CALL `spGetMessage`(@p0);', function (err, msg) {

      if (err) {
        res.send(401, JSON.stringify({msg: "Something wrong"}));
      }

      if (msg) {

        var array = [];
        array = msg;
        array.splice(0, 1);
        array.splice((array.length - 1), 1);

        Message.query('SET @p0=' + msg_id + '; CALL `spGetMessageAttachment`(@p0);', function (err, msgAtt) {

          if (err) {

            //console.log(err);
            res.send(401, JSON.stringify({msg: "Something wrong"}));
            // return res.view('404');
          }

          if (msgAtt) {


            Message.query('SELECT  `id`, `date_time`,`content` FROM `reply` WHERE `msg_delete`=0 AND `message_id`=' + msg_id + ' ORDER BY date_time ASC;', function (err, reply) {

              if (err) {
                res.send(401, JSON.stringify({msg: "Something wrong"}));

              }

              if (reply) {

                var att_array = [];
                att_array = msgAtt;
                att_array.splice(0, 1);
                att_array.splice((att_array.length - 1), 1);
                res.send(200, {data: array, attachmentData: att_array, reply: reply});


              }


            });

          }


        });


        //console.log(array);


      }


    });


  },
//    loadStudentSent: function (req, res) {
//
//        console.log(req.body.st_token)
//
//        var st_token = req.body.st_token ? req.body.st_token : false;
//        var pageID = req.body.pageID ? req.body.pageID : false;
//        var pageLimit = 10;
//        if (!pageID) {
//            var stlimit = 0;
//            var endlimit = 10;
//        } else {
//            var stlimit = (pageID - 1) * pageLimit;
//            var endlimit = (stlimit + pageLimit);
//
//        }
//
//
//        if (st_token && endlimit) {
//            Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
//                if (err) {
//                    // console.log(err);
//                    res.send(401, JSON.stringify({msg: "Something wrong"}));
//                }
//                if (msg) {
//
//                    //console.log(msg);
//
//                    var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
//                    //console.log(uid);
//                    if (uid) {
//                        Message.query('SET @p0 =  ' + uid + ';SET @p1 =  ' + stlimit + ';SET @p2 =  ' + endlimit + ';CALL `spGetSendMessage` (@p0 , @p1 , @p2);', function (err, msg) {
//                            if (err) {
//                                // console.log(err);
//                                res.send(401, JSON.stringify({msg: "Something wrong"}));
//                            }
//                            if (msg) {
//
//                                msg.splice(0, 1);
//                                msg.splice(0, 1);
//                                msg.splice(0, 1);
//                                msg.splice((msg.length - 1), 1);
//                                res.send(200, msg[0]);
//                            }
//
//
//                        });
//
//
//                    }
//
//
//                }
//
//            });
//
//        }
//
//    },

  loadHelpers: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    if (st_token) {
      Message.query('SELECT * FROM helpers', function (err, data) {
        if (err) {
          // console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
          // return res.view('404');
        }
        if (data) {

          //console.log(data);
          res.send(200, data);
        }

      });

    }


  },
  insertComposeImages: function (req, res) {

  },
  insertMessage: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var title = req.body.title ? req.body.title : false;
    var content = req.body.content ? req.body.content : false;
    var helperID = req.body.helperid ? req.body.helperid : false;

    function mysql_real_escape_string(str) {
      return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
          case "\0":
            return "\\0";
          case "\x08":
            return "\\b";
          case "\x09":
            return "\\t";
          case "\x1a":
            return "\\z";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
            return "\\" + char; // prepends a backslash to backslash, percent,
          // and double/single quotes
        }
      });
    }
    ;
    //console.log(st_token);

    if (st_token && title && content && helperID) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          // console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
          // return res.view('404');
        }
        if (msg) {

          // console.log(msg);

          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          // console.log(uid);
          if (uid) {
            Message.query('SET @p0=' + uid + '; SET @p1="' + mysql_real_escape_string(title) + '"; SET @p2="' + mysql_real_escape_string(content) + '"; SET @p3=' + helperID + '; SELECT `fnInsertMessage`(@p0, @p1, @p2, @p3) AS `fnInsertMessage`;', function (err, msg) {

              if (err) {

                console.log(err);
                // res.send(401, JSON.stringify({msg: "Something wrong"}));
                // return res.view('404');
              }
              if (msg) {

//                                  console.log(msg);
                // console.log(msg[4]);

                res.send(200, msg[4]);
              }
            });
          }
        }
      });
    }
  },
  viewReplyMessage: function (req, res) {

    var msg_id = req.body.msg_id;
    Message.query('SET @p0=' + msg_id + '; CALL `spGetMessageReply`(@p0);', function (err, msg) {

      if (err) {

        // console.log(err);
        res.send(401, JSON.stringify({msg: "Something wrong"}));
        // return res.view('404');
      }

      if (msg) {
        // console.log(msg);

        var array = [];
        array = msg;
        array.splice(0, 1);
        array.splice((array.length - 1), 1);
        // console.log(array['0']);
        res.send(200, array['0']);
      }


    });

  },
  // viewMessage: function (req, res) {

  //   var msg_id = req.body.msg_id;
  //   Message.query('SET @p0=' + msg_id + '; CALL `spGetMessage`(@p0);', function (err, msg) {

  //     if (err) {

  //       //console.log(err);
  //       res.send(401, JSON.stringify({msg: "Something wrong"}));
  //       // return res.view('404');
  //     }

  //     if (msg) {

  //       var array = [];
  //       array = msg;
  //       array.splice(0, 1);
  //       array.splice((array.length - 1), 1);

  //       Message.query('SET @p0=' + msg_id + '; CALL `spGetMessageAttachment`(@p0);', function (err, msgAtt) {

  //         if (err) {

  //           //console.log(err);
  //           res.send(401, JSON.stringify({msg: "Something wrong"}));
  //           // return res.view('404');
  //         }

  //         if (msgAtt) {
  //           var att_array = [];
  //           att_array = msgAtt;
  //           att_array.splice(0, 1);
  //           att_array.splice((att_array.length - 1), 1);
  //           res.send(200, {data: array, attachmentData: att_array});
  //         }


  //       });


  //       //console.log(array);


  //     }


  //   });
  // },

  adminReply: function (req, res) {

    var content = req.body.content ? req.body.content : false;
    var messageID = req.body.msg_id ? req.body.msg_id : false;
    var u_id = req.body.u_id ? req.body.u_id : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    if (content && messageID && u_id && date) {
      Message.query('SET @p0=' + u_id + '; SET @p1=' + messageID + '; SET @p2="' + content + '"; CALL `spInsertReply`(@p0, @p1, @p2, @p3); SELECT @p3 AS `st`;', function (err, msg) {

        if (err) {

          //  console.log(err);
          //  res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }

        if (msg) {

          //console.log(msg);
          res.send(200, {'msg': 'ok'});
        }


      });

    }

  },
  deleteMessage: function (req, res) {

    console.log('delete message-------');
    var msg_ids = req.body.ids ? req.body.ids : false;
    console.log('delete message-------' + msg_ids);
//        var completed_requests = 0;
//        var id = JSON.parse(msg_ids);
    if (msg_ids) {
      var query = 'update message as m left join reply r on m.id = r.message_id set m.msg_delete=1, r.msg_delete=1 where m.id in (' + msg_ids + ')';
//            var msgDelete = function (data, callback) {
      console.log(query);
      Message.query(query, function (err, msg) {

        if (err) {
          console.log(err);
        }
        if (msg) {
          res.send(200, msg);
        }
      });
//            };
//            for (var i = 0; i < id.length; i++) {
//                msgDelete(id[i], function (err, data) {
//                    if (err) {
//
//                        res.send(401, JSON.stringify({msg: "Something wrong"}));
//                    }
//
//                    if (data) {
//                        completed_requests++;
//                        if (completed_requests == (id.length)) {
//                            var st = data[2][0]['st'] == 'T' ? data[2][0]['st'] : false;
//                            if (st) {
//                                res.send(200, {st: 'T'});
//                            } else {
//                                res.send(401, {st: 'F'});
//                            }
//                        }
//                    }
//                });
//            }
    }
  },
  deleteForeverMessage: function (req, res) {

    var msg_ids = req.body.msg_id ? req.body.msg_id : false;
    console.log('inside delete forever message --- ' + msg_ids);
    var completed_requests = 0;
//        var id = JSON.parse(msg_ids);//------------------------------------------------need to fix
    console.log('inside delete forever message --- ' + msg_ids);
    if (msg_ids) {
      var query = 'delete from message where id in (' + msg_ids + ')';
//            var msgDelete = function (data, callback) {
      console.log(query);
      Message.query(query, function (err, msg) {
        if (err) {
          //  console.log(err);
          //  res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }
        if (msg) {
          //console.log(msg);
          res.send(200, msg);
        }
      });
//            };
//            for (var i = 0; i < id.length; i++) {//------------------------------------need to fix
//                msgDelete(id[i], function (err, data) {
//                    if (err) {
//
//                        res.send(401, JSON.stringify({msg: "Something wrong"}));
//                    }
//
//                    if (data) {
//                        completed_requests++;
//                        if (completed_requests == (id.length)) {
//                            var st = data[2][0]['st'] == 'T' ? data[2][0]['st'] : false;
//                            if (st) {
//                                res.send(200, {st: 'T'});
//                            } else {
//                                res.send(401, {st: 'F'});
//                            }
//                        }
//                    }
//                });
//            }
    }
  },
  deleteTutorMessage: function (req, res) {
    var msg_ids = req.body.ids ? req.body.ids : false;
    var completed_requests = 0;
    var ids = msg_ids.length;
    console.log(msg_ids);

    if (msg_ids) {
      var query = 'update tutor_help_message as m left join tutor_help_reply r on m.id = r.message_id set m.delete_msg=1, r.msg_delete=1 where m.id in (' + msg_ids + ')';
//            console.log("-0-0-0------"+query);
//            var msgDelete = function (data, callback) {
      Message.query(query, function (err, msg) {
        if (err) {
          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          res.send(200, {affectedRows: ids});
        }
      });
//            };
//            for (var i = 0; i < id.length; i++) {
//                msgDelete(id[i], function (err, data) {
//                    if (err) {
//
//                        res.send(401, JSON.stringify({msg: "Something wrong"}));
//                    }
//
//                    if (data) {
//                        completed_requests++;
//                        if (completed_requests == (id.length)) {
//                            var st = data[2][0]['st'] == 'T' ? data[2][0]['st'] : false;
//                            if (st) {
//                                res.send(200, {st: 'T'});
//                            } else {
//                                res.send(401, {st: 'F'});
//                            }
//                        }
//                    }
//                });
//            }
    }
  },
  updateMessage: function (req, res) {

    Message.query("", function (err, msg) {

      if (err) {

        // console.log(err);
        res.send(401, JSON.stringify({msg: "Something wrong"}));
      }

      if (msg) {

        // console.log(msg);
      }


    });

  },
  updateMessageStatus: function (req, res) {

    var msg_id = req.body.msg_id ? req.body.msg_id : false;
    var st = req.body.st ? req.body.st : false;

    Message.query('SET @p0=' + msg_id + '; SET @p1=' + st + '; SELECT `fnUpdateMessageStatus`(@p0, @p1) AS `fnUpdateMessageStatus`;', function (err, msg) {

      if (err) {

        //console.log(err);
        res.send(401, JSON.stringify({msg: "Something wrong"}));
      }

      if (msg) {
        //console.log(msg[2][0]);
        var st = msg[2][0]['fnUpdateMessageStatus'] == 'T' ? msg[2][0]['fnUpdateMessageStatus'] : false;

        if (st) {
          res.send(200, {st: 'T'});

        } else {
          res.send(401, {st: 'F'});

        }

      }


    });

  },
  helperMessages: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var help_id = req.body.help_id;
    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          // console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {

          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          Message.query('SELECT m.id as msg_id,m.subject as msg_subject, m.content AS msg_content, m.date_time AS message_date, r.content AS reply_content, r.date_time AS reply_date ' +
            'FROM message as m ' +
            'LEFT OUTER JOIN reply as r ' +
            'ON m.id = r.message_id where m.user_id =' + uid +
            ' AND m.helper_id =' + help_id + ';',
            function (err, msg) {

              if (err) {

                //console.log(err);
                res.send(401, JSON.stringify({msg: "Something wrong"}));
              }
              if (msg) {
                res.send(200, msg);
              }
            });

        }
      });

    }

  },
  stSentCount: function (req, res) {
    var st_token = req.body.st_token ? req.body.st_token : false;
    // console.log("test");

    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          // console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
        } else {

          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          //console.log(uid);
          if (uid) {

            Message.query('SELECT COUNT(`id`) as count FROM `message` WHERE user_id =' + uid + ' AND msg_delete= 0 ;', function (err, msg) {
              if (err) {
                //console.log(err);
                res.send(401, JSON.stringify({msg: "Something wrong"}));
              }
              if (msg) {
                //console.log(msg);
                res.send(200, msg);
              }


            });


          }

        }


      });

    }

  },
  stInboxCount: function (req, res) {
    var st_token = req.body.st_token ? req.body.st_token : false;
    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          /// console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
        } else {

          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          //console.log(uid);
          if (uid) {

            Message.query('SELECT COUNT(message.id) AS count FROM message , reply where message.user_id =' + uid + ' AND message.id = reply.message_id AND reply.`status` = 0 AND message.`msg_delete`= 0;', function (err, msg) {
              if (err) {
                // console.log(err);
              }
              if (msg) {

                res.send(200, msg);
              }


            });


          }

        }


      });

    }

  },

//by Rajith----------------------------------------------------

  stdTrashLoad: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var pageID = req.body.pageID ? req.body.pageID : false;
    var pageLimit = 10;
    var stlimit = 0;
    if (!pageID) {
      stlimit = 0;
    } else {
      stlimit = (pageID - 1) * pageLimit;

    }
    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            // console.log(uid);
//                        var query = 'SELECT m.id, '+
//                                'm.subject, m.content, '+
////                                'r.id, '+
//                                'GROUP_CONCAT(ma.message_id SEPARATOR ",") as atmt FROM '+
//                                'message as m '+
//                                'left join message_attachment ma on m.id = ma.message_id '+
//                                'left join reply r on m.id = r.message_id '+
//                                'where m.msg_delete = 1 and msuer_id =' + uid + ' limit ' + stlimit + ',' + pageLimit;

            var query = 'SELECT distinct ' +
              'm.id, m.subject, m.content, m.date_time, ' +
              'ma.id as atmt, ' +
              'sum(r.id) as rid ' +
              'FROM message as m ' +
              'left join message_attachment ma on m.id = ma.message_id ' +
              'left join reply r on m.id = r.message_id ' +
              'where m.msg_delete = 1 and m.user_id =' + uid + ' ' +
              'group by m.id limit ' + stlimit + ',' + pageLimit +
              '';

            console.log(query);
            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  // console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
                  //console.log(data);
                  res.send(200, data);
                }
              });
            }
          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }
      });
    }
  },
  loadStudentSent: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var pageID = req.body.pageID ? req.body.pageID : false;
    var pageLimit = 10;
    var stlimit = 0;
    if (!pageID) {
      stlimit = 0;
    } else if (pageID <= 0) {
      console.log(pageID + "------------------below");
      stlimit = 0;
    } else {
      console.log(pageID + "------------------else");
      stlimit = (pageID - 1) * pageLimit;

    }
    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          // console.log(msg);
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            // console.log(uid);
            var query = 'SELECT distinct ' +
              'm.*, ' +
              'ma.id as atmt, ' +
              'sum(r.id) as rid ' +
              'FROM message as m ' +
              'left join message_attachment ma on m.id = ma.message_id ' +
              'left join reply r on m.id = r.message_id ' +
              'where m.msg_delete = 0 and m.user_id =' + uid + ' ' +
              'group by m.id order by m.id desc limit ' + stlimit + ',' + pageLimit +
              '';
            console.log(query);
            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
                  // console.log(data);
                  res.send(200, data);
                }

              });

            }

          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }

      });

    }
  },
  loadStudentInbox: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var pageID = req.body.pageID ? req.body.pageID : false;
    var pageLimit = 10;
    var stlimit = 0;
    if (!pageID) {
      stlimit = 0;
    } else {
      stlimit = (pageID - 1) * pageLimit;

    }
    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          // console.log(msg);
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            console.log(uid);
            var query = 'select distinct ' +
              'm.id, m.subject, m.content, ' +
              'm.date_time, ' +
              'GROUP_CONCAT(r.status SEPARATOR ",") as status, ' +
              'GROUP_CONCAT(ma.message_id SEPARATOR ",") as att ' +
              // ' * '+
              'from message as m ' +
              'left join reply as r on m.id =  r.message_id ' +
              'left join message_attachment as ma on m.id = ma.message_id ' +
              'where m.user_id=' + uid + ' and ' +
              'r.id is not NULL and ' +
              'r.user_id != ' + uid + ' and ' +
              'm.msg_delete = 0 ' +
              'group by m.id order by r.id limit ' + stlimit + ',' + pageLimit;
            console.log(query);
            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
                  // console.log(data);
                  res.send(200, data);
                }

              });

            }

          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }

      });

    }
  },
  stdTutorHelpLoad: function (req, res) {
    var st_token = req.body.st_token ? req.body.st_token : false;
    var pageID = req.body.pageID ? req.body.pageID : false;
    var pageLimit = 10;
    if (!pageID) {
      var stlimit = 0;
      var endlimit = 10;
    } else {
      var stlimit = (pageID - 1) * pageLimit;
      var endlimit = (stlimit + pageLimit);

    }
    if (st_token && endlimit) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            // console.log(uid);
            if (st_token) {
              Message.query('SELECT m.*, ma.id as atmt FROM message as m left join message_attachment ma on m.id = ma.message_id where msg_delete = 1 and user_id =' + uid, function (err, data) {
                if (err) {
                  // console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
                  //console.log(data);
                  res.send(200, data);
                }
              });
            }
          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }
      });
    }
  },
//    deleteMessage: function (req, res) {
//
//        var st_token = req.body.st_token ? req.body.st_token : false;
//        var msg_ids = req.body.ids ? req.body.ids : false;
//
//        // var pageID = req.body.pageID ? req.body.pageID : false;
//        // var pageLimit = 10;
//        // if (!pageID) {
//        //   var stlimit = 0;
//        //   var endlimit = 10;
//        // } else {
//        //   var stlimit = (pageID - 1) * pageLimit;
//        //   var endlimit = (stlimit + pageLimit);
//        // }
//
//        Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
//            if (err) {
//                res.send(200, JSON.stringify({msg: "Something wrong"}));
//            }
//            if (msg) {
//                var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
//                var count = 0;
//                if (uid) {
//                    // console.log(uid);
//                    for (var i = 0; i < msg_ids.length; i++) {
//                        var query = 'update message set msg_delete=1 where user_id=' + uid + ' and id=' + msg_ids[i];
//                        if (msg_ids) {
//
//                            Message.query(query, function (err, data) {
//                                if (err) {
//
//                                    res.send(401, JSON.stringify({msg: "Something wrong"}));
//                                }
//                                if (data) {
//                                    count++;
//                                    if (count == msg_ids.length) {
//                                        res.send(200, JSON.stringify({status: ""}));
//                                    }
//
//                                }
//                            });
//                        }
//                    }
//                }
//                if (!uid) {
//                    res.send(200, "Invalid User");
//                }
//            }
//        });
//    },
  updateReplyStatus: function (req, res) {
    var st_token = req.body.st_token ? req.body.st_token : false;
    var msg_ids = req.body.ids ? req.body.ids : false;

    var query = 'update message as m left join reply r on m.id = r.message_id set m.status=1, r.status=1 where m.id in (' + msg_ids + ')';
    console.log(query);
    if (msg_ids) {

      Message.query(query, function (err, data) {
        if (err) {

          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (data) {
          res.send(200, data);
        }
      });
    }
  },
  updateReplyTutorStatus: function (req, res) { //------------- to be done
    var st_token = req.body.st_token ? req.body.st_token : false;
    var msg_ids = req.body.ids ? req.body.ids : false;

    var query = 'update tutor_help_message as m left join tutor_help_reply r on m.id = r.message_id set m.status=1, r.status=1 where m.id in (' + msg_ids + ')';
    console.log(query);
    if (msg_ids) {

      Message.query(query, function (err, data) {
        if (err) {
          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (data) {
          res.send(200, data);
        }
      });
    }
  },
  inboxReply: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var content = req.body.content ? req.body.content : false;
    var messageId = req.body.messageId ? req.body.messageId : false;

    function mysql_real_escape_string(str) {
      return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
          case "\0":
            return "\\0";
          case "\x08":
            return "\\b";
          case "\x09":
            return "\\t";
          case "\x1a":
            return "\\z";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
            return "\\" + char; // prepends a backslash to backslash, percent,
          // and double/single quotes
        }
      });
    }
    ;

    Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
      if (err) {
        res.send(200, JSON.stringify({msg: "Something wrong"}));
      }
      if (msg) {
        var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
        var count = 0;
        if (uid) {
          // console.log(uid);
          // console.log(uid+content+messageId);
          var query = 'insert into reply (user_id,message_id,date_time,content) values ( "' + uid + '","' + mysql_real_escape_string(messageId) + '",now(),"' + mysql_real_escape_string(content) + '" )';
          // console.log(query);
          Message.query(query, function (err, data) {
            if (err) {
              // console.log(err);
              res.send(401, JSON.stringify({msg: "Something wrong"}));
              // return res.view('404');
            }
            if (data) {
              // console.log(data);
              res.send(200, data);
            }

          });
        }
        if (!uid) {
          res.send(200, "Invalid User");
        }
      }
    });
  },
  viewMessage: function (req, res) {

    var messageId = req.body.msg_id ? req.body.msg_id : false;
    var st_token = req.body.st_token ? req.body.st_token : false;

    Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
      if (err) {
        res.send(200, JSON.stringify({msg: "Something wrong"}));
      }
      if (msg) {
        var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
        var count = 0;
        if (uid) {

          var query = 'select distinct ' +
            'm.id as messageId, ' +
            'm.subject as subject, ' +
            'm.content as mContent, ' +
            'm.date_time as mDateTime, ' +
            'sum(ma.id) as attaId, ' +
            'u.email as email ' +
            'from message as m ' +
            'left join users as u on m.user_id = u.id ' +
            'left join message_attachment as ma on m.id = ma.message_id ' +
            'where m.user_id=' + uid + ' and m.id=' + messageId +
            ' group by m.id';

          console.log(query);

          Message.query(query, function (err, data) {
            if (err) {
              console.log(err);
              res.send(401, JSON.stringify({msg: "Something wrong"}));
              // return res.view('404');
            }
            if (data) {
              // console.log(data);

              var array = [];
              array.push(data);
              // console.log(array);

              var query2 = 'select distinct ' +
                'r.id as replyId, ' +
                'r.content as mContent, ' +
                'r.rating as rating, ' +
                'r.date_time as mDateTime, ' +
                'u.email as email, ' +
                'sum(ma.id) as attaId ' +
                'from reply as r ' +
                'left join message_attachment as ma on r.id = ma.message_id ' +
                'left join users as u on r.user_id = u.id ' +
                'where r.message_id=' + messageId +
                ' group by r.id';

              console.log(query2);

              Message.query(query2, function (err, data2) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data2) {
                  // console.log(data2);
                  array.push(data2);
                  // console.log(array);
                  res.send(200, {data: data, data2: data2});
                }
              });
            }

          });
        }
        if (!uid) {
          res.send(200, "Invalid User");
        }
      }
    });
  },
  viewTutorMessage: function (req, res) {

    var messageId = req.body.msg_id ? req.body.msg_id : false;
    var st_token = req.body.st_token ? req.body.st_token : false;

    Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
      if (err) {
        res.send(200, JSON.stringify({msg: "Something wrong"}));
      }
      if (msg) {
        var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
        var count = 0;
        if (uid) {

          var query = 'select distinct ' +
            'm.id as messageId, ' +
            'm.title as subject, ' +
            'm.content as mContent, ' +
            'm.date_time as mDateTime, ' +
            'sum(ma.id) as attaId, ' +
            'u.email as email ' +
            'from tutor_help_message as m ' +
            'left join users as u on m.sender_id = u.id ' +
            'left join tutor_help_message_attchment as ma on m.id = ma.message_id ' +
            'where m.sender_id=' + uid + ' and m.id=' + messageId +
            ' group by m.id';

          console.log(query);

          Message.query(query, function (err, data) {
            if (err) {
              console.log(err);
              res.send(401, JSON.stringify({msg: "Something wrong"}));
              // return res.view('404');
            }
            if (data) {
              // console.log(data);

              var array = [];
              array.push(data);
              // console.log(array);

              var query2 = 'select distinct ' +
                'r.id as replyId, ' +
                'r.content as mContent, ' +
                'r.rating as rating, ' +
                'r.date_time as mDateTime, ' +
                'u.email as email, ' +
                'sum(ma.id) as attaId ' +
                'from tutor_help_reply as r ' +
                'left join tutor_help_reply_attchment as ma on r.id = ma.reply_id ' +
                'left join users as u on r.replier_id = u.id ' +
                'where r.message_id=' + messageId +
                ' group by r.id';

              console.log(query2);

              Message.query(query2, function (err, data2) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data2) {
                  // console.log(data2);
                  array.push(data2);
                  // console.log(array);
                  res.send(200, {data: data, data2: data2});
                }
              });
            }

          });
        }
        if (!uid) {
          res.send(200, "Invalid User");
        }
      }
    });
  },
  tutorinboxLoad: function (req, res) {
    var st_token = req.body.st_token ? req.body.st_token : false;
    var pageID = req.body.pageID ? req.body.pageID : false;
    var pageLimit = 10;
    var stlimit = 0;
    if (!pageID) {
      stlimit = 0;
    } else {
      stlimit = (pageID - 1) * pageLimit;

    }
    if (st_token) {
      console.log("tutor inbox load");
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          // console.log(msg);
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            // console.log(uid);
            var query = 'select distinct ' +
              'm.id, m.title, m.content, ' +
              'm.date_time, ' +
              'GROUP_CONCAT(r.status SEPARATOR ",") as status, ' +
              'GROUP_CONCAT(ma.message_id SEPARATOR ",") as att ' +
              // ' * '+
              'from tutor_help_message as m ' +
              'left join tutor_help_reply as r on m.id =  r.message_id ' +
              'left join tutor_help_message_attchment as ma on m.id = ma.message_id ' +
              'where m.sender_id=' + uid + ' and ' +
              'r.id is not NULL and ' +
              'r.replier_id != ' + uid + ' and ' +
              'm.delete_msg = 0 ' +
              'group by m.id order by r.id limit ' + stlimit + ',' + pageLimit;
            console.log(query);

            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
//                  console.log(data);
                  res.send(200, data);
                }

              });

            }

          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }

      });

    }
  },
  tutorInboxReply: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var content = req.body.content ? req.body.content : false;
    var messageId = req.body.messageId ? req.body.messageId : false;

//        console.log("---------------------------"+messageId);

    function mysql_real_escape_string(str) {
      return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
          case "\0":
            return "\\0";
          case "\x08":
            return "\\b";
          case "\x09":
            return "\\t";
          case "\x1a":
            return "\\z";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
            return "\\" + char; // prepends a backslash to backslash, percent,
          // and double/single quotes
        }
      });
    }
    ;

    Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
      if (err) {
        res.send(200, JSON.stringify({msg: "Something wrong"}));
      }
      if (msg) {
        var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
        var count = 0;
        if (uid) {
          // console.log(uid);
          // console.log(uid+content+messageId);
          var query = 'insert into tutor_help_reply (replier_id,message_id,date_time,content) values ( "' + uid + '","' + mysql_real_escape_string(messageId) + '",now(),"' + mysql_real_escape_string(content) + '" )';
          console.log(query);
          Message.query(query, function (err, data) {
            if (err) {
              // console.log(err);
              res.send(401, JSON.stringify({msg: "Something wrong"}));
              // return res.view('404');
            }
            if (data) {
              // console.log(data);
              res.send(200, data);
            }

          });
        }
        if (!uid) {
          res.send(200, "Invalid User");
        }
      }
    });

  },
  messageNotification: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    var pageID = req.body.pageID ? req.body.pageID : false;
    var pageLimit = 10;
    var stlimit = 0;
    if (!pageID) {
      stlimit = 0;
    } else {
      stlimit = (pageID - 1) * pageLimit;

    }
    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          // console.log(msg);
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            console.log(uid);
            var query = 'select distinct ' +
              'm.id, ' +
              'h.name, ' +
              'h.color, ' +
//                                'm.subject, m.content, ' +
//                                'm.date_time, ' +
              'GROUP_CONCAT(r.status SEPARATOR ",") as status ' +
//                                'GROUP_CONCAT(ma.message_id SEPARATOR ",") as att ' +
              // ' * '+
              'from message as m ' +
              'left join reply as r on m.id =  r.message_id ' +
//                                'left join message_attachment as ma on m.id = ma.message_id ' +
              'left join helpers as h on h.id = m.helper_id ' +
              'where m.user_id=' + uid + ' and ' +
              'r.id is not NULL and ' +
              'r.user_id != ' + uid + ' and ' +
              'm.msg_delete = 0 ' +
              'group by m.id order by r.id limit ' + stlimit + ',' + pageLimit;
            console.log("-0-0-" + query);

            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
                  // console.log(data);
                  res.send(200, data);
                }

              });

            }

          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }

      });

    }
  },
  paginateInbox: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;

    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          // console.log(msg);
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            // console.log(uid);
            var query = 'select count(distinct m.id) as inboxtotal ' +
              'from message as m ' +
              'left join reply as r on m.id =  r.message_id ' +
              'left join message_attachment as ma on m.id = ma.message_id ' +
              'where m.user_id=259 and r.id is not NULL and r.user_id != 259 and m.msg_delete = 0 order by r.id';
            console.log(query);

            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
//                  console.log(data);
                  res.send(200, data);
                }

              });

            }

          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }

      });

    }
  },
  paginateSent: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;
    ;

    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          // console.log(msg);
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            // console.log(uid);
            var query = 'SELECT ' +
              'count(distinct m.id) as sendTotal ' +
//                                'ma.id as atmt, ' +
//                                'sum(r.id) as rid ' +
              'FROM message as m ' +
              'left join message_attachment ma on m.id = ma.message_id ' +
              'left join reply r on m.id = r.message_id ' +
              'where m.msg_delete = 0 and m.user_id =' + uid + ' ' +
//                                'group by m.id '+
              'order by m.id desc ';
            console.log("paginate ---------------" + query);
            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
                  // console.log(data);
                  res.send(200, data);
                }

              });

            }

          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }

      });

    }

  },
  paginateTrash: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;

    if (st_token) {
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
//                    console.log("----000----"+uid);
          if (uid) {
            var query = 'SELECT ' +
              'count(distinct m.id) as trashTotal ' +
//                                'm.subject, m.content, m.date_time, ' +
//                                'ma.id as atmt, ' +
//                                'sum(r.id) as rid ' +
              'FROM message as m ' +
              'left join message_attachment ma on m.id = ma.message_id ' +
              'left join reply r on m.id = r.message_id ' +
              'where m.msg_delete = 1 and m.user_id =' + uid + ' ';
//                                'group by m.id ';
            console.log("--------------------------------------");
            console.log(query);
            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  // console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
                  //console.log(data);
                  res.send(200, data);
                }
              });
            }
          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }
      });
    }

  },
  paginateTutorHelp: function (req, res) {

    var st_token = req.body.st_token ? req.body.st_token : false;

    if (st_token) {
      console.log("tutor inbox load");
      Message.query('SET @p0="' + st_token + '"; CALL `spGetStudentFromToken`(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p1 AS `userID`, @p2 AS `stdID`, @p3 AS `packID`, @p4 AS `countryID`, @p5 AS `gradeID`, @p6 AS `role`;', function (err, msg) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }
        if (msg) {
          // console.log(msg);
          var uid = msg[2][0]['userID'] ? msg[2][0]['userID'] : false;
          if (uid) {
            // console.log(uid);
            var query = 'select count(distinct m.id) as tutorHelpTotal ' +
//                                'm.id, m.title, m.content, ' +
//                                'm.date_time, ' +
//                                'GROUP_CONCAT(r.status SEPARATOR ",") as status, ' +
//                                'GROUP_CONCAT(ma.message_id SEPARATOR ",") as att ' +
              // ' * '+
              'from tutor_help_message as m ' +
              'left join tutor_help_reply as r on m.id =  r.message_id ' +
              'left join tutor_help_message_attchment as ma on m.id = ma.message_id ' +
              'where m.sender_id=' + uid + ' and ' +
              'r.id is not NULL and ' +
              'r.replier_id != ' + uid + ' and ' +
              'm.delete_msg = 0 ' +
//                                'group by m.id '+
              'order by r.id ';

            console.log(query);

            if (st_token) {
              Message.query(query, function (err, data) {
                if (err) {
                  console.log(err);
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                  // return res.view('404');
                }
                if (data) {
//                  console.log(data);
                  res.send(200, data);
                }

              });

            }

          }
          if (!uid) {
            res.send(200, "Invalid User");
          }
        }

      });

    }

  },
  viewAdminInboxMessage: function (req, res) {

    var msg_id = req.body.msg_id;
    Message.query('SET @p0=' + msg_id + '; CALL `spGetMessage`(@p0);', function (err, msg) {

      if (err) {

        //console.log(err);
        res.send(401, JSON.stringify({msg: "Something wrong"}));
        // return res.view('404');
      }

      if (msg) {

        var array = [];
        array = msg;
        array.splice(0, 1);
        array.splice((array.length - 1), 1);

        Message.query('SET @p0=' + msg_id + '; CALL `spGetMessageAttachment`(@p0);', function (err, msgAtt) {

          if (err) {

            //console.log(err);
            res.send(401, JSON.stringify({msg: "Something wrong"}));
            // return res.view('404');
          }

          if (msgAtt) {
            var att_array = [];
            att_array = msgAtt;
            att_array.splice(0, 1);
            att_array.splice((att_array.length - 1), 1);
            res.send(200, {data: array, attachmentData: att_array});
          }


        });


        //console.log(array);


      }


    });

  },

};


