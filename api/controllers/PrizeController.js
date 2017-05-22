var format = require('date-format');

module.exports = {

    load_addinterface: function (req, res) {

        var key     = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
          var auth     = dataSet.auth0 ? dataSet.auth0 : false;
          var auth1    = dataSet.auth1 ? dataSet.auth1 : false;
          var name0    = dataSet.name0 ? dataSet.name0 : false;
          var role0    = dataSet.role0 ? dataSet.role0 : false;
          var sec_type = dataSet.sec0  ? dataSet.sec0  : false;

          if (auth && auth1) {
            Module.query('SELECT id,name FROM selection_list', function (err, selection) {
              if (err) {
                return res.view('404');
              } else {
                return res.view('prize/add_new', {
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
                    return res.view('prize/prize_summery', {
                                role: role0,
                                name: name0,
                                auth: key,
                            });
              }
        } else {
          return res.redirect("/login");
        }
    },
    get_prize_smry: function(req, res) {
        var page_id   = req.body.page_id ? req.body.page_id : false;
        var pageLimit = 5;
        if (page_id == 1) {
            var st_limit  = 0;
            var end_limit = 5;
        } else {
            var st_limit  = (page_id - 1) * pageLimit;
            var end_limit = (st_limit + pageLimit);
        }
       // var authkey = req.param('auth') ? req.param('auth') : false;
        //var dataSet = JSON.parse(localStorage.getItem(authkey));

       // if (dataSet != null) {
            //var authkey     = dataSet.auth0 ? dataSet.auth0 : false;
            //var auth1    = dataSet.auth1 ? dataSet.auth1 : false;
           // var name0    = dataSet.name0 ? dataSet.name0 : false;
            //var role0    = dataSet.role0 ? dataSet.role0 : false;
            //var sec_type = dataSet.sec0  ? dataSet.sec0  : false;
            //if (auth && auth1) {
                Prize.query('SELECT * FROM curriculum', function(err, curr_data) {
                        if (err || curr_data.length == 0 ) {
                            return res.view('404');
                        } else {
                            var curr_arr = new Array();
                            for( var ckey in curr_data ) {
                               var obj       = curr_data[ckey];
                               var curr_id   = obj.id;
                               var curr_name = obj.name;
                               curr_arr[curr_id] = curr_name;
                            }
                            Prize.query('SELECT * FROM  grade', function(err, grade_data) {
                                if (err || grade_data.length == 0 ) {
                                    return res.view('404');
                                } else {
                                    var grade_arr = new Array();
                                    for( var gk in grade_data ) {
                                        var objg   = grade_data[gk];
                                        var g_id   = objg.id;
                                        var g_name = objg.grade;
                                        grade_arr[g_id] = g_name;
                                    }
                                    Prize.query('SELECT * FROM  subject', function(err, subj_data) {
                                        if (err || subj_data.length == 0 ) {
                                            return res.view('404');
                                        } else {
                                            var subj_arr = new Array();
                                            for( var sky in subj_data ) {
                                                var objs   = subj_data[sky];
                                                var s_id   = objs.id;
                                                var s_name = objs.name;
                                                subj_arr[s_id] = s_name;
                                            }
                                            Prize.query('SELECT * FROM  star_prize_config ORDER BY created_date'+
                                                ' DESC LIMIT '+st_limit+','+ pageLimit +';', function(err, config_data) {
                                                if (err || config_data.length == 0 ) {
                                                    return res.view('404');
                                                }  else {

                                                    var rec_cnt = 0;
                                                    var formatted_arr = new Array();
                                                    for( var ck in config_data ) {
                                                        var obj = config_data[ck];
                                                        var node = new Array();

                                                        cur_id   = config_data[ck].curriculum_id;
                                                        cur_name = curr_arr[cur_id];
                                                        grd_id   = config_data[ck].grade_id;
                                                        grd_name = grade_arr[grd_id];

                                                        subj_id   = config_data[ck].subject_id;
                                                        if( subj_arr[subj_id] == undefined ) {
                                                            subj_name = "";
                                                        } else {
                                                            subj_name = subj_arr[subj_id];
                                                        }

                                                        var prize_type_name = "";
                                                        if( obj.prize_type == "SUBJECT_PRIZE") {
                                                            prize_type_name = "Subject Prize";
                                                        } else if( obj.prize_type == "GRADE_PRIZE" ) {
                                                            prize_type_name = "Grade Prize";
                                                        }
                                                        var st_dt  = format.asString('yyyy-MM-dd', obj.price_start_date);
                                                        var end_dt = format.asString('yyyy-MM-dd', obj.price_end_date);
                                                        /*
                                                        node["id"]          =  obj.id;
                                                        node["config_name"] =  obj.config_name;
                                                        node["curriculum"]  =  cur_name;
                                                        node["grade"]       =  grd_name;
                                                        node["config_name"] =  obj.config_name;
                                                        node["subject"]     =  subj_name;
                                                        node["prize_type"]  =  prize_type_name;
                                                        node["price_start_date"] = st_dt;
                                                        node["price_end_date"]   = end_dt;
                                                        node["status"]      = obj.status;
                                                       // formatted_arr[rec_cnt] = node;
                                                        */
                                                        var nodeobj = {};
                                                        nodeobj.id = obj.id;
                                                        nodeobj.config_name =  obj.config_name;
                                                        nodeobj.curriculum  =  cur_name;
                                                        nodeobj.grade       =  grd_name;
                                                        nodeobj.config_name =  obj.config_name;
                                                        nodeobj.subject     =  subj_name;
                                                        nodeobj.prize_type  =  prize_type_name;
                                                        nodeobj.price_start_date = st_dt;
                                                        nodeobj.price_end_date   = end_dt;
                                                        nodeobj.status      = obj.status;

                                                        formatted_arr[rec_cnt] = nodeobj;
                                                        rec_cnt++;
                                                    }
                                                   res.send(200, formatted_arr);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
            //}
       // } else {
           // return res.redirect("/login");
       // }
    },
    getPrizeConfCount: function (req, res) {
        var auth = req.body.auth ? req.body.auth : false;
        if (auth) {
            Module.query('SELECT COUNT(id) AS data_count FROM star_prize_config;', function (err, data) {
                if (err) {
                    res.send(200, JSON.stringify({msg: "Something wrong"}));
                }
                if (data) {
                   res.send(200, data);
                }
            });
        }
  },
    addConfirmData:function (req,res) {
      var section = req.body.sec_id;
      var subject = req.body.s_id;
      var prize_type = req.body.prize_type;
      var pzconf_name = req.body.pzconf_name;
      var st_date = req.body.st_date;
      var end_date = req.body.end_date ;
      var id = req.body.id ? req.body.id : false;
      var d = new Date();
      var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      if (prize_type == "GRADE_PRIZE") {

        Module.query("SET @p0 =" + section + "; CALL `spGetSelectionListFromID` (@p0);", function (err, section_data) {
          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));
          }
          if (section_data) {
            var sec_array = [];
            sec_array = section_data;
            sec_array.splice(0, 1);
            sec_array.splice((sec_array.length - 1), 1);
            var data_array = sec_array[0];
            var completed_requests = 0;

            var check = function (data, callback) {

              Prize.query('SELECT id FROM star_prize_config WHERE curriculum_id = "' + data['curriculum_id'] + '" AND grade_id="' + data['grade_id'] +
                '" AND subject_id=' + 0 + ' AND prize_type = "' + prize_type + '";',
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
                  completed_requests++;
                  if (completed_requests == (data_array.length)) {

                    // console.log("done")
                    res.send(200, {msg: "Exits"});

                  }
                } else {
                  Prize.query('INSERT INTO star_prize_config(config_name,curriculum_id,grade_id,' +
                    'subject_id,prize_type,price_start_date,price_end_date,status,created_date,' +
                    'created_by,last_mod_by,last_mod_date) VALUES ("'+pzconf_name+'",' + data['curriculum_id'] + ',' + data['grade_id'] + ',' + 0 + ',"'+prize_type+'",' +
                    '"'+st_date+'","'+end_date+'","ACTIVE","'+date+'",'+id+','+id+',"'+date+'");',
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
      if (prize_type == "SUBJECT_PRIZE") {


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

              Prize.query('SELECT id FROM star_prize_config WHERE curriculum_id = "' + data['curriculum_id'] + '" AND grade_id="' + data['grade_id'] +
                '" AND subject_id=' + subject + ' AND prize_type = "' + prize_type + '";',
                function (err, msg) {
                  if (err) {
                   console.log(err);

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
                  completed_requests++;
                  if (completed_requests == (data_array.length)) {

                    // console.log("done")
                    res.send(200, {msg: "Exits"});

                  }
                } else {
                   Prize.query('INSERT INTO star_prize_config(config_name,curriculum_id,grade_id,' +
                  'subject_id,prize_type,price_start_date,price_end_date,status,created_date,' +
                  'created_by,last_mod_by,last_mod_date) VALUES ("'+pzconf_name+'",' + data['curriculum_id'] + ',' + data['grade_id'] + ',' + subject + ',"'+prize_type+'",' +
                  '"'+st_date+'","'+end_date+'","ACTIVE","'+date+'",'+id+','+id+',"'+date+'");',
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






};
