module.exports = {


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
        Package.query('select p.id,p.name as p_name,c.name as c_name, g.grade ' +
          'from ' +
          'package p ' +
          'inner join ' +
          'curriculum c ' +
          'on p.curriculum_id = c.id ' +
          'inner join ' +
          'grade g ' +
          'on p.grade_id = g.id ORDER BY id;',
          function (err, packages) {
            if (err) {
              //res.send(err);
              //res.send(401,JSON.stringify({msg:"Something wrong"}));
              return res.view('404');
            } else {

              Package.query('SELECT id,name FROM package_type', function (err, ptype) {
                if (err) {
                  //res.send(err);
                  // res.send(401,JSON.stringify({msg:"Something wrong"}));
                  return res.view('404');
                } else {
                  return res.view('package/index', {

                    ptype: ptype,
                    role: role0,
                    name: name0,
                    auth: key
                  });
                }
              });
              // console.log(packages);


            }
          });


      }
    } else {

      return res.redirect("/login");

    }


  },
  loadAddPackageSec: function (req, res) {
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      if (auth && auth1) {

        Package.query(' CALL `spGetNullSelectionList`();', function (err, packagesec) {
          if (err) {
            return res.view('404');
          } else {
            Package.query('SELECT id, name FROM	selection_list;', function (err, section) {
              if (err) {
                return res.view('404');
              } else {
                // console.log(packagesec['0']);

                return res.view('package/package_section_add', {
                  msg: true,
                  st: true,
                  section: section,
                  packsec: packagesec['0'],
                  role: role0,
                  name: name0,
                  auth: key
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
  loadAddPackageSecFromPid: function (req, res) {


    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var pid = req.query.pid ? req.query.pid : false;
      if (auth && auth1 && pid) {

        //  console.log(pid);


        Package.query('SELECT PS.`package_id` , PS.`subject_id` , ' +
          'S.name as subject, P.name as package , P.`curriculum_id` , ' +
          'P.`grade_id` , C.name as curriculumn, ' +
          'G.grade FROM `package_subject` PS ' +
          'JOIN subject as S ON PS.`subject_id` = S.id ' +
          'JOIN package as P ON PS.`package_id` = P.id ' +
          'JOIN curriculum as C ON C.id = P.`curriculum_id` ' +
          'JOIN grade as G ON G.id = P.`grade_id` ' +
          'WHERE PS.`selection_list_id` IS NULL AND P.id=' + pid + ';',
          function (err, packagesec) {
            if (err) {
              console.log(err)
              //return res.view('404');
            } else {
              Package.query('SELECT id, name FROM	selection_list;', function (err, section) {
                if (err) {
                  return res.view('404');
                } else {
                  // console.log(packagesec);

                  return res.view('package/package_section_add', {
                    msg: true,
                    st: false,
                    section: section,
                    packsec: packagesec,
                    role: role0,
                    name: name0,
                    auth: key
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
  loadAddPackageSecFromEditPid: function (req, res) {
    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var pid = req.query.pid ? req.query.pid : false;
      if (auth && auth1 && pid) {

        //  console.log(pid);


        Package.query('SELECT PS.`package_id` , PS.`subject_id` , ' +
          'S.name as subject, P.name as package , P.`curriculum_id` , ' +
          'P.`grade_id` , C.name as curriculumn, ' +
          'G.grade FROM `package_subject` PS ' +
          'JOIN subject as S ON PS.`subject_id` = S.id ' +
          'JOIN package as P ON PS.`package_id` = P.id ' +
          'JOIN curriculum as C ON C.id = P.`curriculum_id` ' +
          'JOIN grade as G ON G.id = P.`grade_id` ' +
          'WHERE P.id=' + pid + ';',
          function (err, packagesec) {
            if (err) {
              console.log(err)
              //return res.view('404');
            } else {
              Package.query('SELECT id, name FROM	selection_list;', function (err, section) {
                if (err) {
                  return res.view('404');
                } else {
                  // console.log(packagesec);

                  return res.view('package/package_section_add', {
                    msg: true,
                    st: false,
                    section: section,
                    packsec: packagesec,
                    role: role0,
                    name: name0,
                    auth: key
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
  loadcinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth) {
        Package.query('SELECT id,name FROM curriculum', function (err, curriculum) {
          if (err) {
            // res.send(err);
            //res.send(401,JSON.stringify({msg:"Something wrong"}));
            return res.view('404');
          } else {
            Package.query('SELECT id,grade FROM grade', function (err, grade) {
              if (err) {
                //res.send(err);
                // res.send(401,JSON.stringify({msg:"Something wrong"}));
                return res.view('404');
              } else {
                Package.query('SELECT id,name FROM subject', function (err, subjects) {
                  if (err) {
                    // res.send(err);
                    // res.send(401,JSON.stringify({msg:"Something wrong"}));
                    return res.view('404');
                  } else {
                    Package.query('SELECT id,name FROM package_type', function (err, ptype) {
                      if (err) {
                        //res.send(err);
                        // res.send(401,JSON.stringify({msg:"Something wrong"}));
                        return res.view('404');
                      } else {
                        return res.view('package/create', {
                          curriculum: curriculum,
                          grade: grade,
                          subjects: subjects,
                          ptype: ptype,
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
        });

      }
    } else {

      localStorage.removeItem('admin0');
      return res.redirect("/login");
    }


  },
  add: function (req, res) {

    //console.log(req.body)

    var pname = req.body.p_name ? req.body.p_name : false;
    var gid = req.body.g_type ? req.body.g_type : false;
    var cid = req.body.c_type ? req.body.c_type : false;
    var subject = req.body.s_subject ? req.body.s_subject : false;
    var monthly = req.body.monthly ? req.body.monthly : false;
    var termly = req.body.termly ? req.body.termly : false;
    var annually = req.body.annually ? req.body.annually : false;
    var ptype = [req.body.mid, req.body.tid, req.body.aid];
    if (monthly && annually && annually) {

      var price = [monthly, termly, annually];

    }

    if (pname && gid && cid && subject && monthly && termly && annually) {
      this.addPackageData(pname, gid, cid, subject, ptype, price, res, function (err, data, sub) {
        for (var i = 0; i < sub.length; i++) {
          Package.query("SET @p0=" + data + "; SET @p1=" + sub[i] + "; CALL spInsertPackageSubject(@p0, @p1);", function (err, smsg) {
            if (err) {
              // console.log(err);
              // res.send(JSON.stringify({msg:"danger"}));
              // res.send(401,JSON.stringify({msg:"Something wrong"}));
              return res.view('404');
            }

            if (smsg) {

              // console.log(data);


            }


          });
        }

      });


    } else {

      localStorage.removeItem('admin0');
      return res.redirect("/login");
    }
  },
  editPackageDataSet: function (req, res) {
    var pid = req.body.pid ? req.body.pid : false;
    if (pid) {
      Package.query('SELECT id,name FROM curriculum', function (err, curriculum) {
        if (err) {
          // res.send(err);
          //res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        } else {
          Package.query('SELECT id,grade FROM grade', function (err, grade) {
            if (err) {
              //res.send(err);
              // res.send(401,JSON.stringify({msg:"Something wrong"}));
              return res.view('404');
            } else {
              Package.query('SELECT id,name FROM subject', function (err, subjects) {
                if (err) {

                } else {
                  Package.query('SELECT p.id AS package_id,p.name package_name, ' +
                    'c.id AS curriculum_id,c.name curriculum_name, ' +
                    'g.id AS grade_id,g.grade grade_name ' +
                    'FROM `package` as p JOIN `curriculum` AS c ' +
                    'ON p.curriculum_id=c.id JOIN `grade` AS g ' +
                    'ON p.grade_id=g.id WHERE p.id=' + pid + ';',
                    function (err, packagedata) {
                      if (err) {
                        //console.log(err)
                        return res.view('404');
                      }
                      if (packagedata) {

                        // console.log(packagedata);
                        Package.query('SELECT s.id AS subject_id,s.name AS subject_name ' +
                          'FROM `package_subject` AS ps ' +
                          'JOIN `subject` AS s ON ps.subject_id=s.id ' +
                          'WHERE ps.package_id=' + pid + ';',
                          function (err, subject) {
                            if (err) {
                              return res.view('404');
                            }
                            if (subject) {

                              Package.query('SELECT pp.id AS id,pt.name AS type_name,pp.price AS price ' +
                                'FROM `package_price` AS pp ' +
                                'JOIN `package_type` AS pt ' +
                                'ON pt.id=pp.package_type_id WHERE pp.package_id=' + pid + ';',
                                function (err, pricetype) {
                                  if (err) {
                                    //console.log(err);
                                    return res.view('404');
                                  }
                                  if (pricetype) {

                                    //console.log(JSON.stringify(curriculum));

                                    res.send(200, JSON.stringify({
                                      pgdata: packagedata,
                                      psubject: subject,
                                      pricetype: pricetype,
                                      curriculum: curriculum,
                                      grade: grade,
                                      subjects: subjects,
                                    }));

                                    //console.log(subject);

                                  }

                                });


                              //console.log(subject);

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

  },
  addPackageData: function (name, id, cids, sub, package, price, res, cb) {
    Package.query("SET @p0='" + name + "'; SET @p1=" + id + "; SET @p2=" + cids + "; CALL spInsertPackage(@p0, @p1, @p2, @p3); SELECT @p3 AS st;", function (err, msg) {
      if (err) {
        //console.log(err);
        // res.send(JSON.stringify({msg:"danger"}));
        // res.send(401,JSON.stringify({msg:"Something wrong"}));
        return res.view('404');
      } else {


        // console.log("test");
        // console.log(package['0']);
        var rid = msg['3']['0']['pid'];
        //console.log("test1");
        for (var i = 0; i < package.length; i++) {
          Package.query("SET @p0=" + rid + "; SET @p1=" + price[i] + "; SET @p2=" + package[i] + "; CALL spInsertPackagePrice(@p0, @p1, @p2, @p3); SELECT @p3 AS st;", function (err, msg) {
            if (err) {
              // console.log(err);
              // res.send(JSON.stringify({msg:"danger"}));
              // res.send(401,JSON.stringify({msg:"Something wrong"}));
              return res.view('404');
            } else {
              //console.log("insertsucseesfuly");


            }


          });

        }

        res.send(200, JSON.stringify({msg: 'ok', pid: rid}));
        cb(null, rid, sub);

      }


    });

  },
  setSectionToPackage: function (req, res) {

    //console.log(req.body)

    var p_type = req.body.p_type ? req.body.p_type : false;
    var gid = req.body.g_type ? req.body.g_type : false;
    var cid = req.body.c_type ? req.body.c_type : false;
    var subject = req.body.s_subject ? req.body.s_subject : false;
    var sec_type = req.body.sec_type ? req.body.sec_type : false;
    if (p_type && gid && cid && subject && sec_type) {

      Package.query('SET @p0=' + subject + '; SET @p1=' + gid + '; SET @p2=' + cid + '; SET @p3=' + sec_type + '; ' +
        'CALL `spUpdatePackageSubjectSelectionListID`(@p0, @p1, @p2, @p3);',
        function (err, msg) {
          if (err) {

            //  console.log(err);
            res.send(401, JSON.stringify({msg: "Something wrong"}));

          }

          if (msg) {

            //console.log(msg);
            res.send(200, JSON.stringify({msg: "Success"}));


          }


        });

      //console.log(p_type+"--"+gid+"--"+cid+"--"+subject+"--"+sec_type);

    }


  },
  update: function (req, res) {

    var pid = req.body.pid ? req.body.pid : false;
    var pname = req.body.p_name ? req.body.p_name : false;
    var gid = req.body.g_type ? req.body.g_type : false;
    var cid = req.body.c_type ? req.body.c_type : false;
    var subject = req.body.s_subject ? req.body.s_subject : false;
    var monthly = req.body.monthly ? req.body.monthly : false;
    var termly = req.body.termly ? req.body.termly : false;
    var annually = req.body.annually ? req.body.annually : false;
    var ptype = [req.body.mid, req.body.tid, req.body.aid];
    var remSubjects = req.body.removeSubjects ? req.body.removeSubjects : false;

    //console.log(remSubjects);


    if (monthly && annually && annually) {

      var price = [monthly, termly, annually];

    }


    if (pid && pname && gid && cid && subject && monthly && termly && annually && remSubjects) {
      this.updatePackageData(pid, pname, gid, cid, subject, ptype, price, res, function (err, data, sub) {


        for (var i = 0; i < sub.length; i++) {
          Package.query('SET @p0=' + pid + '; SET @p1=' + sub[i] + '; CALL `spUpdatePackageSubject`(@p0, @p1);', function (err, smsg) {
            if (err) {
              //console.log(err);
              res.send(200, JSON.stringify({msg: "error"}));
              // res.send(JSON.stringify({msg:"danger"}));
              //  return res.view('404');
            }

            if (smsg) {


            }


          });
        }

        if (remSubjects.length != 0) {
          for (var j = 0; j < remSubjects.length; j++) {
            Package.query('DELETE FROM `package_subject` WHERE `package_id`=' + pid + ' AND `subject_id`=' + remSubjects[j] + ' ;', function (err, msg) {
              if (err) {
                //console.log(err);
                res.send(200, JSON.stringify({msg: "error"}));
                // res.send(JSON.stringify({msg:"danger"}));
                //  return res.view('404');
              }

              if (msg) {


              }


            });

          }
        }

        res.send(200, JSON.stringify({msg: 'ok', pid: pid}));


      });


    } else {

      localStorage.removeItem('admin0');
      return res.redirect("/login");
    }
  },
  updatePackageData: function (pid, name, gid, cids, sub, package, price, res, cb) {
    Package.query("SET @p0=" + pid + "; SET @p1='" + name + "'; SET @p2=" + gid + "; SET @p3=" + cids + "; CALL `spUpdatePackage`(@p0, @p1, @p2, @p3);", function (err, package_subject) {
      if (err) {
        // console.log(err);
        res.send(200, JSON.stringify({msg: "error"}));
        //  return res.view('404');
      }

      if (package_subject) {
        // console.log(package_subject);

        var ps_array = [];
        ps_array = package_subject;
        ps_array.splice(0, 1);
        ps_array.splice(0, 1);
        ps_array.splice(0, 1);
        ps_array.splice(0, 1);
        ps_array.splice((ps_array.length - 1), 1);
        for (var i = 0; i < package.length; i++) {

          Package.query("SET @p0=" + package[i] + "; SET @p1=" + price[i] + "; SET @p2=" + pid + "; CALL `spUpdatePackagePrice`(@p0, @p1, @p2);", function (err, msg) {
            if (err) {
              res.send(200, JSON.stringify({msg: "error"}));
              //return res.view('404');
            } else {

            }


          });

        }

        cb(null, ps_array[0], sub);

      }


    });

  },
  delete: function (req, res) {
    var pid = req.body.pid ? req.body.pid : false;
    if (pid) {

      Package.query("SET @p0=" + pid + "; SELECT `fnDeletePackage`(@p0) AS `fnDeletePackage`;", function (err, msg) {
        if (err) {
          // console.log(err);
          res.send(200, JSON.stringify({msg: "error"}));
        }
        if (msg) {

          if (msg[1][0]['fnDeletePackage'] == "T") {

            res.send(200, JSON.stringify({msg: 'Success'}));

          }

        }


      });


    }

  },
  getPackageDataCount: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    if (auth) {
      Module.query('SELECT COUNT(`id`) AS data_count FROM `package`;', function (err, data) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));


        }

        if (data) {

          res.send(200, data);
        }


      });


    }


  },
  getPackageData: function (req, res) {

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
      Package.query('SELECT p.id,p.name as p_name,c.name as c_name, g.grade ' +
        'from ' +
        'package p ' +
        'inner join ' +
        'curriculum c ' +
        'on p.curriculum_id = c.id ' +
        'inner join ' +
        'grade g ' +
        'on p.grade_id = g.id ORDER BY id ' +
        'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, package) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (package) {

          Package.query('SELECT id,name FROM package_type', function (err, ptype) {
            if (err) {

              res.send(200, JSON.stringify({msg: "Something wrong"}));
            }
            else {
              if (package.length > 0) {
                res.send(200, JSON.stringify({package: package}));
              } else {
                res.send(200, JSON.stringify({package: []}));
              }
            }
          });




        }


      });


    }


  },


};
