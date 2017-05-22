/**
 * AssessmentzoneController
 *
 * @description :: Server-side logic for managing Assessmentzones
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");
var server_ip = "http://192.168.1.20:1337";
var cross_path = require('path');


module.exports = {

  loadQuizMeta: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {

        Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
          if (err) {

            return res.view('404');
          }
          if (module) {

            Module.query(' SELECT `name` FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
              if (err) {

                return res.view('404');
              }
              if (module) {

                var module_array = [];
                module_array = module;
                module_array.splice(0, 1);
                module_array.splice((module_array.length - 1), 1);

                if (module_array[0].length > 0) {

                  return res.view('assessment/add_basic', {
                    role: role0,
                    name: name0,
                    auth: key,
                    module: module_array[0],
                  });
                }


              }
            });


          }
        });


      }

    } else {
      return res.redirect("/login");
    }

  },
  loadiinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {
        Module.query('SELECT q.`id`,g.grade,c.name AS curriculum,u.name AS unit,s.name AS subject,m.name AS module, qt.`description` as style ' +
          'FROM `question` AS q ' +
          'JOIN `question_type` AS qt ON qt.id=q.question_type_id ' +
          'JOIN `grade` AS g ON g.id=q.grade_id ' +
          'JOIN `curriculum` AS c ON c.id=q.curriculum_id ' +
          'JOIN `unit` u ON u.id=q.unit_id ' +
          'JOIN `subject` s ON s.id=q.subject_id ' +
          'JOIN `module` m ON m.id=q.module_id ' +
          'WHERE q.status="NEW" AND q.`id` IN(SELECT DISTINCT(main_quest_id) FROM ques_section_mapping)' +
          'ORDER BY id ASC',
          function (err, new_question) {
            if (err) {
              // console.log(err);
              return res.view('404');
            } else {

              Module.query('SELECT id,name FROM selection_list', function (err, selection) {
                if (err) {
                  return res.view('404');
                } else {

                  if (new_question.length != 0) {
                    return res.view('assessment/config_summary', {
                      role: role0,
                      name: name0,
                      auth: key,
                      section: selection,
                      question: new_question
                    });
                  } else {
                    return res.view('assessment/config_summary', {
                      role: role0,
                      name: name0,
                      auth: key,
                      section: selection,
                      question: false
                    });

                  }

                }
              });

            }
          });


      }

    } else {

      return res.redirect("/login");
    }
  },
  loadcinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {

        Module.query('SELECT id,name FROM selection_list', function (err, selection) {
          if (err) {
            return res.view('404');
          } else {
            return res.view('assessment/create', {
              role: role0,
              name: name0,
              auth: key,
              selection: selection
            });
          }
        });

      }

    } else {

      return res.redirect("/login");
    }
  },
  loadPackageSubjects: function (req, res) {
    var grade = req.body.g_id;
    var curriculum = req.body.c_id;

    Module.query(' SET @p0=' + grade + '; SET @p1=' + curriculum + '; CALL `spGetSubjectFromCurriGrade`(@p0, @p1);', function (err, psubject) {
      if (err) {
        // res.send(err);
        res.send(401, JSON.stringify({msg: "Something wrong"}));
        //return res.view('404');
      }
      if (psubject) {
        var array = [];
        array = psubject;
        array.splice(0, 1);
        array.splice(0, 1);
        array.splice((array.length - 1), 1);
        res.send(200, psubject['0']);
      }
    });


  },
  loadPackageSubjectsModule: function (req, res) {

    var grade = req.body.g_id;
    var curriculum = req.body.c_id;
    var subject = req.body.s_id;
    //console.log(subject);

    Module.query('SET @p0=' + grade + '; SET @p1=' + curriculum + '; SET @p2=' + subject + '; CALL `spGetModuleFromSubGrdCurri`(@p0, @p1, @p2);', function (err, psubject) {
      if (err) {
        // console.log(err)
        //  res.send(err);
        //  res.send(401,JSON.stringify({msg:"Something wrong"}));
        return res.view('404');
      }
      if (psubject) {
        //console.log(psubject);
        var array = [];
        array = psubject;
        array.splice(0, 1);
        array.splice(0, 1);
        array.splice(0, 1);
        array.splice((array.length - 1), 1);
        res.send(200, psubject['0']);
      }
    });


  },
  validateConfigData: function (req) {

    var errmsg = new Object();
    if (req.body.sec_id == undefined || req.body.sec_id == false)
      errmsg.section_id = "Section can not be empty";
    if (req.body.s_id == undefined || req.body.s_id == false)
      errmsg.subject_id = "Subject can not be empty";
    if (req.body.qiz_type == undefined || req.body.qiz_type == false)
      errmsg.quiz_type = "Test Type can not be empty";
    if (req.body.q_amount == undefined || isNaN(req.body.q_amount) || req.body.q_amount == false)
      errmsg.no_of_q = "Number Of Question must be integer";
    /* if ((req.body.g_id != undefined || req.body.g_id != false ) && ( req.body.c_id != undefined || req.body.c_id != false )
     && ( req.body.s_id != undefined || req.body.s_id != false ) && ( req.body.qiz_type != undefined || req.body.qiz_type != false )) {
     grade_id = req.body.g_id;
     curriculum_id = req.body.c_id;
     subject_id = req.body.s_id;
     quiz_type = req.body.qiz_type;

     if (quiz_type == 'SUBJECT_TEST') {
     var result = Assessmentzone.query('SELECT id FROM quiz_config WHERE curriculum_id = "' + curriculum_id + '" AND grade_id="' + grade_id +
     '" AND subject_id="' + subject_id + '" AND test_type = "' + quiz_type + '";', function (err, msg) {
     if (err)
     console.log(err);
     if (msg) {
     if (msg.length > 0) {
     conflict = "Configuration exist";
     callback_result(conflict);
     }
     }
     });
     }
     else if (quiz_type == 'MODULE_TEST') {
     if (req.body.m_type == undefined || req.body.m_type == "")
     errmsg["module_id"] = "Module can not be empty";
     module_id = req.body.m_type;
     var result = Assessmentzone.query('SELECT id FROM quiz_config WHERE curriculum_id = "' + curriculum_id + '" AND grade_id="' + grade_id +
     '" AND module_id = "' + module_id + '" AND subject_id="' + subject_id + '" AND test_type = "' + quiz_type + '";', function (err, msg) {
     if (err)
     console.log(err);
     if (msg) {
     if (msg.length > 0) {
     conflict = "Configuration exist";
     callback_result(conflict);
     }
     }
     });
     }
     }
     var callback_result = function (rlt) {
     errmsg.config_exist = rlt;
     };*/
    return errmsg;


  },
  configQuizData: function (req, res) {
    var err_data = this.validateConfigData(req);

    Object.size = function (obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };
    var size = Object.size(err_data);

    if (size > 0) {
      var err_str = JSON.stringify(err_data);
      res.send(200, err_str);
    } else {
      var section = req.body.sec_id;
      var subject = req.body.s_id;
      var qiz_type = req.body.qiz_type;
      var qcount = req.body.q_amount;
      var stime = req.body.s_time;
      var time_bonus = req.body.t_bonus;
      var module = req.body.m_type ? req.body.m_type : 0;
      var id = req.body.id ? req.body.id : false;
      var d = new Date();
      var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      if (qiz_type == "SUBJECT_TEST") {

        Module.query("SET @p0 =" + section + "; CALL `spGetSelectionListFromID` (@p0);", function (err, section_data) {
          if (err) {

            res.send(401, JSON.stringify({msg: "Something wrong"}));
          }
          if (section_data) {
            var sec_array = [];
            sec_array = section_data;
            sec_array.splice(0, 1);
            sec_array.splice((sec_array.length - 1), 1);
            var data_array = sec_array[0];
            var completed_requests = 0;

            var check = function (data, callback) {

              Assessmentzone.query('SELECT id FROM quiz_config WHERE curriculum_id = "' + data_array[i]['curriculum_id'] + '" AND grade_id="' + data_array[i]['grade_id'] +
                '" AND subject_id="' + subject + '" AND test_type = "' + qiz_type + '";',
                function (err, msg) {
                  if (err) {
                    // console.log(err);

                  } else {
                    if (msg.length > 0) {
                      callback("error");
                    } else {
                      callback(undefined, data);


                    }

                  }

                });


            };
            for (var i = 0; i < data_array.length; i++) {

              check(data_array[i], function (err, data) {

                if (err) {
                  console.log(err);
                } else {
                  Assessmentzone.query('INSERT INTO quiz_config(curriculum_id, grade_id, subject_id, module_id,' +
                    ' test_type, num_of_ques, schedule_time, time_bonus, created_by, created_date)' +
                    ' VALUES (' + data['curriculum_id'] + ',' + data['grade_id'] + ',' + subject + ',' + module + ',"' + qiz_type + '",' + qcount + ',"' + stime + '","' + time_bonus + '",' + id + ',"' + date + '");',
                    function (err, smsg) {
                      if (err) {
                        // console.log(err);
                      }
                      if (smsg) {

                        completed_requests++;
                        if (completed_requests == (data_array.length)) {

                          // console.log("done")
                          res.send(200, {msg: "ok"});

                        }


                      }
                    });


                }

              })
            }


          }
        });


      }
      if (qiz_type == "MODULE_TEST") {

        Module.query("SET @p0 =" + section + "; CALL `spGetSelectionListFromID` (@p0);", function (err, section_data) {
          if (err) {

            res.send(401, JSON.stringify({msg: "Something wrong"}));
          }
          if (section_data) {
            var sec_array = [];
            sec_array = section_data;
            sec_array.splice(0, 1);
            sec_array.splice((sec_array.length - 1), 1);
            var data_array = sec_array[0];
            var completed_requests = 0;

            var check = function (data, callback) {

              Assessmentzone.query('SELECT id FROM quiz_config WHERE curriculum_id = "' + data['curriculum_id'] + '" AND grade_id="' + data['grade_id'] +
                '" AND subject_id="' + subject + '" AND module_id = "' + module + '" AND test_type = "' + qiz_type + '";',
                function (err, msg) {
                  if (err) {
                    // console.log(err);

                  } else {
                    if (msg.length > 0) {
                      callback("error");
                    } else {
                      callback(undefined, data);


                    }

                  }

                });


            };
            for (var i = 0; i < data_array.length; i++) {

              check(data_array[i], function (err, data) {

                if (err) {
                  //console.log(err);
                } else {
                  Assessmentzone.query('INSERT INTO quiz_config(curriculum_id, grade_id, subject_id, module_id,' +
                    ' test_type, num_of_ques, schedule_time, time_bonus, created_by, created_date)' +
                    ' VALUES (' + data['curriculum_id'] + ',' + data['grade_id'] + ',' + subject + ',' + module + ',"' + qiz_type + '",' + qcount + ',"' + stime + '","' + time_bonus + '",' + id + ',"' + date + '");',
                    function (err, smsg) {
                      if (err) {
                        //console.log(err);
                      }
                      if (smsg) {

                        completed_requests++;
                        if (completed_requests == (data_array.length)) {

                          res.send(200, {msg: "ok"});

                        }


                      }
                    });


                }

              });
            }
            ;


          }
        });


      }

    }


  },
  quizTypeEditData: function (req, res) {
    var key = req.body.token ? req.body.token : false;
    var curriculum_id = req.body.curriculum_id ? req.body.curriculum_id : false;
    var subject_id = req.body.subject_id ? req.body.subject_id : false;
    var module_id = req.body.module_id ? req.body.module_id : false;
    var q_amount = req.body.q_amount ? req.body.q_amount : false;
    var s_time = req.body.s_time ? req.body.s_time : false;
    var t_bonus = req.body.t_bonus ? req.body.t_bonus : false;
    var test_type = req.body.test_type ? req.body.test_type : false;
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var dataSet = JSON.parse(localStorage.getItem(key));
    var completed_requests = 0;

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (auth) {
        if (test_type == "MODULE_TEST") {
          Assessmentzone.query('SELECT id FROM `quiz_config` WHERE `curriculum_id`=' + curriculum_id + ' AND `subject_id`=' + subject_id + ' AND `module_id`=' + module_id + ';', function (err, quizId) {
            if (err) {
              res.send(401, JSON.stringify({msg: "Something wrong"}));

            } else {


              if (quizId.length > 0) {

                for (var i = 0; i < quizId.length; i++) {
                  Assessmentzone.query('UPDATE `quiz_config` SET `num_of_ques`=' + q_amount + ',`schedule_time`="' + s_time + '",`time_bonus`="' + t_bonus + '",`created_by`=' + id + ',`created_date`="' + date + '" WHERE id=' + quizId[i]['id'] + ';', function (err, quizData) {
                    if (err) {
                      //res.send(401, JSON.stringify({msg: "Something wrong"}));
                      console.log(err);

                    } else {
                      completed_requests++;
                      if (completed_requests == (quizId.length)) {

                        res.send(200, JSON.stringify({data: "success"}));

                      }


                    }
                  });

                }
              }

            }
          });
        }
        if (test_type == "SUBJECT_TEST") {
          Assessmentzone.query('SELECT id FROM `quiz_config` WHERE `curriculum_id`=' + curriculum_id + ' AND `subject_id`=' + subject_id + ' AND `module_id`=0;', function (err, quizId) {
            if (err) {
              res.send(401, JSON.stringify({msg: "Something wrong"}));

            } else {


              if (quizId.length > 0) {

                for (var i = 0; i < quizId.length; i++) {
                  Assessmentzone.query('UPDATE `quiz_config` SET `num_of_ques`=' + q_amount + ',`schedule_time`="' + s_time + '",`time_bonus`="' + t_bonus + '",`created_by`=' + id + ',`created_date`="' + date + '" WHERE id=' + quizId[i]['id'] + ';', function (err, quizData) {
                    if (err) {
                      //res.send(401, JSON.stringify({msg: "Something wrong"}));
                      console.log(err);

                    } else {

                      completed_requests++;
                      if (completed_requests == (quizId.length)) {

                        res.send(200, JSON.stringify({data: "success"}));

                      }


                    }
                  });

                }

              }

            }
          });
        }
      }

    } else {

      return res.redirect("/login");
    }


  },
  qconfig_summary: function (req, res) {
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;

      if (auth) {
        Assessmentzone.query('SELECT * FROM curriculum', function (err, curriculum) {
          if (err) {
            //res.send(err);
            return res.view('404');
          } else {

            Assessmentzone.query('SELECT * FROM grade', function (err, grades) {
              if (err) {
                //res.send(err);
                return res.view('404');
              } else {
                return res.view('assessment/config_summary', {
                  curriculums: curriculum,
                  grades: grades,
                  role: role0,
                  name: name0,
                  auth: key,
                });
              }
            });
          }
        });
      }

    } else {

      return res.redirect("/login");
    }
  },
  deleteQuizType: function (req, res) {
    var key = req.body.token ? req.body.token : false;
    var curriculum_id = req.body.curriculum_id ? req.body.curriculum_id : false;
    var subject_id = req.body.subject_id ? req.body.subject_id : false;
    var module_id = req.body.module_id ? req.body.module_id : false;
    var test_type = req.body.test_type ? req.body.test_type : false;
    var dataSet = JSON.parse(localStorage.getItem(key));


    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      if (auth) {
        if (test_type == "MODULE_TEST") {
          Assessmentzone.query('SELECT id FROM `quiz_config` WHERE `curriculum_id`=' + curriculum_id + ' AND `subject_id`=' + subject_id + ' AND `module_id`=' + module_id + ';', function (err, quizId) {
            if (err) {
              res.send(401, JSON.stringify({msg: "Something wrong"}));

            } else {


              if (quizId.length > 0) {

                for (var i = 0; i < quizId.length; i++) {
                  Assessmentzone.query('DELETE FROM quiz_config WHERE id=' + quizId[i]['id'] + ';', function (err, quizData) {
                    if (err) {
                      res.send(401, JSON.stringify({msg: "Something wrong"}));

                    } else {


                    }
                  });

                }
                res.send(200, JSON.stringify({data: "success"}));
              }

            }
          });
        }
        if (test_type == "SUBJECT_TEST") {
          Assessmentzone.query('SELECT id FROM `quiz_config` WHERE `curriculum_id`=' + curriculum_id + ' AND `subject_id`=' + subject_id + ' AND `module_id`=0;', function (err, quizId) {
            if (err) {
              res.send(401, JSON.stringify({msg: "Something wrong"}));

            } else {


              if (quizId.length > 0) {

                for (var i = 0; i < quizId.length; i++) {
                  Assessmentzone.query('DELETE FROM quiz_config WHERE id=' + quizId[i]['id'] + ';', function (err, quizData) {
                    if (err) {
                      res.send(401, JSON.stringify({msg: "Something wrong"}));

                    } else {


                    }
                  });

                }
                res.send(200, JSON.stringify({data: "success"}));
              }

            }
          });
        }

      }

    } else {

      return res.redirect("/login");
    }


  },
  filter_qConfig: function (req, res) {
    var section = req.body.sec_type ? req.body.sec_type : false;

    if (section) {
      Module.query("SELECT DISTINCT(P.`curriculum_id`), PS.`subject_id` , PS.selection_list_id " +
        "FROM `package_subject` PS, package P, selection_list SL " +
        "WHERE PS.`selection_list_id` IS NOT NULL " +
        "AND PS.`package_id` = P.id " +
        "AND SL.id = PS.selection_list_id and PS.selection_list_id =" + section + ";",
        function (err, section_data) {
          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));
          }
          if (section_data && section_data.length > 0) {
            var curriculum_id = section_data[0]['curriculum_id'];
            var subject_id = section_data[0]['subject_id'];


            Assessmentzone.query('SELECT DISTINCT(q.`curriculum_id`), q.`subject_id`,q.`module_id`,q.`test_type`,q.`num_of_ques`,q.`schedule_time`,q.`time_bonus`,q.`created_by`,q.`created_date`,t.name AS creator ' +
              'FROM `quiz_config` q, admin t WHERE t.user_id = q.created_by AND ' +
              ' q.curriculum_id=' + curriculum_id + ' AND q.subject_id=' + subject_id +
              ' ORDER BY q.test_type DESC',
              function (err, qconf_data) {
                if (err) {
                  res.send(200, JSON.stringify({msg: "Something wrong"}));
                }
                if (qconf_data) {

                  Assessmentzone.query('SELECT * FROM  subject', function (err, subjArr) {
                    if (err) {

                      res.send(200, JSON.stringify({msg: "Something wrong"}));

                    }
                    if (subjArr) {


                      Assessmentzone.query('SELECT id, name FROM module', function (err, module_arr) {


                        formattedSubj = Array();
                        for (i = 0; i < subjArr.length; i++) {
                          formattedSubj[subjArr[i]['id']] = subjArr[i]['name'];
                        }
                        formattedModule = Array();
                        for (i = 0; i < module_arr.length; i++) {
                          formattedModule[module_arr[i]['id']] = module_arr[i]['name'];
                        }
                        var final_data = new Object();
                        for (i = 0; i < qconf_data.length; i++) {
                          var formated_data = new Object();
                          if (qconf_data[i]['test_type'] == "SUBJECT_TEST") {
                            str_test_type = "Subject Test";
                          } else if (qconf_data[i]['test_type'] == "MODULE_TEST") {
                            str_test_type = "Module Test";
                          } else {
                            str_test_type = "";
                          }

                          if (formattedModule[qconf_data[i]['module_id']] == undefined) {
                            module_name = "";
                          } else {
                            module_name = formattedModule[qconf_data[i]['module_id']];
                          }

                          var format_date = function (dt) {
                            d = new Date(dt);
                            newdate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                            return newdate;
                          };
                          var fd = format_date(qconf_data[i]['created_date']);

                          formated_data.test_type = str_test_type;
                          formated_data.quiz_type = qconf_data[i]['test_type'];
                          formated_data.curriculum_id = qconf_data[i]['curriculum_id'];
                          formated_data.subject_id = qconf_data[i]['subject_id'];
                          formated_data.module_id = qconf_data[i]['module_id'];
                          formated_data.time_bonus = qconf_data[i]['time_bonus'];
                          formated_data.num_of_ques = qconf_data[i]['num_of_ques'];
                          formated_data.schedule_time = qconf_data[i]['schedule_time'];
                          formated_data.created_date = fd;
                          formated_data.created_by = qconf_data[i]['creator'];
                          formated_data.module_name = module_name;
                          formated_data.subject = formattedSubj[qconf_data[i]['subject_id']];
                          //final_data[qconf_data[i]['id']] = formated_data;
                          final_data[i] = formated_data;


                        }


                        res.send(200, {data: final_data});


                      });


                    }
                  });
                }


              });


          } else {

            res.send(200, JSON.stringify({msg: "Data is empty"}));


          }


        });

    }
  },
  addQuestion: function (req, res) {

    var m_type = req.body.m_type ? req.body.m_type : false;
    var mu_type = req.body.mu_type ? req.body.mu_type : false;
    var key = req.body.token;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {


        // console.log(req.body)
        res.send(200, req.body);


      }

    } else {

      return res.redirect("/login");
    }


  },
  addQuestionInit: function (req, res) {

    var m_type = req.query.m ? req.query.m : false;
    var mu_type = req.query.u ? req.query.u : false;

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {

        Module.query('SELECT `name` AS sec FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
          if (err) {

            return res.view('404');
          }
          if (section) {
            res.view('assessment/add_question', {
              role: role0,
              name: name0,
              auth: key,
              m_type: m_type,
              mu_type: mu_type,
              sec_type: section[0].sec

            });


          }


        });

      }

    } else {

      return res.redirect("/login");
    }


  },
  initMultipleSelectQuiz: function (req, res) {

    var m_type = req.query.m ? req.query.m : false;
    var mu_type = req.query.u ? req.query.u : false;
    var que_st = req.query.qs ? req.query.qs : false;

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {


        Module.query('SELECT `name` AS sec FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
          if (err) {

            return res.view('404');
          }
          if (section) {


            res.view('assessment/multiple_choice', {
              role: role0,
              name: name0,
              auth: key,
              sec_type: section[0].sec,
              m_type: m_type,
              mu_type: mu_type,
              que_st: que_st,
            });

          }

        });


      }

    } else {

      return res.redirect("/login");
    }

  },
  addQuestionData: function (req, res) {


    var m_id = req.body.m_id ? req.body.m_id : false;
    var u_id = req.body.u_id ? req.body.u_id : false;
    var qs_id = req.body.qs_id ? req.body.qs_id : false;
    var question_des = req.body.questiondes ? req.body.questiondes : "";
    var question = req.body.question ? req.body.question : "";
    var choice = req.body.choice ? req.body.choice : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var key = req.body.token;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var id = dataSet.id ? dataSet.id : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;

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
      };

      Module.query("SELECT auto_increment from information_schema.TABLES where TABLE_NAME ='question' and TABLE_SCHEMA='tutorwizard';", function (err, a_id) {
        if (err) {

          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (a_id) {

          Module.query("SET @p0 =" + sec_type + "; CALL `spGetSelectionListFromID` (@p0);", function (err, section_data) {
            if (err) {

              res.send(401, JSON.stringify({msg: "Something wrong"}));
            }
            if (section_data) {
              var main_qid = a_id[0]['auto_increment'];
              var sec_array = [];
              sec_array = section_data;
              sec_array.splice(0, 1);
              sec_array.splice((sec_array.length - 1), 1);
              var data_array = sec_array[0];

              for (var i = 0; i < data_array.length; i++) {
                Module.query('SET @p0="' + mysql_real_escape_string(question) + '"; SET @p1="' + mysql_real_escape_string(question_des) + '"; SET @p2=' + data_array[i]['grade_id'] + '; SET @p3=' + data_array[i]['curriculum_id'] + '; SET @p4=' + u_id + '; SET @p5=' + data_array[i]['subject_id'] + '; SET @p6=' + m_id + '; SET @p7="' + date + '"; SET @p8=' + qs_id + '; SET @p9=' + id + '; SELECT `fnInsertQuestion`(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7,@p8,@p9) AS `fnInsertQuestion`;', function (err, msg) {
                  if (err) {
                    res.send(401, JSON.stringify({msg: "Something wrong"}));

                  }
                  if (msg) {

                    var index = msg.length - 1;
                    var q_id = msg[index][0]['fnInsertQuestion'];
                    //console.log(msg[index]);

                    Module.query('INSERT INTO `ques_section_mapping`(`main_quest_id`, `question_id`, `section_id`) VALUES (' + main_qid + ',' + q_id + ',' + sec_type + ')', function (err, s_msg) {
                      if (err) {
                        //console.log(err);
                        res.send(401, JSON.stringify({msg: "Something wrong"}));

                      }
                      if (s_msg) {
                        for (var j = 0; j < choice.length; j++) {
                          Module.query('INSERT INTO `answer`(`answer`, `correct`, `question_id`, `question_type_id`, `created_by`, `created_date`) VALUES ("' + choice[j]['answer'] + '","' + choice[j]['c_answer'] + '",' + q_id + ',' + choice[j]['qsid'] + ',' + choice[j]['uid'] + ',"' + date + '");', function (err, msg) {
                            if (err) {
                              //console.log(err)
                              res.send(401, JSON.stringify({msg: "Something wrong"}));
                              // return res.view('404');
                            }
                            if (msg) {


                            }
                          });
                        }
                        //
                      }
                    });

                  }
                });

              }

              res.send(200, JSON.stringify({msg: "success"}));

            }

          });

        }

      });

    }

  },
  answerSubmit: function (req, res) {

    var data = req.body ? req.body : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    if (data) {
      for (var i = 0; i < data.length; i++) {
        Module.query('INSERT INTO `answer`(`answer`, `correct`, `question_id`, `question_type_id`, `created_by`, `created_date`) VALUES ("' + data[i]['answer'] + '",' + data[i]['c_answer'] + ',' + data[i]['qid'] + ',' + data[i]['qsid'] + ',' + data[i]['uid'] + ',"' + date + '");', function (err, msg) {
          if (err) {
            console.log(err)
            // res.send(401,JSON.stringify({msg:"Something wrong"}));
            //  return res.view('404');
          }
          if (msg) {


          }
        });
      }
      res.send(200, "ok");

    }


  },
  initWrittenSpoken: function (req, res) {


    var m_type = req.query.m ? req.query.m : false;
    var mu_type = req.query.u ? req.query.u : false;
    var que_st = req.query.qs ? req.query.qs : false;

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {


        Module.query('SELECT `name` AS sec FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
          if (err) {

            return res.view('404');
          }
          if (section) {


            res.view('assessment/written_spoken', {
              role: role0,
              name: name0,
              auth: key,
              sec_type: section[0].sec,
              m_type: m_type,
              mu_type: mu_type,
              que_st: que_st,
            });

          }

        });


      }


    } else {

      return res.redirect("/login");
    }
  },
  writtenSpokenSave: function (req, res) {

    var u_id = req.body.u_id ? req.body.u_id : false;
    var m_id = req.body.m_id ? req.body.m_id : false;
    var qs_id = req.body.qs_id ? req.body.qs_id : false;
    var html = req.body.htmlVariable ? req.body.htmlVariable : "";
    var quedes = req.body.questiondes ? req.body.questiondes : "";
    var choice = req.body.choice ? req.body.choice : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var key = req.body.token;
    var dataSet = JSON.parse(localStorage.getItem(key));

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
    };

    if (dataSet != null) {

      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      var id = dataSet.id ? dataSet.id : false;

      if (u_id && qs_id) {

        Module.query("SELECT auto_increment from information_schema.TABLES where TABLE_NAME ='question' and TABLE_SCHEMA='tutorwizard';", function (err, a_id) {
          if (err) {
            res.send(401, JSON.stringify({msg: "Something wrong"}));
          }
          if (a_id) {
            Module.query("SET @p0 =" + sec_type + "; CALL `spGetSelectionListFromID` (@p0);", function (err, section_data) {
              if (err) {
                res.send(401, JSON.stringify({msg: "Something wrong"}));
              }
              if (section_data) {
                var main_qid = a_id[0]['auto_increment'];
                var sec_array = [];
                sec_array = section_data;
                sec_array.splice(0, 1);
                sec_array.splice((sec_array.length - 1), 1);
                var data_array = sec_array[0];


                for (var i = 0; i < data_array.length; i++) {
                  Module.query('SET @p0="' + mysql_real_escape_string(html) + '"; SET @p1="' + mysql_real_escape_string(quedes) + '"; SET @p2=' + data_array[i]['grade_id'] + '; SET @p3=' + data_array[i]['curriculum_id'] + '; SET @p4=' + u_id + '; SET @p5=' + data_array[i]['subject_id'] + '; SET @p6=' + m_id + '; SET @p7="' + date + '"; SET @p8=' + qs_id + '; SET @p9=' + id + '; SELECT `fnInsertQuestion`(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7,@p8,@p9) AS `fnInsertQuestion`;', function (err, msg) {
                    if (err) {
                      res.send(401, JSON.stringify({msg: "Something wrong"}));
                      //console.log("1"+err);

                    }
                    if (msg) {

                      var index = msg.length - 1;
                      var q_id = msg[index][0]['fnInsertQuestion'];
                      Module.query('INSERT INTO `ques_section_mapping`(`main_quest_id`, `question_id`, `section_id`) VALUES (' + main_qid + ',' + q_id + ',' + sec_type + ')', function (err, s_msg) {
                        if (err) {
                          //console.log(err);
                          res.send(401, JSON.stringify({msg: "Something wrong"}));

                        }
                        if (s_msg) {
                          for (var j = 0; j < choice.length; j++) {
                            Module.query('INSERT INTO `answer`(`answer`, `correct`, `question_id`, `question_type_id`, `created_by`, `created_date`) VALUES ("' + choice[j]['answer'] + '","' + choice[j]['c_answer'] + '",' + q_id + ',' + choice[j]['qsid'] + ',' + choice[j]['uid'] + ',"' + date + '");', function (err, msg) {
                              if (err) {
                                //console.log(err)
                                res.send(401, JSON.stringify({msg: "Something wrong"}));
                                // console.log("2"+err);
                                // return res.view('404');
                              }
                              if (msg) {


                              }
                            });
                          }
                          //
                        }
                      });

                    }
                  });

                }

                res.send(200, JSON.stringify({msg: "success"}));

              }

            });

          }

        });


      }

    }

  },
  initTrueFalse: function (req, res) {

    var m_type = req.query.m ? req.query.m : false;
    var mu_type = req.query.u ? req.query.u : false;
    var que_st = req.query.qs ? req.query.qs : false;

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (auth && auth1) {

        Module.query('SELECT `name` AS sec FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
          if (err) {

            return res.view('404');
          }
          if (section) {


            res.view('assessment/true_false', {
              role: role0,
              name: name0,
              auth: key,
              sec_type: section[0].sec,
              m_type: m_type,
              mu_type: mu_type,
              que_st: que_st,
            });

          }

        });


      }

    } else {

      return res.redirect("/login");
    }


  },
  answerTruFalseSubmit: function (req, res) {

    var data = req.body ? req.body : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    if (data) {
      for (var i = 0; i < data.length; i++) {
        Module.query('INSERT INTO `answer`(`answer`, `correct`, `question_id`, `question_type_id`, `created_by`, `created_date`) VALUES ("' + data[i]['answer'] + '","' + data[i]['c_answer'] + '",' + data[i]['qid'] + ',' + data[i]['qsid'] + ',' + data[i]['uid'] + ',"' + date + '");', function (err, msg) {
          if (err) {
            // console.log(err)
            // res.send(401,JSON.stringify({msg:"Something wrong"}));
            return res.view('404');
          }
          if (msg) {


          }
        });
      }
      res.send(200, "ok");

    }


  },
  initYesNo: function (req, res) {


    var m_type = req.query.m ? req.query.m : false;
    var mu_type = req.query.u ? req.query.u : false;
    var que_st = req.query.qs ? req.query.qs : false;
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (auth && auth1) {

        Module.query('SELECT `name` AS sec FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
          if (err) {

            return res.view('404');
          }
          if (section) {


            res.view('assessment/yes_no', {
              role: role0,
              name: name0,
              auth: key,
              sec_type: section[0].sec,
              m_type: m_type,
              mu_type: mu_type,
              que_st: que_st,
            });

          }

        });


      }
    } else {

      return res.redirect("/login");
    }
  },
  answerYesNoSubmit: function (req, res) {

    var data = req.body ? req.body : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    if (data) {
      for (var i = 0; i < data.length; i++) {
        Module.query('INSERT INTO `answer`(`answer`, `correct`, `question_id`, `question_type_id`, `created_by`, `created_date`) VALUES ("' + data[i]['answer'] + '","' + data[i]['c_answer'] + '",' + data[i]['qid'] + ',' + data[i]['qsid'] + ',' + data[i]['uid'] + ',"' + date + '");', function (err, msg) {
          if (err) {
            // console.log(err)
            //res.send(401,JSON.stringify({msg:"Something wrong"}));
            return res.view('404');
          }
          if (msg) {


          }
        });
      }
      res.send(200, "ok");
    }

  },
  initViewImageAnswer: function (req, res) {

    var m_type = req.query.m ? req.query.m : false;
    var mu_type = req.query.u ? req.query.u : false;
    var que_st = req.query.qs ? req.query.qs : false;

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (auth && auth1) {

        Module.query('SELECT `name` AS sec FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
          if (err) {

            return res.view('404');
          }
          if (section) {


            res.view('assessment/view_image_answer', {
              role: role0,
              name: name0,
              auth: key,
              sec_type: section[0].sec,
              m_type: m_type,
              mu_type: mu_type,
              que_st: que_st,
            });

          }

        });


      }
    } else {

      return res.redirect("/login");
    }
  },
  answerViewImageAnswerSubmit: function (req, res) {

    var data = req.body ? req.body : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      var id = dataSet.id ? dataSet.id : false;

      //  console.log(data);
      if (data && id) {
        for (var i = 0; i < data.length; i++) {
          Module.query('INSERT INTO `answer`(`answer`, `correct`, `question_id`, `created_by`, `created_date`) VALUES ("' + data[i]['answer'] + '","' + data[i]['c_answer'] + '",' + data[i]['qid'] + ',' + id + ',"' + date + '");', function (err, msg) {
            if (err) {
              // console.log(err)
              // res.send(401,JSON.stringify({msg:"Something wrong"}));
              return res.view('404');
            }
            if (msg) {


            }
          });
        }
        res.send(200, "ok");

      }
    }

  },
  confirmTest: function (req, res) {

    var qid = req.body.qid ? req.body.qid : false;
    var key = req.body.token ? req.body.token : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (qid && id) {
        Module.query('SELECT `question_id` FROM `ques_section_mapping` WHERE `main_quest_id`=' + qid + ';', function (err, qids) {
          if (err) {
            res.send(401, JSON.stringify({msg: "Something wrong"}));
          }
          if (qids) {
            for (var i = 0; i < qids.length; i++) {
              Module.query('UPDATE question SET status="APPROVED" WHERE id=' + qids[i]['question_id'] + ';', function (err, qids) {
                if (err) {
                  res.send(401, JSON.stringify({msg: "Something wrong"}));
                }
                if (qids) {


                }


              });

            }
            res.send(200, {msg: "ok"});

          }


        });


      }

    }


  },
  confirmAllQuestion: function (req, res) {


    var key = req.body.token ? req.body.token : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (id) {
        Module.query('UPDATE question SET status="APPROVED" WHERE status="NEW";', function (err, qids) {
          if (err) {
            res.send(200, JSON.stringify({msg: "Something wrong"}));
          }
          if (qids) {
            res.send(200, {msg: "updated"});

          }


        });


      }

    }


  },
  dataFromSection: function (req, res) {

    var sec_type = req.body.sec_type ? req.body.sec_type : false;
    var key = req.body.token ? req.body.token : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      if (auth) {

        Module.query("SET @p0 =" + sec_type + "; CALL `spGetSelectionListFromID` (@p0);", function (err, section_data) {
          if (err) {

            res.send(401, JSON.stringify({msg: "Something wrong"}));
          }
          if (section_data) {


            var sec_array = [];
            sec_array = section_data;
            sec_array.splice(0, 1);
            sec_array.splice((sec_array.length - 1), 1);
            var data_array = sec_array[0];
            var sec_data = sec_array[0];
            var s_id = data_array[0]['subject_id']

            Module.query("SELECT `name` FROM `subject` WHERE `id`=" + s_id + ";", function (err, subject) {
              if (err) {

                res.send(401, JSON.stringify({msg: "Something wrong"}));
              }
              if (subject) {

                Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
                  if (err) {

                    res.send(401, JSON.stringify({msg: "Something wrong"}));
                  }
                  if (module) {

                    var module_array = [];
                    module_array = module;
                    module_array.splice(0, 1);
                    module_array.splice((module_array.length - 1), 1);
                    var data_array = module_array[0];
                    var s_name = subject[0]['name']

                    if (module_array.length != 0) {
                      res.send(200, {s_id: s_id, s_name: s_name, module: data_array, sec_data: sec_data});
                    } else {
                      res.send(200, {subject: subject[0]['name'], module: [], sec_data: sec_data});

                    }


                  }

                });

              }

            });

          }

        });


      }

    }


  },
  getQuizConfirmDataCount: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    if (auth) {
      Module.query('SELECT COUNT(q.`id`) AS data_count ' +
        'FROM `question` AS q ' +
        'JOIN `question_type` AS qt ON qt.id=q.question_type_id ' +
        'JOIN `grade` AS g ON g.id=q.grade_id ' +
        'JOIN `curriculum` AS c ON c.id=q.curriculum_id ' +
        'JOIN `unit` u ON u.id=q.unit_id ' +
        'JOIN `subject` s ON s.id=q.subject_id ' +
        'JOIN `module` m ON m.id=q.module_id ' +
        'WHERE q.status="NEW" AND q.`id` IN(SELECT DISTINCT(main_quest_id) FROM ques_section_mapping)' +
        'ORDER BY q.`id` ASC', function (err, data) {
        if (err) {
          console.log(err);
          res.send(200, JSON.stringify({msg: "Something wrong"}));


        }

        if (data) {

          res.send(200, data);
        }


      });


    }


  },
  getQuizConfirmData: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var page_id = req.body.page_id ? req.body.page_id : false;
    var pageLimit = 5;


    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);

    }

    if (auth && page_id) {

      Package.query('SELECT q.`id`,g.grade,c.name AS curriculum,u.name AS unit,s.name AS subject,m.name AS module, qt.`description` as style ' +
        'FROM `question` AS q ' +
        'JOIN `question_type` AS qt ON qt.id=q.question_type_id ' +
        'JOIN `grade` AS g ON g.id=q.grade_id ' +
        'JOIN `curriculum` AS c ON c.id=q.curriculum_id ' +
        'JOIN `unit` u ON u.id=q.unit_id ' +
        'JOIN `subject` s ON s.id=q.subject_id ' +
        'JOIN `module` m ON m.id=q.module_id ' +
        'WHERE q.status="NEW" AND q.`id` IN(SELECT DISTINCT(main_quest_id) FROM ques_section_mapping)' +
        'ORDER BY q.`id` ASC ' +
        'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, new_question) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (new_question) {

          if (new_question.length > 0) {
            res.send(200, JSON.stringify({question: new_question}));
          } else {
            res.send(200, JSON.stringify({question: []}));
          }
        }
      });


    }


  },
  questionImageUpload: function (req, res) {
    var d = new Date();
    var filename = d.getTime() + ".png"
    req.file('upload').upload({
      maxBytes: 100000000,
      dirname: cross_path.resolve(sails.config.appPath, 'uploads'),
      saveAs: filename,
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err);
      if (uploadedFiles) {
        res.send(200, JSON.stringify({filename: filename}));
      }
    });

  },
  questionImageView: function (req, res) {

    var file = req.param('src');

    var root = cross_path.resolve(sails.config.appPath, 'uploads');
    var path = cross_path.normalize(root + "//" + file);
    fs.exists(path, function (exists) {
      if (exists) {
        try {
          res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename' + file
          });
          return fs.createReadStream(path).pipe(res);
        } catch (err) {
          console.log(err)
        }
      }
      else {

      }
    });

  },
  answerImageUpload: function (req, res) {
    var d = new Date();
    var filename = d.getTime() + ".png"
    req.file('uploadAnswer').upload({
      maxBytes: 100000000,
      dirname: cross_path.resolve(sails.config.appPath, cross_path.normalize('uploads\\answers')),
      saveAs: filename,
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err);
      if (uploadedFiles) {
        res.send(200, JSON.stringify({filename: filename}));
      }
    });

  },
  questionAnswerImageView: function (req, res) {

    var file = req.param('src');
    var root = cross_path.resolve(sails.config.appPath, cross_path.normalize('uploads\\answers'));
    var path = cross_path.normalize(root + "//" + file);
    fs.exists(path, function (exists) {
      if (exists) {
        try {
          res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename' + file
          });
          return fs.createReadStream(path).pipe(res);
        } catch (err) {
          console.log(err)
        }
      }
      else {

      }
    });

  },
  load_summry: function (req, res) {
    /*  var key     = req.param('auth') ? req.param('auth') : false;
     var dataSet = JSON.parse(localStorage.getItem(key));
     if (dataSet != null) {
     var auth  = dataSet.auth0 ? dataSet.auth0 : false;
     var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
     var name0 = dataSet.name0 ? dataSet.name0 : false;
     var role0 = dataSet.role0 ? dataSet.role0 : false;
     var sec_type = dataSet.sec0 ? dataSet.sec0 : false;





     if (auth && auth1) {
     return res.view('assessment/quest_summry', {
     role: role0,
     name: name0,
     auth: key,
     });
     }
     } else {
     return res.redirect("/login");
     }*/
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;

      if (auth && auth1) {

        Module.query('SELECT name FROM `selection_list` WHERE id=' + sec_type + ';', function (err, sec) {
          if (err) {
            return res.view('404');
          }

          else {
            Module.query('SET @p0 =' + sec_type + '; CALL spGetModulesFromSelectionList (@p0);', function (err, md) {
              if (err) {
                return res.view('404');
              }
              if (md) {
                var module_array = [];
                module_array = md;
                module_array.splice(0, 1);
                module_array.splice((module_array.length - 1), 1);

                return res.view('assessment/quest_summry', {
                  role: role0,
                  name: name0,
                  auth: key,
                  section: sec,
                  modl_data: module_array[0],
                });
              }
            });

          }

        });


      }


    } else {
      return res.redirect("/login");
    }
  },
  getQuestCount: function (req, res) {
    var auth = req.body.auth ? req.body.auth : false;
    var sec_id = req.body.sec_id ? req.body.sec_id : false;
    var sel_module_id = req.body.sel_module_id ? req.body.sel_module_id : false;
    var sel_unit_id = req.body.sel_unit_id ? req.body.sel_unit_id : false;

    if (auth) {
      Module.query('SET @p0 =' + sec_id + ';CALL spGetModulesFromSelectionList (@p0);', function (err, md) {
        if (err) {
          return res.view('404');
        } else {
          var mdlid_arr = new Array();
          if (md) {
            var module_array = [];
            module_array = md;
            module_array.splice(0, 1);
            module_array.splice((module_array.length - 1), 1);
            for (i = 0; i <= module_array.length; i++) {
              if (module_array[i] != undefined) {
                for (j = 0; j <= module_array[i].length; j++) {
                  if (module_array[i][j] != undefined) {
                    var mdl = module_array[i][j];
                    mdlid_arr[mdl.module_id] = mdl.module_id;
                  }
                }
              }
            }
          }
          var newArray = new Array();
          for (var i = 0; i < mdlid_arr.length; i++) {
            if (mdlid_arr[i]) {
              newArray.push(mdlid_arr[i]);
            }
          }
          var sqlpart = " WHERE 1=1";
          if (sel_module_id && (sel_module_id != undefined)) {
            sqlpart += ' AND module_id =' + sel_module_id;
          } else if (newArray) {
            sqlpart += ' AND module_id IN ( ' + newArray.join() + ' ) ';
          }

          if (sel_unit_id && (sel_unit_id != undefined)) {
            sqlpart += ' AND unit_id =' + sel_unit_id;
          }
          Module.query('SELECT COUNT(id) AS data_count FROM question ' + sqlpart + ';', function (err, data) {
            if (err) {
              res.send(200, JSON.stringify({msg: "Something wrong"}));
            }
            if (data) {
              res.send(200, data);
            }
          });
        }
      });
    }
  },
  get_quest_smry: function (req, res) {
    var page_id = req.body.page_id ? req.body.page_id : false;
    var sec_id = req.body.sec_id ? req.body.sec_id : false;
    var sel_module_id = req.body.sel_module_id ? req.body.sel_module_id : false;
    var sel_unit_id = req.body.sel_unit_id ? req.body.sel_unit_id : false;

    var pageLimit = 5;
    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);
    }

    Assessmentzone.query('SELECT * FROM curriculum', function (err, curr_data) {
      if (err || curr_data.length == 0) {
        return res.view('404');
      } else {
        var curr_arr = new Array();
        for (var ckey in curr_data) {
          var obj = curr_data[ckey];
          var curr_id = obj.id;
          var curr_name = obj.name;
          curr_arr[curr_id] = curr_name;
        }
        Assessmentzone.query('SELECT * FROM  grade', function (err, grade_data) {
          if (err || grade_data.length == 0) {
            return res.view('404');
          } else {
            var grade_arr = new Array();
            for (var gk in grade_data) {
              var objg = grade_data[gk];
              var g_id = objg.id;
              var g_name = objg.grade;
              grade_arr[g_id] = g_name;
            }
            Assessmentzone.query('SELECT * FROM  subject', function (err, subj_data) {
              if (err || subj_data.length == 0) {
                return res.view('404');
              } else {
                var subj_arr = new Array();
                for (var sky in subj_data) {
                  var objs = subj_data[sky];
                  var s_id = objs.id;
                  var s_name = objs.name;
                  subj_arr[s_id] = s_name;
                }
                Module.query('SET @p0 =' + sec_id + ';CALL spGetModulesFromSelectionList (@p0);', function (err, md) {
                  if (err) {
                    return res.view('404');
                  } else {
                    var mdlid_arr = new Array();
                    if (md) {
                      var module_array = [];
                      module_array = md;
                      module_array.splice(0, 1);
                      module_array.splice((module_array.length - 1), 1);
                      for (i = 0; i <= module_array.length; i++) {
                        if (module_array[i] != undefined) {
                          for (j = 0; j <= module_array[i].length; j++) {
                            if (module_array[i][j] != undefined) {
                              var mdl = module_array[i][j];
                              mdlid_arr[mdl.module_id] = mdl.module_id;
                            }
                          }
                        }
                      }
                    }
                    var newArray = new Array();
                    for (var i = 0; i < mdlid_arr.length; i++) {
                      if (mdlid_arr[i]) {
                        newArray.push(mdlid_arr[i]);
                      }
                    }
                    var sqlpart = " WHERE 1=1";
                    if (sel_module_id && (sel_module_id != undefined)) {
                      sqlpart += ' AND module_id =' + sel_module_id;
                    } else if (newArray) {
                      sqlpart += ' AND module_id IN ( ' + newArray.join() + ' ) ';
                    }

                    if (sel_unit_id && (sel_unit_id != undefined)) {
                      sqlpart += ' AND unit_id =' + sel_unit_id;
                    }

                    Assessmentzone.query('SELECT * FROM  question ' + sqlpart + ' ORDER BY created_date' +
                      ' DESC LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, qest_data) {
                      var formatted_arr = new Array();
                      if (err) {
                        return res.view('404');
                      } else if (qest_data.length == 0) {

                        //console.log(formatted_arr);
                        res.send(200, formatted_arr);

                      } else {
                        var rec_cnt = 0;

                        for (var ck in qest_data) {
                          var obj = qest_data[ck];
                          var node = new Array();

                          cur_id = qest_data[ck].curriculum_id;
                          cur_name = curr_arr[cur_id];
                          grd_id = qest_data[ck].grade_id;
                          grd_name = grade_arr[grd_id];
                          subj_id = qest_data[ck].subject_id;
                          if (subj_arr[subj_id] == undefined) {
                            subj_name = "";
                          } else {
                            subj_name = subj_arr[subj_id];
                          }

                          obj.question=obj.question.replace(/<\/?img[^>]*>/g, "<img src=''>");
                          var nodeobj = {};
                          nodeobj.id = obj.id;
                          nodeobj.curriculum = cur_name;
                          nodeobj.grade = grd_name;
                          nodeobj.subject = subj_name;
                          nodeobj.question = obj.question;
                          nodeobj.question_type = obj.question_type_id;
                          nodeobj.description = obj.description;
                          nodeobj.unit_id = obj.unit_id;
                          nodeobj.module_id = obj.module_id;
                          nodeobj.status = obj.status;

                          formatted_arr[rec_cnt] = nodeobj;
                          rec_cnt++;
                        }
                        // console.log(formatted_arr);
                        res.send(200, formatted_arr);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  del_question: function (req, res) {
    var auth = req.body.auth ? req.body.auth : false;
    var sec_id = req.body.sec_id ? req.body.sec_id : false;
    var question_id = req.body.question_id ? req.body.question_id : false;
    Assessmentzone.query('SELECT main_quest_id FROM ques_section_mapping WHERE question_id =' + question_id, function (err, mquest_id) {
      if (err) {
        res.send(200, JSON.stringify({msg: "Something wrong"}));
      } else {
        var main_quest_id = mquest_id[0].main_quest_id;
        Assessmentzone.query('SELECT * FROM ques_section_mapping WHERE main_quest_id =' + main_quest_id, function (err, qid_list) {
          if (err) {
            res.send(200, JSON.stringify({msg: "Something wrong"}));
          } else {
            if (qid_list.length > 0) {
              var qid_arr = new Array();
              for (var i = 0; qid_list.length >= i; i++) {
                var qt = qid_list[i];
                if (qt != undefined) {
                  if (qt.question_id != undefined) {
                    qid_arr[i] = qt.question_id;
                  }
                }
              }
              var ans_sql = 'UPDATE answer WHERE question_id IN ( ' + qid_arr.join() + ' ) ';
              var qtn_sql = 'DELETE FROM question  WHERE id IN ( ' + qid_arr.join() + ' ) ';
              var qmp_sql = 'DELETE FROM ques_section_mapping WHERE question_id IN ( ' + qid_arr.join() + ' ) ';

              Assessmentzone.query(ans_sql, function (err, msg) {
                if (err) {
                  res.send(200, JSON.stringify({msg: "Something wrongk"}));
                } else {
                  Assessmentzone.query(qtn_sql, function (err, msg) {
                    if (err) {
                      res.send(200, JSON.stringify({msg: "Something wronge"}));
                    } else {
                      Assessmentzone.query(qmp_sql, function (err, msg) {
                        if (err) {
                          res.send(200, JSON.stringify({msg: "Something wrongs"}));
                        } else {
                          res.send(200, JSON.stringify({msg: "success"}));
                        }
                      });
                    }
                  });
                }
              });
            }
            //res.send(200, JSON.stringify({msg: "Something wrongz"}));
          }
        });
      }
    });
  },
  get_quest_details: function (req, res) {
    var auth = req.body.auth ? req.body.auth : false;
    var sec_id = req.body.sec_id ? req.body.sec_id : false;
    var question_id = req.body.question_id ? req.body.question_id : false;
    var result = {};

    if (auth) {
      Assessmentzone.query('SELECT * FROM question WHERE id=' + question_id, function (err, qdata) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        } else {
          result_arr = {};
          if (qdata.length > 0) {
            curriculum_id = qdata[0].curriculum_id;
            grade_id = qdata[0].grade_id;
            subject_id = qdata[0].subject_id;
            unit_id = qdata[0].unit_id;
            module_id = qdata[0].module_id;
            created_by = qdata[0].created_by;
            created_date = qdata[0].created_date;

            Assessmentzone.query('SELECT name FROM  curriculum  WHERE id=' + curriculum_id, function (err, curr_arr) {
              if (err) {
                res.send(200, JSON.stringify({msg: "Something wrong"}));
              } else {
                Assessmentzone.query('SELECT grade FROM grade WHERE id =' + grade_id, function (err, grade_arr) {
                  if (err) {
                    res.send(200, JSON.stringify({msg: "Something wrong"}));
                  } else {
                    Assessmentzone.query('SELECT name FROM subject WHERE id =' + subject_id, function (err, subj_arr) {
                      if (err) {
                        res.send(200, JSON.stringify({msg: "Something wrong"}));
                      } else {
                        Assessmentzone.query('SELECT * FROM unit WHERE id=' + unit_id, function (err, unit_arr) {
                          if (err) {
                            res.send(200, JSON.stringify({msg: "Something wrong"}));
                          } else {
                            Assessmentzone.query('SELECT * FROM module WHERE id =' + module_id, function (err, mdle_arr) {
                              if (err) {
                                res.send(200, JSON.stringify({msg: "Something wrong"}));
                              } else {
                                Assessmentzone.query('SELECT * FROM tutor WHERE user_id =' + created_by, function (err, usr_arr) {
                                  if (err) {
                                    res.send(200, JSON.stringify({msg: "Something wrong"}));
                                  } else {
                                    result_arr.id = qdata[0].id;
                                    result_arr.question = qdata[0].question;
                                    result_arr.quest_type_id = qdata[0].question_type_id;
                                    result_arr.description = qdata[0].description;
                                    result_arr.status = qdata[0].status;
                                    result_arr.curriculum = curr_arr[0].name;
                                    result_arr.grade = grade_arr[0].grade;
                                    result_arr.subject = subj_arr[0].name;
                                    result_arr.unit = unit_arr[0].name;
                                    result_arr.module = mdle_arr[0].name;
                                    result_arr.created_by = usr_arr[0].name;

                                    Assessmentzone.query('SELECT * FROM answer WHERE question_id =' + question_id, function (err, ans_data) {
                                      if (err) {
                                        res.send(200, JSON.stringify({msg: "Something wrong"}));
                                      } else {
                                        var formatted_arr = new Array();
                                        if (ans_data.length > 0) {
                                          rec_cnt = 0;
                                          for (var ck in ans_data) {
                                            var obj = ans_data[ck];
                                            var nodeobj = {};
                                            nodeobj.id = obj.id;
                                            nodeobj.answer = obj.answer;
                                            nodeobj.correct = obj.correct;
                                            formatted_arr[rec_cnt] = nodeobj;
                                            rec_cnt++;
                                          }
                                        }
                                        result.quest_data = result_arr;
                                        result.answer = formatted_arr;


                                        res.send(200, JSON.stringify(result));
                                      }
                                    });
                                    // res.send(200, JSON.stringify(result_arr));
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          //  res.send(200, JSON.stringify(result_arr));
        }
      });
    }
  },


}
