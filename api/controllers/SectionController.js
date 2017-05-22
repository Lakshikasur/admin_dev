module.exports = {


    loadiinterface: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            if (auth && auth1) {

                Package.query('SELECT  PS.selection_list_id as id, SL.name as name,' +
                    'GROUP_CONCAT(DISTINCT(P.name)) as `package` ' +
                    'FROM `package_subject` PS, subject S, package P, curriculum C, grade G, selection_list SL ' +
                    'WHERE PS.`selection_list_id` IS NOT NULL AND ' +
                    'PS.`subject_id` = S.id AND PS.`package_id` = P.id AND ' +
                    'C.id = P.`curriculum_id` AND ' +
                    'G.id = P.`grade_id` AND SL.id = PS.selection_list_id group by SL.id',
                    function(err, section) {
                        if (err) {
                            return res.view('404');
                        }

                        if (section) {
                            //  console.log(section)
                            if (section.length > 0) {
                                return res.view('section/index', {
                                    role: role0,
                                    name: name0,
                                    auth: key,
                                    section: section,
                                    msg: true,
                                });

                            } else {
                                return res.view('section/index', {
                                    role: role0,
                                    name: name0,
                                    auth: key,
                                    msg: false,
                                });

                            }

                        }


                    });


            }
        } else {

            localStorage.removeItem('admin0');
            return res.redirect("/login");
        }


    },
    loadcinterface: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            if (auth) {
                Package.query('SELECT id,name FROM curriculum', function(err, curriculum) {
                    if (err) {
                        return res.view('404');
                    } else {
                        Package.query('SELECT id,grade FROM grade', function(err, grade) {
                            if (err) {
                                return res.view('404');
                            } else {
                                Package.query('SELECT id,name FROM subject', function(err, subjects) {
                                    if (err) {
                                        return res.view('404');
                                    } else {

                                        return res.view('section/course_section', {
                                            curriculum: curriculum,
                                            grade: grade,
                                            subjects: subjects,
                                            role: role0,
                                            name: name0,
                                            auth: key
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

            }
        } else {

            localStorage.removeItem('admin0');
            return res.redirect("/login");
        }


    },
    insertSection: function(req, res) {

        var sec_name = req.body.sec_name ? req.body.sec_name : false;
        var gid = req.body.g_type ? req.body.g_type : false;
        var cid = req.body.c_type ? req.body.c_type : false;
        var sub = req.body.s_subject ? req.body.s_subject : false;
        var data = [];


        if (sec_name && gid && cid && sub) {
            Package.query('SET @p0="' + sec_name + '"; SELECT `fnInsertSelectionList`(@p0) AS `fnInsertSelectionList`;', function(err, secid) {
                if (err) {
                    res.send(401, JSON.stringify({ msg: "Something wrong" }));

                }

                if (secid) {
                    formattedArr = new Array();
                    p = 0;
                    for (var i = 0; i < cid.length; i++) {
                        for (var j = 0; j < gid.length; j++) {
                            formattedArr[p] = { 'c': cid[i], 'g': gid[j] };
                            Package.query('SET @p0=' + sub + '; SET @p1=' + formattedArr[p]['g'] + '; SET @p2=' + formattedArr[p]['c'] + '; SET @p3=' + secid[1][0]['fnInsertSelectionList'] + '; CALL `spUpdatePackageSubjectSelectionListID`(@p0, @p1, @p2, @p3);', function(err, msg) {
                                if (err) {
                                    res.send(401, JSON.stringify({ msg: "Something wrong" }));
                                }

                                if (msg) {


                                }


                            });
                            p++;


                        }

                    }
                    res.send(200, JSON.stringify({ msg: "OK" }));

                }
            });


        } else {

            localStorage.removeItem('admin0');
            return res.redirect("/login");
        }
    },
    addpackagedata: function(name, id, cids, sub, package, price, res, cb) {
        Package.query("SET @p0='" + name + "'; SET @p1=" + id + "; SET @p2=" + cids + "; CALL spInsertPackage(@p0, @p1, @p2, @p3); SELECT @p3 AS st;", function(err, msg) {
            if (err) {
                res.send(401, JSON.stringify({ msg: "Something wrong" }));
            } else {
                var rid = msg['3']['0']['pid'];
                for (var i = 0; i < package.length; i++) {
                    Package.query("SET @p0=" + rid + "; SET @p1=" + price[i] + "; SET @p2=" + package[i] + "; CALL spInsertPackagePrice(@p0, @p1, @p2, @p3); SELECT @p3 AS st;", function(err, msg) {
                        if (err) {
                            res.send(401, JSON.stringify({ msg: "Something wrong" }));
                        } else {


                        }


                    });

                }
                Users.query("SELECT id from users WHERE status=1 and type=2", function(err, stdata) {
                    if (err) {
                        res.send(401, JSON.stringify({ msg: "Something wrong" }));
                    }

                    if (stdata) {

                        var d = new Date();
                        var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                        for (var i = 0; i < stdata.length; i++) {
                            Users.query("SET @p0='Add New Package" + " " + name + "'; SET @p1='No link'; SET @p3=" + stdata[i]['id'] + "; SET @p4='" + date + "'; CALL spInsertNotification(@p0, @p1, @p2, @p3, @p4); SELECT @p0 AS notification, @p1 AS link, @p2 AS feedID, @p3 AS userID, @p4 AS createdAt;", function(err, data) {
                                if (err) {
                                    return res.view('404');
                                }

                                if (data) {
                                    var entry = data['5']['0'];
                                    Feed.datasync(entry, function(err) {

                                    });


                                }


                            })
                        }
                        for (var i = 0; i < stdata.length; i++) {
                            Feed.query("SELECT COUNT(id) as count FROM `feed_user` WHERE user_id=" + stdata[i]['id'] + " AND status=0", function(err, count) {
                                if (err) {
                                    res.send(401, JSON.stringify({ msg: "Something wrong" }));
                                }


                                if (count) {
                                    var count = count['0'];
                                    Feed.datacountsync(count, function(err) {

                                    });


                                }
                            });
                        }


                    }

                });
                Users.query("SELECT id from users WHERE status=1 and type=1", function(err, admindata) {
                    if (err) {
                        res.send(401, JSON.stringify({ msg: "Something wrong" }));
                    }

                    if (admindata) {

                        var d = new Date();
                        var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                        for (var i = 0; i < admindata.length; i++) {
                            Users.query("SET @p0='Add New Package" + " " + name + "'; SET @p1='No link'; SET @p3=" + admindata[i]['id'] + "; SET @p4='" + date + "'; CALL spInsertNotification(@p0, @p1, @p2, @p3, @p4); SELECT @p0 AS notification, @p1 AS link, @p2 AS feedID, @p3 AS userID, @p4 AS createdAt;", function(err, data) {
                                if (err) {
                                    res.send(401, JSON.stringify({ msg: "Something wrong" }));
                                }

                                if (data) {
                                    var entry = data['5']['0'];
                                    Feed.datasync(entry, function(err) {

                                    });


                                }


                            })
                        }
                        for (var i = 0; i < admindata.length; i++) {
                            Feed.query("SELECT COUNT(id) as count FROM `feed_user` WHERE user_id=" + admindata[i]['id'] + " AND status=0", function(err, count) {
                                if (err) {
                                    res.send(401, JSON.stringify({ msg: "Something wrong" }));
                                }


                                if (count) {
                                    var count = count['0'];
                                    Feed.datacountsync(count, function(err) {

                                    });


                                }
                            });
                        }


                    }

                });
                res.send(200, JSON.stringify({ msg: 'ok' }));
                cb(null, rid, sub);

            }


        });

    },
    edit: function(req, res) {
        var sec_id = req.body.sec_id ? req.body.sec_id : false;
        var sec_name = req.body.sec_name ? req.body.sec_name : false;
        if (sec_id && sec_name) {
            Package.query('UPDATE selection_list SET name="' + sec_name + '" WHERE id=' + sec_id + ';', function(err, msg) {
                if (err) {
                    res.send(401, JSON.stringify({ msg: "Something wrong" }));

                }

                if (msg) {
                    if ((msg['changedRows'] == 1)) {
                        res.send(200, JSON.stringify({ msg: 'Success' }));
                    } else {

                        res.send(200, JSON.stringify({ msg: 'error' }));
                    }
                }
            });


        }

    },
    delete: function(req, res) {
        var sec_id = req.body.sec_id ? req.body.sec_id : false;
        if (sec_id) {
            Package.query('SET @p0=' + sec_id + '; CALL `spUpdatePackageSubjectSelectionListNULL`(@p0, @p1); SELECT @p1 AS `st`;', function(err, msg) {
                if (err) {
                    res.send(401, JSON.stringify({ msg: "Something wrong" }));
                }

                if (msg) {
                    var st = msg[2][0]['st']
                    if (st == "T") {
                        res.send(200, JSON.stringify({ msg: 'Success' }));

                    }
                }
            });


        } else {

            localStorage.removeItem('admin0');
            return res.redirect("/login");
        }
    },
    getSectionDataCount: function (req, res) {

      var auth = req.body.auth ? req.body.auth : false;
      if (auth) {
        Module.query('SELECT COUNT(DISTINCT PS.selection_list_id) AS data_count ' +
          'FROM `package_subject` PS, subject S, package P, curriculum C, grade G, ' +
          'selection_list SL WHERE PS.`selection_list_id` IS NOT NULL ' +
          'AND PS.`subject_id` = S.id AND PS.`package_id` = P.id AND C.id = P.`curriculum_id` ' +
          'AND G.id = P.`grade_id` AND SL.id = PS.selection_list_id', function (err, data) {
          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));


          }

          if (data) {

            res.send(200, data);
          }


        });


      }


    },
    getSectionData: function (req, res) {

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

        Package.query('SELECT  PS.selection_list_id as id, SL.name as name,' +
          'GROUP_CONCAT(DISTINCT(P.name)) as `package` ' +
          'FROM `package_subject` PS, subject S, package P, curriculum C, grade G, selection_list SL ' +
          'WHERE PS.`selection_list_id` IS NOT NULL AND ' +
          'PS.`subject_id` = S.id AND PS.`package_id` = P.id AND ' +
          'C.id = P.`curriculum_id` AND ' +
          'G.id = P.`grade_id` AND SL.id = PS.selection_list_id group by SL.id ' +
          'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, section) {

          if (err) {

            console.log(err);

            res.send(200, JSON.stringify({msg: "Something wrong"}));

          }

          if (section) {

                if (section.length > 0) {
                  res.send(200, JSON.stringify({section: section}));
                } else {
                  res.send(200, JSON.stringify({section: []}));
                }
              }
            });







      }


    },


};
