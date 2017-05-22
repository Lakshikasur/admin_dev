/**
 * UnitController
 *
 * @description :: Server-side logic for managing units
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");
var cross_path = require('path');

module.exports = {

  loadiinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    var currentPage = 1;
    if (typeof req.param('page') !== 'undefined') {
      currentPage = +req.param('page');
    }
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {


        Unit.query('SET @p0 =' + sec_type + ';CALL `spGetUnitFromSelectionListCount` (@p0);', function (err, count) {
          if (err) {

            return res.view('404');
          }
          if (count) {
            Unit.query('SET @p0 =' + sec_type + ';CALL `spGetUnitFromSelectionList` (@p0);', function (err, unit) {
              if (err) {

                return res.view('404');
              }
              if (unit) {

                var count_array = [];
                count_array = count;
                count_array.splice(0, 1);
                count_array.splice((count_array.length - 1), 1);

                var total = count_array[0][0]['no_of_units'];
                var unit_array = [];
                unit_array = unit;
                unit_array.splice(0, 1);
                unit_array.splice((unit_array.length - 1), 1);

                if (unit_array[0].length > 0) {

                Utils.getPaginationData(total, unit_array[0], currentPage, function (err, data) {
                    if (err) {
                      res.send(401, JSON.stringify({msg: "Something wrong"}));
                    }
                    if (data) {
                      return res.view('unit/index', {
                        pageSize: data.pageSize,
                        total: total,
                        pageCount: data.pageCount,
                        currentPage: currentPage,
                        role: role0,
                        name: name0,
                        auth: key,
                        unit: data.dataList,
                        msg: true
                      });
                    }

                  });
                } else {

                  return res.view('unit/index', {
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
      if (auth) {
        Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
          if (err) {
            // res.send(err);
            res.send(401, JSON.stringify({msg: "Something wrong"}));
          } else {
            var module_array = [];
            module_array = module;
            module_array.splice(0, 1);
            module_array.splice((module_array.length - 1), 1);


            if (module_array[0].length > 0) {
              return res.view('unit/create', {
                role: role0,
                name: name0,
                auth: key,
                module: module_array[0],
                msg: true
              });
            } else {

              return res.view('unit/create', {
                role: role0,
                name: name0,
                auth: key,
                module: [{module_id: "", name: "No Modules"}],
                msg: false
              });
            }


            //res.send(JSON.stringify(packages));
          }
        });

      }
    } else {

      return res.redirect("/login");
    }
  },
  loadFaqInterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth) {
        return res.view('unit/unit_faq_view', {
          role: role0,
          name: name0,
          auth: key,
          msg: true
        });

      }
    } else {

      return res.redirect("/login");
    }
  },
  loadFaqCreateInterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth) {
        Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
          if (err) {
            // res.send(err);
            res.send(401, JSON.stringify({msg: "Something wrong"}));
          } else {
            var module_array = [];
            module_array = module;
            module_array.splice(0, 1);
            module_array.splice((module_array.length - 1), 1);


            if (module_array[0].length > 0) {
              return res.view('unit/unit_faq', {
                role: role0,
                name: name0,
                auth: key,
                module: module_array[0],
                msg: true
              });
            } else {

              return res.view('unit/unit_faq', {
                role: role0,
                name: name0,
                auth: key,
                module: [{module_id: "", name: "No Modules"}],
                msg: false
              });
            }


            //res.send(JSON.stringify(packages));
          }
        });

      }
    } else {

      return res.redirect("/login");
    }
  },
  loadGlossInterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth) {
        return res.view('unit/unit_glossary_view', {
          role: role0,
          name: name0,
          auth: key,
          msg: true
        });

      }
    } else {

      return res.redirect("/login");
    }
  },
  loadGlossCreateInterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth) {
        Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
          if (err) {
            // res.send(err);
            res.send(401, JSON.stringify({msg: "Something wrong"}));
          } else {
            var module_array = [];
            module_array = module;
            module_array.splice(0, 1);
            module_array.splice((module_array.length - 1), 1);


            if (module_array[0].length > 0) {
              return res.view('unit/unit_glossary', {
                role: role0,
                name: name0,
                auth: key,
                module: module_array[0],
                msg: true
              });
            } else {

              return res.view('unit/unit_glossary', {
                role: role0,
                name: name0,
                auth: key,
                module: [{module_id: "", name: "No Modules"}],
                msg: false
              });
            }


            //res.send(JSON.stringify(packages));
          }
        });

      }
    } else {

      return res.redirect("/login");
    }
  },
  loadmodule: function (req, res) {
    var sec_type = req.body.sec_type ? req.body.sec_type : false;
    if (sec_type) {
      Module.query('SET @p0=' + sec_type + '; CALL `spGetModulesFromSelectionList`(@p0);', function (err, modules) {
        if (err) {
          //console.log(err)
          // res.send(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (modules) {

          var array = [];
          array = modules;
          array.splice(0, 1);
          array.splice((array.length - 1), 1);
          //  console.log(array);


          //console.log(JSON.stringify(array));
          res.send(200, JSON.stringify(array));
        }
      });

    }

  },
  add: function (req, res) {

    var mid = req.body.m_type ? req.body.m_type : false;
    var udes = req.body.u_des ? req.body.u_des : "";
    var uname = req.body.u_name ? req.body.u_name : "";


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

    if (mid && uname) {
      Unit.query("INSERT INTO `unit`(name, module_id, description) " +
        "VALUES ('" + mysql_real_escape_string(uname) + "'," + mid + ",'" + mysql_real_escape_string(udes) + "');",
        function (err, msg) {
          if (err) {
            res.send(err);
            //  res.send(401,JSON.stringify({msg:"Something wrong"}));
            // return res.view('404');
          }
          if (msg) {
            res.send(200, {msg: "data Insert successfully"});
          }
        });

    } else {
      res.send(200, {msg: "error"});
    }


  },
  delete: function (req, res) {
    var unit_id = req.body.unit_id ? req.body.unit_id : false;

    if (unit_id) {
      Module.query('DELETE FROM unit WHERE id=' + unit_id + ';', function (err, msg) {
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
      res.send(200, {msg: "error"});
    }
  },
  getDes: function (req, res) {

    //console.log(req.body.id);

    var id = req.body.id ? req.body.id : false;

    if (id) {

      Module.query('SELECT `description` FROM `unit` WHERE id=' + id + ';', function (err, unit) {
        if (err) {

          res.send(401, JSON.stringify({msg: "Something wrong"}));
        }
        if (unit) {

          res.send(200, JSON.stringify(unit));


        }
      });

    }


  },
  update: function (req, res) {

    var unit_id = req.body.u_id ? req.body.u_id : false;
    var unit_name = req.body.u_name ? req.body.u_name : "";
    var unit_des = req.body.u_des ? req.body.u_des : "";

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

    if (unit_id && unit_name && unit_des) {
      Unit.query("UPDATE unit SET name='" + mysql_real_escape_string(unit_name) + "', description='" + mysql_real_escape_string(unit_des) + "'  WHERE id=" + unit_id + ";", function (err, msg) {
        if (err) {
          // console.log(err);
          res.send(401, JSON.stringify({msg: "Something wrong"}));

        }

        if (msg) {
          if ((msg['changedRows'] > 0)) {
            res.send(200, JSON.stringify({msg: 'Success'}));
          } else {
            res.send(200, JSON.stringify({msg: 'error'}));
          }
        }
      });

    } else {
      res.send(200, {msg: "error"});
    }


  },
  addGlossary: function (req, res) {
   /* var unit_id = req.body.unit_id ? req.body.unit_id : false;
    var u_glossary = req.body.u_glossary ? req.body.u_glossary : "";
    var data = JSON.parse(u_glossary)
    var tu_id = req.body.tutor_id ? req.body.tutor_id : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

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

    if (unit_id && tu_id && u_glossary) {
      for (var i = 0; i < data.length; i++) {
        Unit.query("INSERT INTO unit_glossary(unit_id, glossary_word, glossary_mean, last_mod_by, last_mod_date, created_by, created_date)" +
          "VALUES (" + unit_id + ",'" + mysql_real_escape_string(data[i]["g_header"]) + "','" + mysql_real_escape_string(data[i]["g_description"]) + "'," + tu_id + ",'" + date + "'," + tu_id + ",'" + date + "');",
          function (err, msg) {
            if (err) {
              //res.send(200, JSON.stringify({msg: "Something wrong"}));
              console.log(err)
            }
            if (msg) {

            }
          });

      }
      res.send(200, {msg: "data Insert successfully"});

    } else {
      res.send(200, {msg: "error"});
    }*/

    var unit_id = req.body.unit_id ? req.body.unit_id : false;
    var data = req.body.u_gloss ? req.body.u_gloss : "";
    var tu_id = req.body.tutor_id ? req.body.tutor_id : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

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

    if (unit_id && tu_id && data) {
      for (var i = 0; i < data.length; i++) {
        Unit.query("INSERT INTO unit_glossary(unit_id, glossary_word, glossary_mean, last_mod_by, last_mod_date, created_by, created_date)" +
          "VALUES (" + unit_id + ",'" + mysql_real_escape_string(data[i]["g_header"]) + "','" + mysql_real_escape_string(data[i]["g_description"]) + "'," + tu_id + ",'" + date + "'," + tu_id + ",'" + date + "');",
          function (err, msg) {
            if (err) {
              //res.send(200, JSON.stringify({msg: "Something wrong"}));
              console.log(err)
            }
            if (msg) {

            }
          });

      }
      res.send(200, {msg: "data Insert successfully"});

    } else {
      res.send(200, {msg: "error"});
    }


  },
  addFaq: function (req, res) {
    var unit_id = req.body.unit_id ? req.body.unit_id : false;
    var data = req.body.u_faq ? req.body.u_faq : "";
    var tu_id = req.body.tutor_id ? req.body.tutor_id : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

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

    if (unit_id && tu_id && data) {
      for (var i = 0; i < data.length; i++) {
        Unit.query("INSERT INTO unit_faqs(unit_id, faq, faq_answer, hits, last_mod_by, last_mod_date, created_by, created_date)" +
          "VALUES (" + unit_id + ",'" + mysql_real_escape_string(data[i]["f_question"]) + "','" + mysql_real_escape_string(data[i]["f_answer"]) + "'," + 0 + "," + tu_id + ",'" + date + "'," + tu_id + ",'" + date + "');",
          function (err, msg) {
            if (err) {
              //res.send(200, JSON.stringify({msg: "Something wrong"}));
              console.log(err)
            }
            if (msg) {

            }
          });

      }
      res.send(200, {msg: "data Insert successfully"});

    } else {
      res.send(200, {msg: "error"});
    }


  },
  getFaqCount: function (req, res) {

    var sec_id = req.body.sec_type ? req.body.sec_type : false;
    if (sec_id) {
      Module.query('SELECT	DISTINCT(module_id) FROM	package_subject_module WHERE	package_subject_id IN( SELECT id FROM	package_subject WHERE	selection_list_id =' + sec_id + ');', function (err, data) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          if (data.length != 0) {

            var module_data = [];
            var i = 0;
            for (var j = 0; j < data.length; j++) {
              module_data[i] = data[j]['module_id'];
              i++;
            }
            var sqr_part1 = data.length != 1 ? (module_data.join()) : data[0]['module_id'];

            Module.query('SELECT U.id as unit_id FROM `unit` U, module M WHERE M.id = U. `module_id` AND M.id IN (' + sqr_part1 + ');', function (err, udata) {

              if (err) {

                res.send(200, JSON.stringify({msg: "Something wrong"}));

              }

              if (udata) {

                if (data.length != 0) {

                  var unit_data = [];
                  var k = 0;
                  for (var l = 0; l < udata.length; l++) {
                    unit_data[k] = udata[l]['unit_id'];
                    k++;
                  }
                  var sqr_part2 = udata.length != 1 ? (unit_data.join()) : udata[0]['unit_id'];
                  Module.query('SELECT COUNT(id) AS data_count FROM unit_faqs WHERE unit_id IN(' + sqr_part2 + ');', function (err, count) {

                    if (err) {

                      res.send(200, JSON.stringify({msg: "Something wrong"}));

                    }
                    else {
                      res.send(200, count)

                    }

                  });


                }

              }


            });


          }

        }


      });


    }


  },
  getFaqData: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var page_id = req.body.page_id ? req.body.page_id : false;
    var sec_id = req.body.sec_type ? req.body.sec_type : false;
    var pageLimit = 5;
    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);

    }

    if (auth && page_id) {
      Unit.query('SELECT	DISTINCT(module_id) FROM	package_subject_module WHERE	package_subject_id IN( SELECT id FROM	package_subject WHERE	selection_list_id =' + sec_id + ');', function (err, data) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          if (data.length != 0) {

            var module_data = [];
            var i = 0;
            for (var j = 0; j < data.length; j++) {
              module_data[i] = data[j]['module_id'];
              i++;
            }
            var sqr_part1 = data.length != 1 ? (module_data.join()) : data[0]['module_id'];

            Unit.query('SELECT U.id as unit_id FROM `unit` U, module M WHERE M.id = U. `module_id` AND M.id IN (' + sqr_part1 + ');', function (err, udata) {

              if (err) {

                res.send(200, JSON.stringify({msg: "Something wrong"}));

              }

              if (udata) {

                if (data.length != 0) {

                  var unit_data = [];
                  var k = 0;
                  for (var l = 0; l < udata.length; l++) {
                    unit_data[k] = udata[l]['unit_id'];
                    k++;
                  }
                  var sqr_part2 = udata.length != 1 ? (unit_data.join()) : udata[0]['unit_id'];
                  Unit.query('SELECT u.name, uf.id, uf.faq, uf.faq_answer, uf.created_date ' +
                    'FROM unit u ' +
                    'INNER JOIN unit_faqs uf ' +
                    'ON u.id=uf.unit_id ' +
                    'WHERE u.id IN(' + sqr_part2 + ') ' +
                    'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, faqdata) {

                    if (err) {

                      console.log(err);

                      res.send(200, JSON.stringify({msg: "Something wrong"}));

                    }

                    else {
                      if (faqdata.length > 0) {
                        res.send(200, JSON.stringify({faq: faqdata}));
                      } else {
                        res.send(200, JSON.stringify({faq: []}));
                      }
                    }

                  });


                }

              }


            });


          }

        }


      });


    }


  },
  getGlossaryCount: function (req, res) {

    var sec_id = req.body.sec_type ? req.body.sec_type : false;
    if (sec_id) {
      Module.query('SELECT	DISTINCT(module_id) FROM	package_subject_module WHERE	package_subject_id IN( SELECT id FROM	package_subject WHERE	selection_list_id =' + sec_id + ');', function (err, data) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          if (data.length != 0) {

            var module_data = [];
            var i = 0;
            for (var j = 0; j < data.length; j++) {
              module_data[i] = data[j]['module_id'];
              i++;
            }
            var sqr_part1 = data.length != 1 ? (module_data.join()) : data[0]['module_id'];

            Module.query('SELECT U.id as unit_id FROM `unit` U, module M WHERE M.id = U. `module_id` AND M.id IN (' + sqr_part1 + ');', function (err, udata) {

              if (err) {

                res.send(200, JSON.stringify({msg: "Something wrong"}));

              }

              if (udata) {

                if (data.length != 0) {

                  var unit_data = [];
                  var k = 0;
                  for (var l = 0; l < udata.length; l++) {
                    unit_data[k] = udata[l]['unit_id'];
                    k++;
                  }
                  var sqr_part2 = udata.length != 1 ? (unit_data.join()) : udata[0]['unit_id'];
                  Module.query('SELECT COUNT(id) AS data_count FROM unit_glossary WHERE unit_id IN(' + sqr_part2 + ');', function (err, count) {

                    if (err) {

                      res.send(200, JSON.stringify({msg: "Something wrong"}));

                    }
                    else {
                      res.send(200, count)

                    }

                  });


                }

              }


            });


          }

        }


      });


    }


  },
  getGlossaryData: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var page_id = req.body.page_id ? req.body.page_id : false;
    var sec_id = req.body.sec_type ? req.body.sec_type : false;
    var pageLimit = 5;
    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);

    }

    if (auth && page_id) {
      Unit.query('SELECT	DISTINCT(module_id) FROM	package_subject_module WHERE	package_subject_id IN( SELECT id FROM	package_subject WHERE	selection_list_id =' + sec_id + ');', function (err, data) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          if (data.length != 0) {

            var module_data = [];
            var i = 0;
            for (var j = 0; j < data.length; j++) {
              module_data[i] = data[j]['module_id'];
              i++;
            }
            var sqr_part1 = data.length != 1 ? (module_data.join()) : data[0]['module_id'];

            Unit.query('SELECT U.id as unit_id FROM `unit` U, module M WHERE M.id = U. `module_id` AND M.id IN (' + sqr_part1 + ');', function (err, udata) {

              if (err) {

                res.send(200, JSON.stringify({msg: "Something wrong"}));

              }

              if (udata) {

                if (data.length != 0) {

                  var unit_data = [];
                  var k = 0;
                  for (var l = 0; l < udata.length; l++) {
                    unit_data[k] = udata[l]['unit_id'];
                    k++;
                  }
                  var sqr_part2 = udata.length != 1 ? (unit_data.join()) : udata[0]['unit_id'];
                  Unit.query('SELECT u.name, ug.id, ug.glossary_word, ug.glossary_mean, ug.created_date ' +
                    'FROM unit u ' +
                    'INNER JOIN unit_glossary ug ' +
                    'ON u.id=ug.unit_id ' +
                    'WHERE u.id IN(' + sqr_part2 + ') ' +
                    'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, glossarydata) {

                    if (err) {

                      res.send(200, JSON.stringify({msg: "Something wrong"}));

                    }

                    else {
                      if (glossarydata.length > 0) {
                        res.send(200, JSON.stringify({gloss: glossarydata}));
                      } else {
                        res.send(200, JSON.stringify({gloss: []}));
                      }
                    }

                  });


                }

              }


            });


          }

        }


      });


    }


  },
  faqDelete: function (req, res) {
    var faqId = req.body.faqId ? req.body.faqId : false;
    if (faqId) {

      Unit.query('DELETE FROM unit_faqs WHERE id=' + faqId + ';', function (err, msg) {
        if (err) {
          // console.log(err);
          res.send(200, JSON.stringify({msg: "error"}));
        }
        if (msg) {

          if (msg['affectedRows'] > 0) {

            res.send(200, JSON.stringify({msg: 'Success'}));

          }


        }


      });


    }

  },
  GlossaryDelete: function (req, res) {
    var glossId = req.body.glossId ? req.body.glossId : false;
    if (glossId) {

      Unit.query('DELETE FROM unit_glossary WHERE id=' + glossId + ';', function (err, msg) {
        if (err) {
          // console.log(err);
          res.send(200, JSON.stringify({msg: "error"}));
        }
        if (msg) {

          if (msg['affectedRows'] > 0) {

            res.send(200, JSON.stringify({msg: 'Success'}));

          }


        }


      });


    }

  },
  addFaqImage: function (req, res) {
  var d = new Date();
  var filename = d.getTime() + ".png"
  req.file('upload').upload({
    maxBytes: 100000000,
    dirname: cross_path.resolve(sails.config.appPath,cross_path.normalize('uploads\\faq')),
    saveAs: filename,
  }, function (err, uploadedFiles) {
    if (err) return res.negotiate(err);
    if (uploadedFiles) {
      res.send(200, JSON.stringify({filename: filename}));
    }
  });

},
  unitFaqImageView: function (req, res) {

    var file = req.param('src');
    var root = cross_path.resolve(sails.config.appPath, cross_path.normalize('uploads\\faq'));
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
  addGlossImage: function (req, res) {
    var d = new Date();
    var filename = d.getTime() + ".png"
    req.file('upload').upload({
      maxBytes: 100000000,
      dirname: cross_path.resolve(sails.config.appPath,cross_path.normalize('uploads\\gloss')),
      saveAs: filename,
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err);
      if (uploadedFiles) {
        res.send(200, JSON.stringify({filename: filename}));
      }
    });

  },
  unitGlossImageView: function (req, res) {

    var file = req.param('src');
    var root = cross_path.resolve(sails.config.appPath, cross_path.normalize('uploads\\gloss'));
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

};
