module.exports = {

  loadiinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var currentPage = 1;
    if (typeof req.param('page') !== 'undefined') {
      currentPage = +req.param('page');
    }
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {

        Module.query('SELECT COUNT(DISTINCT PM.module_id) as data_count FROM package_subject_module PM , module M ' +
          'WHERE M.id = PM.module_id AND package_subject_id ' +
          'IN (SELECT DISTINCT id FROM package_subject ' +
          'WHERE selection_list_id ='+ sec_type +');', function (err, count) {

          if (err) {

              console.log(err)
          }

          if (count) {

            Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module_data) {
              if (err) {

                return res.view('404');
              }
              if (module_data) {

                Module.query(' SELECT `name` FROM `selection_list` WHERE `id`=' + sec_type + ';', function (err, section) {
                  if (err) {

                    return res.view('404');
                  }
                  if (module_data) {

                    var total = count[0]["data_count"];
                     var module=[]
                      module = module_data;
                      module.splice(0, 1);
                      module.splice((module.length - 1), 1);

                    if (module[0].length > 0) {

                      Utils.getPaginationData(total , module[0], currentPage, function (err, data) {
                          if (err) {
                            res.send(401, JSON.stringify({msg: "Something wrong"}));
                          }
                          if (data) {
                           return res.view('module/index', {
                              pageSize: data.pageSize,
                              total: total,
                              pageCount: data.pageCount,
                              currentPage: currentPage,
                              role: role0,
                              name: name0,
                              auth: key,
                              module: data.dataList,
                              section: section[0],
                              msg: true
                            });
                          }

                      });

                    } else {

                      return res.view('module/index', {
                        role: role0,
                        name: name0,
                        auth: key,
                        msg: false
                      });
                    }

                  }
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
  loadcinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var tutor_sec = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && tutor_sec) {
        return res.view('module/create', {
          role: role0,
          name: name0,
          auth: key
        });

      }

    } else {
      return res.redirect("/login");
    }
  },
  loadsubject: function (req, res) {

    //console.log(req.body);

    var pid = req.body.pval ? req.body.pval : false;
    if (pid) {
      Module.query('SET @p0=' + pid + '; CALL spGetPackageSubject(@p0);', function (err, subjects) {
        if (err) {
          //console.log(err)
          // res.send(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
          //return res.view('404');
        }
        if (subjects) {
          // res.send(subjects['1']['0']);

          var array = [];
          array = subjects;
          array.splice(0, 1);
          array.splice((array.length - 1), 1);


          //console.log(JSON.stringify(array));
          res.send(200, JSON.stringify(array));
        }
      });

    }

  },
  getDes: function (req, res) {
    var id = req.body.id ? req.body.id : false;

    if (id) {

      Module.query('SELECT `description` FROM `module` WHERE id=' + id + ';', function (err, module) {
        if (err) {

          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (module) {

          res.send(200, JSON.stringify(module));


        }
      });

    }


  },
  getModuleFromSec: function (req, res) {

    var sec = req.body.sec_type ? req.body.sec_type : false;

    if (sec) {
      Module.query('SET @p0 =' + sec + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
        if (err) {
          return res.view('404');
        }
        if (module) {


          var array = [];
          array = module;
          array.splice(0, 1);
          array.splice((array.length - 1), 1);
          res.send(200, JSON.stringify({data: array[0]}));
        }

      });

    }
  },
  add: function (req, res) {

    var sec_type = req.body.sec_type ? req.body.sec_type : false;
    var mnane = req.body.m_name ? req.body.m_name : "";
    var mdesc = req.body.m_des ? req.body.m_des : "";

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
    if (sec_type && mnane) {
      Module.query("SET @p0='" + mysql_real_escape_string(mnane) + "'; SET @p1=" + sec_type + "; SET @p2='" + mysql_real_escape_string(mdesc) + "'; CALL `spInsertModule`(@p0, @p1, @p2, @p3); SELECT @p3 AS `st`;", function (err, data) {
        if (err) {
          //console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
          ///return res.view('404');
        }
        if (data) {
          //  console.log(data)
          if (data[4][0]['st'] === 'T')
            res.send(200, {msg: "data Insert successfully"});

        } else {
          res.send(200, {msg: "data Insert fail"});
        }
      });

    } else {
      res.send(200, {msg: "data error"});
      return res.redirect("/login");
    }


  },
  delete: function (req, res) {
    var module_id = req.body.module_id ? req.body.module_id : false;
    //console.log(module_id);
    if (module_id) {
      Module.query('DELETE FROM module WHERE id=' + module_id + ';', function (err, msg) {
        if (err) {

          //  console.log(err);

          res.send(401, JSON.stringify({msg: "Something wrong"}));


        }

        if (msg) {

          //console.log(msg['affectedRows']);
          if (msg['affectedRows'] > 0) {
            res.send(200, JSON.stringify({msg: 'Success'}));

          }
        }
      });


    } else {

      return res.redirect("/login");
    }
  },
  update: function (req, res) {

    var module_id = req.body.m_id ? req.body.m_id : false;
    var module_name = req.body.m_name ? req.body.m_name : "";
    var module_des = req.body.m_des ? req.body.m_des : "";

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

    if (module_id && module_name && module_des) {
      Unit.query("UPDATE module SET name='" + mysql_real_escape_string(module_name) + "', description='" + mysql_real_escape_string(module_des) + "' WHERE id=" + module_id + ";", function (err, msg) {
        if (err) {
          //console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));

        }

        if (msg) {
          //console.log(msg['changedRows'])
          if ((msg['changedRows'] > 0)) {
            res.send(200, JSON.stringify({msg: 'Success'}));
          } else {

            res.send(200, JSON.stringify({msg: 'error'}));
          }
        }
      });

    }


  },
  getModuleSecDataCount: function (req, res) {

    var sec_id = req.body.sec_id ? req.body.sec_id : false;
    if (sec_id) {
      Module.query('SELECT COUNT(DISTINCT PM.`module_id`) AS data_count FROM `package_subject_module` PM , module M WHERE M.id = PM.module_id ' +
        'AND `package_subject_id` ' +
        'IN (SELECT DISTINCT `id` FROM `package_subject` WHERE `selection_list_id` =' + sec_id + ');', function (err, data) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));


        }

        if (data) {

          res.send(200, data);
        }


      });


    }


  },
  getModuleSecData: function (req, res) {

    var sec_id = req.body.sec_id ? req.body.sec_id : false;
    var page_id = req.body.page_id ? req.body.page_id : false;
    var pageLimit = 5;


    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);

    }

    if (sec_id && page_id) {
      Module.query('SELECT DISTINCT PM.`module_id`, M.name FROM `package_subject_module` PM , module M WHERE M.id = PM.module_id ' +
        'AND `package_subject_id` ' +
        'IN (SELECT DISTINCT `id` FROM `package_subject` WHERE `selection_list_id` =' + sec_id + ')' +
        'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, module) {

        if (err) {

          //  console.log(err);
          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (module) {

          Module.query(' SELECT `name` FROM `selection_list` WHERE `id`=' + sec_id + ';', function (err, section) {
            if (err) {

              res.send(200, JSON.stringify({msg: "Something wrong"}));
            }
            if (module) {

              // console.log(module.length);

              if (module.length > 0) {
                res.send(200, JSON.stringify({module: module, section: section}));
              } else {
                res.send(200, JSON.stringify({module: [], section: section}));
              }

            }
          });


        }


      });


    }


  },

};
