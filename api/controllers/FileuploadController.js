var multer = require("multer");


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
        Module.query('SELECT name FROM `selection_list` WHERE id=' + sec_type + ';', function (err, sec) {
          if (err) {
            return res.view('404');
          }
          if (sec) {
            Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, md) {

              if (err) {
                return res.view('404');
              }
              if (md) {

                Module.query('SELECT  `id` FROM	package_subject WHERE	`selection_list_id` =' + sec_type + ';', function (err, ps) {
                  if (err) {
                    return res.view('404');
                  }
                  if (ps.length != 0) {

                    var ps_data = [];
                    var o = 0;
                    for (var p = 0; p < ps.length; p++) {
                      ps_data[o] = ps[p]['id'];
                      o++;
                    }
                    var sqr_part3 = ps.length != 1 ? (ps_data.join()) : ps[0]['id'];
                    //console.log(sqr_part3);

                    Module.query('SELECT DISTINCT(`module_id`) FROM	package_subject_module WHERE	package_subject_id IN(' + sqr_part3 + ');', function (err, module) {
                      if (err) {
                        return res.view('404');
                      } else {

                        if (module.length != 0) {
                          var mo_data = [];
                          var m = 0;
                          for (var n = 0; n < module.length; n++) {
                            mo_data[m] = module[n]['module_id'];
                            m++;
                          }
                          var sqr_part2 = module.length != 1 ? (mo_data.join()) : module[0]['module_id'];
                          // console.log(sqr_part2);

                          Module.query('SELECT DISTINCT(U.`id`) as unitID FROM `unit` U, module M ' +
                            'WHERE M.id = U. `module_id` AND M.id IN (' + sqr_part2 + ');',
                            function (err, unit) {
                              if (err) {
                                // console.log(err);
                                //  return res.view('404');
                              } else {
                                if (unit.length != 0) {
                                  var u_data = [];
                                  var j = 0;
                                  for (var i = 0; i < unit.length; i++) {
                                    u_data[j] = unit[i]['unitID'];
                                    j++;
                                  }

                                  var sqr_part = unit.length != 1 ? (u_data.join()) : unit[0]['unitID'];
                                  Module.query('SELECT * FROM unit_resources ' +
                                    'WHERE unit_id in (' + sqr_part + ');',
                                    function (err, resource) {
                                      if (err) {
                                        return res.view('404');

                                      } else {
                                        //  console.log(resource);

                                        if (resource.length != 0) {
                                          var r_data = [];
                                          var l = 0;
                                          for (var k = 0; k < resource.length; k++) {
                                            r_data[l] = resource[k]['resource_id'];
                                            l++;
                                          }

                                          var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
                                          Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                                            'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                                            'R.`heading_id`,RH.name AS h_type, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                                            'FROM `resources` R ,`resource_types` RTT ,headings RH ' +
                                            'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND R.`id` IN(' + sqr_part1 + ');',
                                            function (err, data) {

                                              var module_array = [];
                                              module_array = md;
                                              module_array.splice(0, 1);
                                              module_array.splice((module_array.length - 1), 1);

                                              if (err) {
                                                return res.view('404');

                                              } else {
                                                return res.view('resource/index', {
                                                  role: role0,
                                                  name: name0,
                                                  auth: key,
                                                  section: sec,
                                                  module: module_array[0],
                                                  data: data,

                                                });
                                              }
                                            });

                                        } else {
                                          return res.view('resource/index', {
                                            role: role0,
                                            name: name0,
                                            auth: key,
                                            section: sec,
                                            module: module_array[0],
                                            data: false
                                          });
                                        }

                                      }
                                    });

                                } else {
                                  return res.view('resource/index', {
                                    role: role0,
                                    name: name0,
                                    auth: key,
                                    data: false
                                  });
                                }
                              }
                            });

                        } else {

                          return res.view('resource/index', {
                            role: role0,
                            name: name0,
                            auth: key,
                            data: false
                          });


                        }

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
      return res.redirect("/login");
    }
  },
  loadnewinterface: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var tutor_sec = dataSet.sec0 ? dataSet.sec0 : false;

      if (auth && auth1) {

        if (tutor_sec) {
          Module.query('SELECT name FROM `selection_list` WHERE id=' + tutor_sec + ';', function (err, sec) {
            if (err) {
              return res.view('404');
            }
            if (sec) {
              Module.query('SET @p0 =' + tutor_sec + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
                if (err) {
                  return res.view('404');
                }
                if (module) {

                  if (module.length > 0) {
                    Module.query('SELECT id,name FROM resource_types WHERE id NOT IN(7,8)', function (err, resources) {
                      if (err) {

                        return res.view('404');
                      } else {
                        Module.query('SELECT id,name FROM headings', function (err, headings) {
                          if (err) {

                            return res.view('404');
                          } else {
                            Module.query('SELECT id,name FROM tags', function (err, tags) {
                              if (err) {

                                return res.view('404');
                              } else {
                                //console.log(module);
                                var module_array = [];
                                module_array = module;
                                module_array.splice(0, 1);
                                module_array.splice((module_array.length - 1), 1);
                                //console.log(module_array);


                                if (sec.length > 0 && module_array.length > 0) {
                                  return res.view('resource/add', {
                                    role: role0,
                                    name: name0,
                                    section: sec,
                                    auth: key,
                                    module: module_array[0],
                                    resource: resources,
                                    head: headings,
                                    tag: tags
                                  });

                                } else {
                                  return res.view('resource/add', {
                                    role: role0,
                                    name: name0,
                                    auth: key,
                                    section: [{name: "Cannot Upload(No Modules)"}],
                                    module: [{id: "", name: "Cannot Upload (No Modules)"}],
                                    resource: resources,
                                    head: headings,
                                    tag: tags
                                  });

                                }


                                //res.send(JSON.stringify(packages));
                              }
                            });
                            //res.send(JSON.stringify(packages));
                          }
                        });

                        //res.send(JSON.stringify(packages));
                      }
                    });


                  } else {


                    Module.query('SELECT id,name FROM resource_types', function (err, resources) {
                      if (err) {
                        //res.send(err);
                        // res.send(401,JSON.stringify({msg:"Something wrong"}));
                        return res.view('404');
                      } else {
                        Module.query('SELECT id,name FROM headings', function (err, headings) {
                          if (err) {
                            //res.send(err);
                            // res.send(401,JSON.stringify({msg:"Something wrong"}));
                            return res.view('404');
                          } else {
                            Module.query('SELECT id,name FROM tags', function (err, tags) {
                              if (err) {
                                //res.send(err);
                                //  res.send(401,JSON.stringify({msg:"Something wrong"}));
                                return res.view('404');
                              } else {

                                return res.view('resource/add', {
                                  role: role0,
                                  name: name0,
                                  auth: key,
                                  section: [{name: "Cannot Upload(No Modules)"}],
                                  module: [{id: "", name: "Cannot Upload(No Modules)"}],
                                  resource: resources,
                                  head: headings,
                                  tag: tags
                                });


                                //res.send(JSON.stringify(packages));
                              }
                            });
                            //res.send(JSON.stringify(packages));
                          }
                        });

                        //res.send(JSON.stringify(packages));
                      }
                    });


                  }


                }

              });


            }

          });
        } else {

          Module.query('SELECT id,name FROM resource_types', function (err, resources) {
            if (err) {
              //res.send(err);
              // res.send(401,JSON.stringify({msg:"Something wrong"}));
              return res.view('404');
            } else {
              Module.query('SELECT id,name FROM headings', function (err, headings) {
                if (err) {
                  //res.send(err);
                  // res.send(401,JSON.stringify({msg:"Something wrong"}));
                  return res.view('404');
                } else {
                  Module.query('SELECT id,name FROM tags', function (err, tags) {
                    if (err) {
                      //res.send(err);
                      //  res.send(401,JSON.stringify({msg:"Something wrong"}));
                      return res.view('404');
                    } else {

                      return res.view('resource/add', {
                        role: role0,
                        name: name0,
                        auth: key,
                        section: [{name: "Cannot Upload(No Modules)"}],
                        module: [{id: "", name: "Cannot Upload(No Modules)"}],
                        resource: resources,
                        head: headings,
                        tag: tags
                      });


                      //res.send(JSON.stringify(packages));
                    }
                  });
                  //res.send(JSON.stringify(packages));
                }
              });

              //res.send(JSON.stringify(packages));
            }
          });


        }

      }
    } else {
      return res.redirect("/login");
    }
  },
  loadgrades: function (res, req) {

    Module.query('SELECT id,grade FROM grade', function (err, grades) {
      if (err) {
        //res.send(err);
        // res.send(401,JSON.stringify({msg:"Something wrong"}));
        return res.view('404');
      } else {
        res.send(200, grades);
      }
    });


  },
  loadpackage: function (req, res) {
    var gval = req.body.gval ? req.body.gval : false;
    var c_type = req.body.c_type ? req.body.c_type : false;
    if (gval && c_type) {
      Module.query('SET @p0=' + gval + '; SET @p1=' + c_type + '; CALL `spGetPackage`(@p0, @p1);', function (err, subjects) {
        if (err) {
          //console.log(err)
          // res.send(err);
          // res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }
        if (subjects) {

          // console.log(subjects);

          var array = [];
          array = subjects;
          array.splice(0, 1);
          array.splice(0, 1);
          array.splice((array.length - 1), 1);


          // console.log(array['0']);
          res.send(200, array);
        }
      });

    }

  },
  loadmodule: function (req, res) {

    var cp_type = req.body.cp_type ? req.body.cp_type : false;
    var ms_type = req.body.ms_type ? req.body.ms_type : false;

    if (cp_type && ms_type) {
      Module.query('SET @p0=' + cp_type + '; SET @p1=' + ms_type + '; CALL `spGetModule`(@p0, @p1);', function (err, modules) {
        if (err) {
          //console.log(err)
          //res.send(err);
          // res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }
        if (modules) {

          //console.log(modules);

          var array = [];
          array = modules;
          array.splice(0, 1);
          array.splice(0, 1);
          array.splice((array.length - 1), 1);

          // console.log(array);
          res.send(200, array);

          /* var array = [];
           array = subjects;
           array.splice(0, 1);
           array.splice(0, 1);
           array.splice((array.length - 1), 1);



           res.send(200, array);*/
        }
      });

    }

  },
  loadunit: function (req, res) {

    var m_type = req.body.m_type ? req.body.m_type : false;

    if (m_type) {
      Module.query('SET @p0=' + m_type + '; CALL `spGetUnit`(@p0);', function (err, units) {
        if (err) {
          //console.log(err)
          //res.send(err);
          // res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }
        if (units) {

          //console.log(units);

          var array = [];
          array = units;
          array.splice(0, 1);
          array.splice((array.length - 1), 1);

          // console.log(array);
          res.send(200, array);

        }
      });

    }
  },
  addtag: function (req, res) {

    var tag = req.body.newtag ? req.body.newtag : false;
    if (tag) {
      Module.query('SET @p0="' + tag + '"; CALL `spInsertTags`(@p0, @p1); SELECT @p0 AS `tname`, @p1 AS `st`;', function (err, tag) {
        if (err) {
          //console.log(err)
          // res.send(err);
          //  res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }
        if (tag) {

          // console.log(tag);

          res.send(200, JSON.stringify(tag['2']));

        }
      });

    }


  },
  addhead: function (req, res) {

    var head = req.body.newhead ? req.body.newhead : false;
    if (head) {
      Module.query('SET @p0="' + head + '"; CALL `spInsertHeading`(@p0, @p1); SELECT @p0 AS `hname`, @p1 AS `st`', function (err, head) {
        if (err) {
          //console.log(err)
          //res.send(err);
          // res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }
        if (head) {

          //console.log(JSON.stringify(head['2']));
          res.send(200, JSON.stringify(head['2']));

        }
      });

    }


  },
  upload: function (req, res) {
    // console.log(req.body);


  },
  loadModuleSec: function (req, res) {
    var sec_type = req.body.sec_type ? req.body.sec_type : false;
    if (sec_type) {
      Module.query('SET @p0=' + sec_type + '; CALL `spGetModulesFromSelectionList`(@p0);', function (err, modules) {
        if (err) {
          //console.log(err)
          // res.send(401,JSON.stringify({msg:"Something wrong"}));
          return res.view('404');
        }
        if (modules) {


          var array = [];
          array = modules;
          array.splice(0, 1);
          array.splice((array.length - 1), 1);
          res.send(200, array);
        }
      });

    }

  },
  confirmDataInterface: function (req, res) {


    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;

      if (auth && auth1) {
        Module.query('SELECT id,name FROM selection_list;', function (err, secData) {

          if (err) {
            return res.view('404');

          }

          if (secData) {
            return res.view('resource/confirm', {
              role: role0,
              name: name0,
              auth: key,
              section: secData,
            });

          }


        });

      }
    } else {
      return res.redirect("/login");
    }


  },
  confirmDataShow: function (req, res) {

    var resource_id = req.body.resource_id ? req.body.resource_id : false;

    if (resource_id) {
      Module.query('SELECT id,name FROM selection_list;', function (err, secData) {

        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }

        if (secData) {
          Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
            'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
            'R.`heading_id`,RH.name AS h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
            'FROM `resources` R, resource_types RTT, headings RH ' +
            'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND R.resource_type_id=' + resource_id + ' AND R.confirm=0 ORDER BY R.id',
            function (err, data) {

              if (err) {


                res.send(200, JSON.stringify({msg: "Something wrong"}));


              } else {

                if (data.length != 0) {

                  res.send(200, data);

                } else {

                  res.send(200, []);


                }


              }

            });

        }


      });


    } else {
      return res.redirect("/login");
    }


  },
  unitResource: function (req, res) {

    var unit = req.body.u_type ? req.body.u_type : false;
    // var r_type = req.body.r_type ? req.body.r_type : false;
    if (unit) {
      Module.query('SELECT * FROM unit_resources ' +
        'WHERE unit_id in (' + unit + ');',
        function (err, resource) {
          if (err) {
            return res.view('404');

          } else {

            if (resource.length != 0) {
              var r_data = [];
              var l = 0;
              for (var k = 0; k < resource.length; k++) {
                r_data[l] = resource[k]['resource_id'];
                l++;
              }

              var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];

              Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                'R.`heading_id`,RH.name as h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                'FROM `resources` R ,`resource_types` RTT , headings RH  ' +
                'WHERE RTT. id = R.resource_type_id AND RH.id = R.heading_id  AND R.confirm=0 AND  R.`id` IN(' + sqr_part1 + ');',


                function (err, data) {

                  if (err) {
                    return res.view('404');

                  } else {
                    //console.log(data);
                    res.send(200, JSON.stringify({data: data}));
                  }
                });

            } else {
              res.send(200, JSON.stringify({data: []}));
            }


          }


        });


    }

  },
  tutorUnitResource: function (req, res) {

    var unit = req.body.u_type ? req.body.u_type : false;
    var sec_type = req.body.sec_id ? req.body.sec_id : false;

    if (unit) {
      Module.query('SELECT * FROM unit_resources ' +
        'WHERE unit_id in (' + unit + ');',
        function (err, resource) {
          if (err) {
            return res.view('404');

          } else {

            if (resource.length != 0) {
              var r_data = [];
              var l = 0;
              for (var k = 0; k < resource.length; k++) {
                r_data[l] = resource[k]['resource_id'];
                l++;
              }

              var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
              Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                'R.`heading_id`,RH.name AS h_type, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                'FROM `resources` R ,`resource_types` RTT ,headings RH ' +
                'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND R.`id` IN(' + sqr_part1 + ');',


                function (err, data) {

                  if (err) {
                    return res.view('404');

                  } else {
                    //console.log(data);
                    res.send(200, JSON.stringify({data: data}));
                  }
                });

            } else {
              res.send(200, JSON.stringify({data: []}));
            }


          }


        });


    }
    else {

      Module.query('SET @p0 =' + sec_type + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, md) {

        if (err) {
          return res.view('404');
        }
        if (md) {

          Module.query('SELECT  `id` FROM	package_subject WHERE	`selection_list_id` =' + sec_type + ';', function (err, ps) {
            if (err) {
              return res.view('404');
            }
            if (ps.length != 0) {

              var ps_data = [];
              var o = 0;
              for (var p = 0; p < ps.length; p++) {
                ps_data[o] = ps[p]['id'];
                o++;
              }
              var sqr_part3 = ps.length != 1 ? (ps_data.join()) : ps[0]['id'];
              //console.log(sqr_part3);

              Module.query('SELECT DISTINCT(`module_id`) FROM	package_subject_module WHERE	package_subject_id IN(' + sqr_part3 + ');', function (err, module) {
                if (err) {
                  return res.view('404');
                } else {

                  if (module.length != 0) {
                    var mo_data = [];
                    var m = 0;
                    for (var n = 0; n < module.length; n++) {
                      mo_data[m] = module[n]['module_id'];
                      m++;
                    }
                    var sqr_part2 = module.length != 1 ? (mo_data.join()) : module[0]['module_id'];


                    Module.query('SELECT DISTINCT(U.`id`) as unitID FROM `unit` U, module M ' +
                      'WHERE M.id = U. `module_id` AND M.id IN (' + sqr_part2 + ');',
                      function (err, unit) {
                        if (err) {

                        } else {
                          if (unit.length != 0) {
                            var u_data = [];
                            var j = 0;
                            for (var i = 0; i < unit.length; i++) {
                              u_data[j] = unit[i]['unitID'];
                              j++;
                            }

                            var sqr_part = unit.length != 1 ? (u_data.join()) : unit[0]['unitID'];
                            Module.query('SELECT * FROM unit_resources ' +
                              'WHERE unit_id in (' + sqr_part + ');',
                              function (err, resource) {
                                if (err) {

                                } else {


                                  if (resource.length != 0) {
                                    var r_data = [];
                                    var l = 0;
                                    for (var k = 0; k < resource.length; k++) {
                                      r_data[l] = resource[k]['resource_id'];
                                      l++;
                                    }

                                    var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
                                    Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                                      'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                                      'R.`heading_id`,RH.name AS h_type, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                                      'FROM `resources` R ,`resource_types` RTT ,headings RH ' +
                                      'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND R.`id` IN(' + sqr_part1 + ');',
                                      function (err, data) {

                                        if (err) {
                                          return res.view('404');

                                        } else {

                                          res.send(200, JSON.stringify({data: data}));

                                        }
                                      });

                                  } else {

                                    res.send(200, JSON.stringify({data: []}));

                                  }

                                }
                              });

                          } else {

                            res.send(200, JSON.stringify({data: []}));

                          }
                        }
                      });

                  } else {

                    res.send(200, JSON.stringify({data: []}));



                  }

                }
              });

            }
          });
        }


      });
    }


  },
  addTutorChallenge: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var tutor_sec = dataSet.sec0 ? dataSet.sec0 : false;

      if (auth && auth1) {

        if (tutor_sec) {
          Module.query('SELECT name FROM `selection_list` WHERE id=' + tutor_sec + ';', function (err, sec) {
            if (err) {
              return res.view('404');
            }
            if (sec) {
              Module.query('SET @p0 =' + tutor_sec + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, module) {
                if (err) {
                  return res.view('404');
                }
                if (module) {

                  if (module.length > 0) {
                    Module.query('SELECT id,name FROM resource_types WHERE id NOT IN(7)', function (err, resources) {
                      if (err) {

                        return res.view('404');
                      } else {
                        var module_array = [];
                        module_array = module;
                        module_array.splice(0, 1);
                        module_array.splice((module_array.length - 1), 1);
                        //console.log(module_array);


                        if (sec.length > 0 && module_array.length > 0) {
                          return res.view('resource/tutor_challenge', {
                            role: role0,
                            name: name0,
                            section: sec,
                            auth: key,
                            module: module_array[0],
                            resource: resources,
                          });

                        } else {
                          return res.view('resource/tutor_challenge', {
                            role: role0,
                            name: name0,
                            auth: key,
                            section: [{name: "Cannot Upload(No Modules)"}],
                            module: [{id: "", name: "Cannot Upload (No Modules)"}],
                            resource: resources,

                          });

                        }
                      }
                    });


                  } else {


                    Module.query('SELECT id,name FROM resource_types', function (err, resources) {
                      if (err) {
                        //res.send(err);
                        // res.send(401,JSON.stringify({msg:"Something wrong"}));
                        return res.view('404');
                      } else {
                        Module.query('SELECT id,name FROM headings', function (err, headings) {
                          if (err) {
                            //res.send(err);
                            // res.send(401,JSON.stringify({msg:"Something wrong"}));
                            return res.view('404');
                          } else {
                            Module.query('SELECT id,name FROM tags', function (err, tags) {
                              if (err) {
                                //res.send(err);
                                //  res.send(401,JSON.stringify({msg:"Something wrong"}));
                                return res.view('404');
                              } else {

                                return res.view('resource/add', {
                                  role: role0,
                                  name: name0,
                                  auth: key,
                                  section: [{name: "Cannot Upload(No Modules)"}],
                                  module: [{id: "", name: "Cannot Upload(No Modules)"}],
                                  resource: resources,
                                  head: headings,
                                  tag: tags
                                });


                                //res.send(JSON.stringify(packages));
                              }
                            });
                            //res.send(JSON.stringify(packages));
                          }
                        });

                        //res.send(JSON.stringify(packages));
                      }
                    });


                  }


                }

              });


            }

          });
        } else {

          Module.query('SELECT id,name FROM resource_types', function (err, resources) {
            if (err) {
              //res.send(err);
              // res.send(401,JSON.stringify({msg:"Something wrong"}));
              return res.view('404');
            } else {
              Module.query('SELECT id,name FROM headings', function (err, headings) {
                if (err) {
                  //res.send(err);
                  // res.send(401,JSON.stringify({msg:"Something wrong"}));
                  return res.view('404');
                } else {
                  Module.query('SELECT id,name FROM tags', function (err, tags) {
                    if (err) {
                      //res.send(err);
                      //  res.send(401,JSON.stringify({msg:"Something wrong"}));
                      return res.view('404');
                    } else {

                      return res.view('resource/add', {
                        role: role0,
                        name: name0,
                        auth: key,
                        section: [{name: "Cannot Upload(No Modules)"}],
                        module: [{id: "", name: "Cannot Upload(No Modules)"}],
                        resource: resources,
                        head: headings,
                        tag: tags
                      });


                      //res.send(JSON.stringify(packages));
                    }
                  });
                  //res.send(JSON.stringify(packages));
                }
              });

              //res.send(JSON.stringify(packages));
            }
          });


        }

      }
    } else {
      return res.redirect("/login");
    }
  },
  addTutorChallengeData: function (req, res) {

    var tu_ch_ques = req.body.tu_ch_ques ? req.body.tu_ch_ques : false;
    var tu_ch_answer = req.body.tu_ch_answer ? req.body.tu_ch_answer : false;
    var tu_id = req.body.tu_id ? req.body.tu_id : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var status = "INACTIVE";
    var tu_ch_unit_id = req.body.u_id ? req.body.u_id : false;
    var st_limit = req.body.st_limit ? req.body.st_limit : false;
    var an_word_count = req.body.word_count ? req.body.word_count : false;
    var current_st_count = 0;
    var admin_confirmation = 0;
    var tu_challange_re_id = [];
    var tu_challange_re_id = req.body.file_id ? req.body.file_id : [];
    var tu_challange_type_id = [];
    var tu_challange_type_id = req.body.type_id ? req.body.type_id : [];
    var tu_challange_re_name = []
    var tu_challange_re_name = req.body.file_name ? req.body.file_name : [];
    var completed_requests = 0;

   // var st_date  = req.body.st_date  ? req.body.st_date : false;
    //var end_date = req.body.end_date ? req.body.end_date : false;
   
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

    if (tu_ch_ques && tu_ch_answer && tu_id) {
      Module.query("INSERT INTO `tutor_challange_question`(`question`, `answer`, `user_id`, `created_date`, `start_date`, `end_date`, `status`, `unit_id`, `student_limit`, `student_count`, `admin_confirmation`, `answer_word_limit`) " +
        "VALUES ('" + mysql_real_escape_string(tu_ch_ques) + "','" + mysql_real_escape_string(tu_ch_answer) + "'," + tu_id + ",'" + date + "','" + date + "','" + date + "','" + status + "'," + tu_ch_unit_id + "," + st_limit + "," + current_st_count + "," + admin_confirmation + "," + an_word_count + ")", function (err, data) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }
        if (data) {


          if (tu_challange_re_id.length > 0) {

            for (var i = 0; i < tu_challange_re_id.length; i++) {
              Module.query("INSERT INTO `tutor_challange_resource`(`resource_type_id`, `question_id`, `name`, `fileID`, `created_date`, `modified_date`) VALUES (" + tu_challange_type_id[i] + "," + data['insertId'] + ",'" + tu_challange_re_name[i] + "'," + tu_challange_re_id[i] + ",'" + date + "','" + date + "')", function (err, filedata) {
                if (err) {
                  res.send(200, JSON.stringify({msg: "Something wrong"}));

                }
                if (filedata) {

                  completed_requests++;

                  if (completed_requests == (tu_challange_re_id.length)) {

                    res.send(200, JSON.stringify({msg: 'ok'}));

                  }

                }


              });


            }


          }


        }
      });

    }
    else {
      return res.redirect("/login");
    }
  },
  addTutorChallengeResource: function (req, res) {
    var FilePath = {
      resoursces: {
        video: 'upload/files/resources/video/',
        animation: 'upload/files/resources/animation',
        interactive_activities: '../../upload/files/resources/interactive_activites/',
        knowledge_nuget: '../../upload/files/resources/knowledge_nuget/',
        revision_note: '../../upload/files/resources/revision_note/',
        worksheet: '../../upload/files/resources/worksheet/',
        presentation: '../../upload/files/resources/presentation/',
        other: '../../upload/files/resources/other/'
      }
    };
    var hrTime = process.hrtime();
    var crTime = (hrTime[0] * 1000000 + hrTime[1] / 1000);

    /* var extenConvert = function (exten,cb) {


     var file_exten = 0;
     var extention = [
     ["doc", "application/msword"],
     ["dot", "application/msword"],
     ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
     ["dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template"],
     ["docm", "application/vnd.ms-word.document.macroEnabled"],
     ["dotm", "application/vnd.ms-word.template.macroEnabled"],
     ["xls", "application/vnd.ms-excel"],
     ["xlt", "application/vnd.ms-excel"],
     ["xla", "application/vnd.ms-excel"],
     ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
     ["xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template"],
     ["xlsm", "application/vnd.ms-excel.sheet.macroEnabled"],
     ["xltm", "application/vnd.ms-excel.template.macroEnabled"],
     ["xlam", "application/vnd.ms-excel.addin.macroEnabled"],
     ["xlsb", "application/vnd.ms-excel.sheet.binary.macroEnabled"],
     ["ppt", "application/vnd.ms-powerpoint"],
     ["pot", "application/vnd.ms-powerpoint"],
     ["pps", "application/vnd.ms-powerpoint"],
     ["ppa", "application/vnd.ms-powerpoint"],
     ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
     ["potx", "application/vnd.openxmlformats-officedocument.presentationml.template"],
     ["ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"],
     ["ppam", "application/vnd.ms-powerpoint.addin.macroEnabled"],
     ["pptm", "application/vnd.ms-powerpoint.presentation.macroEnabled"],
     ["potm", "application/vnd.ms-powerpoint.template.macroEnabled"],
     ["ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled"],
     ["mdb", "application/vnd.ms-access"],
     ["au", "audio/basic"],
     ["avi", "video/msvideo"],
     ["avi", "video/avi"],
     ["avi", "video/x-msvideo"],
     ["bmp", "image/bmp"],
     ["css", "text/css"],
     ["dtd", "application/xml-dtd"],
     ["exe", "application/x-msdownload"],
     ["gif", "image/gif"],
     ["html", "text/html"],
     ["jpg", "image/jpeg"],
     ["midi", "audio/x-midi"],
     ["mp3", "audio/mpeg"],
     ["mpeg", "video/mpeg"],
     ["pdf", "application/pdf"],
     ["png", "image/png"],
     ["qt", "video/quicktime"],
     ["ra", "audio/x-pn-realaudio"],
     ["ra", "audio/vnd.rn-realaudio"],
     ["ram", "audio/x-pn-realaudio"],
     ["ram", "audio/vnd.rn-realaudio"],
     ["svg", "image/svg+xml"],
     ["swf", "application/x-shockwave-flash"],
     ["tar.gz", "`application/x-tar"],
     ["tgz", "application/x-tar"],
     ["txt", "text/plain"],
     ["wav", "audio/wav"],
     ["wav", "audio/x-wav"],
     ["zip", "application/zip"],
     ["zip", "application/x-compressed-zip"],
     ["zip", "application/octet-stream"]
     ];

     for (var i = 0; i < extention.length; i++) {

     if (exten == extention[i][1]) {
     file_exten = extention[i][0];
     break;
     }

     }

     if (file_exten == 0) {
     console.log(exten);
     var temp = exten.split("/");
     file_exten = temp[1];
     }
     cb (undefined,file_exten);
     }

     extenConvert(req.file('upload').mimeType,function (err, data) {

     if(data=='avi')
     req.file('upload').upload({
     dirname: require('path').resolve(sails.config.appPath, FilePath.resoursces.video),
     saveAs: Math.round(crTime)+ ".avi",
     }, function (err, uploadedFiles) {
     if (err) return res.negotiate(err);
     if (uploadedFiles) {
     console.log("Done")
     }
     });
     });*/

    var allowedDir = "upload/files/resources/video/";

    req.file("file").upload({
      maxBytes: 200000000,
      dirname: require('path').resolve(sails.config.appPath, allowedDir),
      saveAs: function (file, cb) {
        var d = new Date();
        var extension = file.filename.split('.').pop();
        // generating unique filename with extension
        var uuid = md5(d.getMilliseconds()) + "." + extension;

        // save as allowed files
        cb(null, "/" + uuid);

      }
    }, function whenDone(err, files) {
      return res.json({
        status: 200,
        message: 'Successfully uploaded'
      });
    });
  },
  loadAllTutorChallenge: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {

        return res.view('resource/tutor_challenge_view', {
          role: role0,
          name: name0,
          auth: key,
        });


      }

    } else {
      return res.redirect("/login");
    }
  },
  confirmResource: function (req, res) {

    var resource_id = req.body.resource_id ? req.body.resource_id : false;


    if (resource_id) {
      Module.query('UPDATE `resources` SET `confirm`=1 WHERE `id`=' + resource_id + ';', function (err, data) {
        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }

        if (data) {

          if (data['affectedRows'] > 0) {

            res.send(200, JSON.stringify({msg: "updated"}));
          }

        }

      })


    } else {
      return res.redirect("/login");
    }
  },
  confirmAllResourceByType: function (req, res) {

    var type_id = req.body.type_id ? req.body.type_id : false;
    var st = 1;


    if (type_id) {


      Module.query('SELECT `id` FROM `resources` WHERE `resource_type_id`=' + type_id + ' AND `confirm`=0;', function (err, data) {
        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));
        }

        if (data) {

          if (data.length > 0) {

            var count = 0;
            for (var i = 0; i < data.length; i++) {
              Module.query('UPDATE `resources` SET `confirm`=1 WHERE `id`=' + data[i]['id'] + ';', function (err, res_data) {
                if (err) {
                  count++;
                  if (count == data.length) {
                    res.send(200, JSON.stringify({msg: "Something wrong"}));
                  }

                }

                if (res_data) {
                  count++;
                  if (count == data.length) {
                    res.send(200, JSON.stringify({msg: "updated"}));
                  }
                }


              })

            }


          }

        }

      })


    } else {
      return res.redirect("/login");
    }
  },
  getResDataCount: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var type_id = req.body.r_type ? req.body.r_type : false;
    var unit_id = req.body.unit_id ? req.body.unit_id : "";

    if (auth) {
      if (unit_id == "") {
        Module.query('SELECT COUNT(id) AS data_count FROM resources WHERE resource_type_id=' + type_id + ' AND  confirm=0;', function (err, data) {

          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));

          }

          if (data) {

            res.send(200, data);
          }


        });

      }
      else {

        Module.query('SELECT * FROM unit_resources WHERE unit_id in (' + unit_id + ');', function (err, resource) {
          if (err) {
            return res.view('404');

          } else {

            if (resource.length != 0) {
              var r_data = [];
              var l = 0;
              for (var k = 0; k < resource.length; k++) {
                r_data[l] = resource[k]['resource_id'];
                l++;
              }

              var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
              Module.query('SELECT COUNT(id) AS data_count FROM resources WHERE resource_type_id=' + type_id + ' AND  confirm=0 AND  id IN(' + sqr_part1 + ');', function (err, data) {

                if (err) {

                  res.send(200, JSON.stringify({msg: "Something wrong"}));

                }

                if (data) {

                  res.send(200, data);
                }


              });


            }

            else {


            }
          }


        });


      }


    }


  },
  getResData: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var page_id = req.body.page_id ? req.body.page_id : false;
    var type_id = req.body.r_type ? req.body.r_type : false;
    var unit_id = req.body.unit_id ? req.body.unit_id : "";
    var pageLimit = 5;


    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);

    }

    if (auth) {
      if (unit_id == "") {

        Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
          'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
          'R.`heading_id`,RH.name AS h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
          'FROM `resources` R, resource_types RTT, headings RH ' +
          'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
          'R.resource_type_id=' + type_id + ' AND R.confirm=0 ORDER BY R.id ' +
          'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, data) {

          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));

          }

          if (data) {

            res.send(200, data);
          }


        });
      }
      else {

        Module.query('SELECT * FROM unit_resources WHERE unit_id in (' + unit_id + ');', function (err, resource) {
          if (err) {
            return res.view('404');

          } else {

            if (resource.length != 0) {
              var r_data = [];
              var l = 0;
              for (var k = 0; k < resource.length; k++) {
                r_data[l] = resource[k]['resource_id'];
                l++;
              }

              var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
              Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                'R.`heading_id`,RH.name AS h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                'FROM `resources` R, resource_types RTT, headings RH ' +
                'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
                'R.resource_type_id=' + type_id + ' AND R.confirm=0 AND R.id IN(' + sqr_part1 + ') ORDER BY R.id ' +
                'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, data) {

                if (err) {

                  res.send(200, JSON.stringify({msg: "Something wrong"}));

                }

                if (data) {

                  res.send(200, data);
                }


              });

            }

            else {


            }
          }


        });


      }


    }


  },
  getTuChDataCount: function (req, res) {

    var key = req.body.token ? req.body.token : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (id) {
        Module.query('SELECT COUNT(id) AS data_count FROM tutor_challange_question WHERE status="INACTIVE" AND admin_confirmation=0 ;', function (err, data) {

          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));

          }

          if (data) {

            res.send(200, data);
          }


        });


      }

    }


  },
  getTuChData: function (req, res) {

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
      Module.query('SELECT tch.id,u.name,tch.created_date,tch.unit_id,tch.student_limit,tch.answer_word_limit ' +
        'FROM tutor_challange_question AS tch ' +
        'JOIN unit AS u ON tch.unit_id=u.id ' +
        'WHERE tch.`admin_confirmation`=0 ' +
        'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, data) {

        if (err) {

          console.log(err);

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          if (data.length > 0) {
            res.send(200, JSON.stringify({tu_challenge: data}));
          } else {
            res.send(200, JSON.stringify({tu_challenge: []}));
          }
        }


      });


    }


  },
  loadTutorChallengeActive: function (req, res) {


    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;

      if (auth && auth1) {
        Module.query('SELECT id,name FROM selection_list;', function (err, secData) {

          if (err) {
            return res.view('404');

          }

          if (secData) {
            return res.view('resource/tutor_challenge_active', {
              role: role0,
              name: name0,
              auth: key,
              section: secData,
            });

          }


        });

      }
    } else {
      return res.redirect("/login");
    }


  },
  checkTutorChallenge: function (req, res) {

    var unit_id = req.body.unit_id ? req.body.unit_id : false;
    if (unit_id) {
      Module.query('SELECT COUNT(id) AS data_count FROM `tutor_challange_question` ' +
        'WHERE (status="ACTIVE" OR status="INACTIVE") AND unit_id=' + unit_id + ';', function (err, data) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          if (data[0]['data_count'] == 0) {
            res.send(200, JSON.stringify({msg: "AVAILABLE"}));
          }
          else {
            res.send(200, JSON.stringify({msg: "EMPTY"}));

          }


        }


      });

    }
    else {
      return res.redirect("/login");
    }


  },
  deleteResource: function (req, res) {

    var resource_id = req.body.r_id ? req.body.r_id : false;


    /* if (resource_id) {
     Module.query('UPDATE `resources` SET `confirm`=1 WHERE `id`=' + resource_id + ';', function (err, data) {
     if (err) {

     res.send(200, JSON.stringify({msg: "Something wrong"}));
     }

     if (data) {

     if (data['affectedRows'] > 0) {

     res.send(200, JSON.stringify({msg: "updated"}));
     }

     }

     })


     } else {
     return res.redirect("/login");
     }*/
  },
  confirmTuChallenge: function (req, res) {

    var tu_chid = req.body.tu_chid ? req.body.tu_chid : false;
    var key = req.body.token ? req.body.token : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var end_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + 7 + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    var dataSet = JSON.parse(localStorage.getItem(key));
    if (dataSet != null) {

      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var id = dataSet.id ? dataSet.id : false;
      if (tu_chid && id) {
        Module.query('UPDATE tutor_challange_question SET admin_confirmation=1,status="ACTIVE",start_date="' + date + '",end_date="' + end_date + '" WHERE id=' + tu_chid + ';', function (err, data) {
          if (err) {
            res.send(401, JSON.stringify({msg: "Something wrong"}));
          }
          if (data) {

            res.send(200, {msg: "updated"});


          }


        });


      }

    }


  },
  loadTutorChallengeView: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (auth && auth1) {

        return res.view('resource/tutor_challenge_view', {
          role: role0,
          name: name0,
          auth: key,
        });


      }

    } else {
      return res.redirect("/login");
    }
  },
  dueToMarkChallengeCount: function (req, res) {

    var sec_id = req.body.sec_id ? req.body.sec_id : false;
    if (sec_id) {
      Utils.getUnitBySec(sec_id, function (err, unit) {
        Module.query('SELECT COUNT(DISTINCT TA.id) AS data_count FROM tutor_challange_answer TA,tutor_challange_question TQ ' +
          'WHERE TQ.id = TA.question_id ' +
          'AND TA.submit_status ="SUBMITTED" ' +
          'AND TA.is_marked =0 AND TQ.unit_id IN(' + unit + ');', function (err, data) {
          if (err) {
            res.send(200, JSON.stringify({msg: "Something wrong"}));
          }
          if (data) {
            res.send(200, data);
          }

        })
      })

    }

  },
  dueToMarkChallengeData: function (req, res) {

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
    if (sec_id) {
      Utils.getUnitBySec(sec_id, function (err, unit) {
        Module.query('SELECT TA.id as a_id, TA.student_id, TA.question_id,TA.answer, TA.last_mod_date , ' +
          'TQ.question , TQ.answer_word_limit,U.id AS unit_id, S.full_name, U.name ' +
          'FROM tutor_challange_answer TA,tutor_challange_question TQ, unit U, students S ' +
          'WHERE TQ.id = TA.question_id AND U.id = TQ.unit_id AND S.std_id = TA.student_id AND U.id = TQ.unit_id ' +
          'AND S.std_id=TA.student_id AND TA.submit_status = "SUBMITTED" ' +
          'AND TA.is_marked =0 AND TQ.unit_id IN(' + unit + ')' +
          ' LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, data) {
          if (err) {
            res.send(200, JSON.stringify({msg: "Something wrong"}));
          }
          if (data) {
            res.send(200, data);
          }

        })
      })

    }

  },
  allActiveInit: function (req, res) {

    var key = req.param('auth') ? req.param('auth') : false;
    var dataSet = JSON.parse(localStorage.getItem(key));

    if (dataSet != null) {
      var auth = dataSet.auth0 ? dataSet.auth0 : false;
      var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
      var name0 = dataSet.name0 ? dataSet.name0 : false;
      var role0 = dataSet.role0 ? dataSet.role0 : false;

      if (auth && auth1) {
        Module.query('SELECT id,name FROM selection_list;', function (err, secData) {

          if (err) {
            return res.view('404');

          }

          if (secData) {
            return res.view('resource/view_all_resource', {
              role: role0,
              name: name0,
              auth: key,
              section: secData,
            });

          }


        });

      }
    } else {
      return res.redirect("/login");
    }

  },
  unitResourceAll: function (req, res) {

    var unit = req.body.u_type ? req.body.u_type : false;
    // var r_type = req.body.r_type ? req.body.r_type : false;
    if (unit) {
      Module.query('SELECT * FROM unit_resources ' +
        'WHERE unit_id in (' + unit + ');',
        function (err, resource) {
          if (err) {
            return res.view('404');

          } else {

            if (resource.length != 0) {
              var r_data = [];
              var l = 0;
              for (var k = 0; k < resource.length; k++) {
                r_data[l] = resource[k]['resource_id'];
                l++;
              }

              var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];

              Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                'R.`heading_id`,RH.name as h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                'FROM `resources` R ,`resource_types` RTT , headings RH  ' +
                'WHERE RTT. id = R.resource_type_id AND RH.id = R.heading_id  AND R.confirm=1 AND  R.`id` IN(' + sqr_part1 + ');',
                function (err, data) {

                  if (err) {
                    return res.view('404');

                  } else {
                    //console.log(data);
                    res.send(200, JSON.stringify({data: data}));
                  }
                });

            } else {
              res.send(200, JSON.stringify({data: []}));
            }


          }


        });


    }

  },
  getResDataConfirmCount: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var type_id = req.body.r_type ? req.body.r_type : false;
    var unit_id = req.body.unit_id ? req.body.unit_id : "";

    if (auth) {
      if (unit_id == "") {
        Module.query('SELECT COUNT(id) AS data_count FROM resources WHERE resource_type_id=' + type_id + ' AND  confirm=1;', function (err, data) {

          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));

          }

          if (data) {

            res.send(200, data);
          }


        });

      }
      else {

        Module.query('SELECT * FROM unit_resources WHERE unit_id in (' + unit_id + ');', function (err, resource) {
          if (err) {
            return res.view('404');

          } else {

            if (resource.length != 0) {
              var r_data = [];
              var l = 0;
              for (var k = 0; k < resource.length; k++) {
                r_data[l] = resource[k]['resource_id'];
                l++;
              }

              var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
              Module.query('SELECT COUNT(id) AS data_count FROM resources WHERE resource_type_id=' + type_id + ' AND  confirm=1 AND  id IN(' + sqr_part1 + ');', function (err, data) {

                if (err) {

                  res.send(200, JSON.stringify({msg: "Something wrong"}));

                }

                if (data) {

                  res.send(200, data);
                }


              });


            }

            else {


            }
          }


        });


      }


    }


  },
  getResDataConfirm: function (req, res) {


    var auth = req.body.auth ? req.body.auth : false;
    var page_id = req.body.page_id ? req.body.page_id : false;
    var type_id = req.body.r_type ? req.body.r_type : false;
    var unit_id = req.body.unit_id ? req.body.unit_id : "";
    var pageLimit = 5;


    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);

    }

    if (auth) {
      if (unit_id == "") {

        Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
          'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
          'R.`heading_id`,RH.name AS h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
          'FROM `resources` R, resource_types RTT, headings RH ' +
          'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
          'R.resource_type_id=' + type_id + ' AND R.confirm=1 ORDER BY R.id ' +
          'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, data) {

          if (err) {

            res.send(200, JSON.stringify({msg: "Something wrong"}));

          }

          if (data) {

            res.send(200, data);
          }


        });
      }
      else {

        Module.query('SELECT * FROM unit_resources WHERE unit_id in (' + unit_id + ');', function (err, resource) {
          if (err) {
            return res.view('404');

          } else {

            if (resource.length != 0) {
              var r_data = [];
              var l = 0;
              for (var k = 0; k < resource.length; k++) {
                r_data[l] = resource[k]['resource_id'];
                l++;
              }

              var sqr_part1 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
              Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                'R.`heading_id`,RH.name AS h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                'FROM `resources` R, resource_types RTT, headings RH ' +
                'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
                'R.resource_type_id=' + type_id + ' AND R.confirm=1 AND R.id IN(' + sqr_part1 + ') ORDER BY R.id ' +
                'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, data) {

                if (err) {

                  res.send(200, JSON.stringify({msg: "Something wrong"}));

                }

                if (data) {

                  res.send(200, data);
                }


              });

            }

            else {


            }
          }


        });


      }


    }


  },
  tuChDelete: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var tu_chId = req.body.tu_chId ? req.body.tu_chId : false;

    if (auth) {
      Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
        'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
        'R.`heading_id`,RH.name AS h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
        'FROM `resources` R, resource_types RTT, headings RH ' +
        'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
        'R.resource_type_id=' + type_id + ' AND R.confirm=1 ORDER BY R.id ' +
        'LIMIT ' + st_limit + ',' + pageLimit + ';', function (err, data) {

        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          res.send(200, data);
        }


      });


    }


  },
  editUnitResource: function (req, res) {


    var auth = req.body.auth ? req.body.auth : false;
    var r_id = req.body.id ? req.body.id : false;


    if (auth && r_id) {
      Module.query('SELECT description FROM resources WHERE id=' + r_id + '', function (err, data) {
        if (err) {

          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {
          res.send(200, data);
        }


      });


    }


  },
  unitResourceUpdate: function (req, res) {

    var r_id = req.body.r_id ? req.body.r_id : false;
    var r_name = req.body.r_name ? req.body.r_name : false;
    var r_des = req.body.r_des ? req.body.r_des : false;
    var url_link = req.body.url_link ? req.body.url_link : false;
    var file_id = req.body.file_id ? req.body.file_id : false;

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
    if (r_id && r_name && r_des && file_id) {
      Module.query('UPDATE resources SET name="' + r_name + '" , description="' + mysql_real_escape_string(r_des) + '" WHERE id=' + r_id + ';', function (err, data) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          if (data['affectedRows'] == 1 && url_link) {

            Module.query('UPDATE file SET name= "' + url_link + '" WHERE id =' + file_id + '; ', function (err, sucsess) {
              if (err) {
                res.send(200, JSON.stringify({msg: "Something wrong"}));

              }

              if (data) {
                if (data['affectedRows'] == 1) {
                  res.send(200, JSON.stringify({msg: "ok"}));
                }

              }
            });


          }
          if (data['affectedRows'] == 1 && !url_link) {
            res.send(200, JSON.stringify({msg: "ok"}));
          }


        }


      });


    }


  },
  challengeAnswerData: function (req, res) {

    var a_id = req.body.a_id ? req.body.a_id : false;
    var tuch_qid = req.body.tuch_qid ? req.body.tuch_qid : false;
    var st_id = req.body.st_id ? req.body.st_id : false;


    if (a_id && tuch_qid && st_id) {
      Module.query('SELECT answer FROM tutor_challange_answer WHERE student_id=' + st_id + ' AND id=' + a_id + ';', function (err, answer) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (answer) {

          Module.query('SELECT question,answer AS correct_answer FROM tutor_challange_question WHERE id=' + tuch_qid + ';', function (err, question) {
            if (err) {
              res.send(200, JSON.stringify({msg: "Something wrong"}));

            }

            if (question) {

              res.send(200, {question: question, answer: answer});


            }
          });


        }


      });


    }


  },
  addMarkToStudent: function (req, res) {

    var a_id = req.body.a_id ? req.body.a_id : false;
    var st_id = req.body.st_id ? req.body.st_id : false;
    var tu_id = req.body.tu_id ? req.body.tu_id : false;
    var marks = req.body.marks ? req.body.marks : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();


    if (a_id && tu_id && st_id) {
      Module.query('UPDATE tutor_challange_answer SET is_marked=' + 1 + ',full_marks=' + marks + ',last_mod_by=' + tu_id + ',last_mod_date="' + date + '"  WHERE id=' + a_id + '  AND student_id=' + st_id + ';', function (err, data) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          res.send(200, JSON.stringify({msg: "UPDATED"}));


        }


      });


    }


  },
  addTuchStars: function (req, res) {

    var tchall_stars = req.body.tchall_stars ? req.body.tchall_stars : false;
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    if (a_id && tu_id && st_id) {
      Module.query('UPDATE tutor_challange_answer SET is_marked=' + 1 + ',full_marks=' + marks + ',last_mod_by=' + tu_id + ',last_mod_date="' + date + '"  WHERE id=' + a_id + '  AND student_id=' + st_id + ';', function (err, data) {
        if (err) {
          res.send(200, JSON.stringify({msg: "Something wrong"}));

        }

        if (data) {

          res.send(200, JSON.stringify({msg: "UPDATED"}));


        }


      });


    }


  },
  getSectionResourceCount: function (req, res) {

    var key = req.body.auth ? req.body.auth : false;
    var dataSet = JSON.parse(localStorage.getItem(key));
    var type_id = req.body.r_type ? req.body.r_type : false;
    var unit_id = req.body.unit_id ? req.body.unit_id : "";

    if (dataSet != null) {
      var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
      if (sec_type) {
        Utils.getModuleFromSec(sec_type, function (err, data) {
          if (err) {
            console.log(err);
          }
          if (data) {
            var dataParams = {
              type: "dataCount",
              r_type: type_id,
              unit_id: unit_id,
            };
            Utils.getSectionResource(data.mo_data, dataParams, function (err, data) {
              if (err) {
                console.log(err);
              }
              if (data) {

                //console.log(data);

                res.send(200, data.count);


              }

            })


          }

        })

      }

    } else {
      return res.redirect("/login");
    }

  },
  getSectionResourceData: function (req, res) {

    var auth = req.body.auth ? req.body.auth : false;
    var dataSet = JSON.parse(localStorage.getItem(auth));
    var page_id = req.body.page_id ? req.body.page_id : false;
    var type_id = req.body.r_type ? req.body.r_type : false;
    var unit_id = req.body.unit_id ? req.body.unit_id : "";
    var pageLimit = 5;

    if (page_id == 1) {
      var st_limit = 0;
      var end_limit = 5;
    } else {
      var st_limit = (page_id - 1) * pageLimit;
      var end_limit = (st_limit + pageLimit);

    }

    if (auth) {

      if (dataSet != null) {
        var sec_type = dataSet.sec0 ? dataSet.sec0 : false;
        if (sec_type) {
          Utils.getModuleFromSec(sec_type, function (err, data) {
            if (err) {
              console.log(err);
            }
            if (data) {
              var dataParams = {
                type: "allData",
                r_type: type_id,
                unit_id: unit_id,
                st_limit: st_limit,
                pageLimit: pageLimit
              };
              Utils.getSectionResource(data.mo_data, dataParams, function (err, data) {
                if (err) {
                  console.log(err);
                }
                if (data) {
                  res.send(200, data.resource);
                }

              })


            }

          })

        }

      } else {
        return res.redirect("/login");
      }


    }


  },

};
