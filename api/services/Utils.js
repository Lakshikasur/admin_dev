module.exports.getUnitBySec = function (sec_id, cb) {

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
              cb(undefined, sqr_part2);


            }

          }


        });


      }

    }


  });

};

module.exports.getPaginationData = function (total, data, currentPage, cb) {

  var pageSize = 5, pageCount = Math.ceil(total / 5), dataArrays = [], dataList = [];

  while (data.length > 0) {
    dataArrays.push(data.splice(0, pageSize));
  }

  dataList = dataArrays[+currentPage - 1];

  cb(undefined, {pageSize: pageSize, pageCount: pageCount, dataList: dataList})


};

module.exports.getModuleFromSec = function (sec_id, cb) {

  Module.query('SELECT name FROM `selection_list` WHERE id=' + sec_id + ';', function (err, sec) {
    if (err) {
      return res.view('404');
    }
    if (sec) {
      Module.query('SET @p0 =' + sec_id + ';CALL `spGetModulesFromSelectionList` (@p0);', function (err, md) {

        if (err) {
          return res.view('404');
        }
        if (md) {

          Module.query('SELECT  `id` FROM	package_subject WHERE	`selection_list_id` =' + sec_id + ';', function (err, ps) {
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

                    cb(undefined, {mo_data: sqr_part2, module: md, section: sec});


                  }

                }
              });

            }
          });
        }


      });
    }

  });


};

module.exports.getSectionResource = function (inarray,dataParams, cb) {

  var query1='SELECT DISTINCT(U.`id`) as unitID FROM `unit` U, module M WHERE M.id = U. `module_id` AND M.id IN (' + inarray + ');';
  Module.query(query1, function (err, unit) {
    if (err) {
      // console.log(err);

    } else {
      if (unit.length != 0) {
        var u_data = [];
        var j = 0;
        for (var i = 0; i < unit.length; i++) {
          u_data[j] = unit[i]['unitID'];
          j++;
        }

        var sqr_part = unit.length != 1 ? (u_data.join()) : unit[0]['unitID'];
        Module.query('SELECT * FROM unit_resources WHERE unit_id in (' + sqr_part + ');', function (err, resource) {
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

              if (dataParams.type == "dataCount") {
                var query2='SELECT COUNT(DISTINCT R.`id`) as data_count ' +
                  'FROM `resources` R ,`resource_types` RTT ,headings RH ' +
                  'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
                  'R.resource_type_id=' + dataParams.r_type + ' AND R.`id` IN(' + sqr_part1 + ') ORDER BY R.id ;';

                Module.query(query2, function (err, count) {
                    if (err) {

                      console.log("test"+err);
                    }
                    if (count) {

                      cb(undefined, {count: count[0]});

                    }


                  });
              }

              if (dataParams.type == "allData") {



                if (dataParams.unit_id == "") {

                  var query3='SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                    'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                    'R.`heading_id`,RH.name AS h_type, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                    'FROM `resources` R ,`resource_types` RTT ,headings RH ' +
                    'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
                    'R.resource_type_id=' + dataParams.r_type + ' AND R.`id` IN(' + sqr_part1 + ') ORDER BY R.id ' +
                    'LIMIT ' + dataParams.st_limit + ',' + dataParams.pageLimit + ';';

                  Module.query(query3, function (err, pageData) {
                      if (err) {
                        console.log("test"+err);
                      }
                      if (pageData) {

                        cb(undefined, {resource: pageData})

                      }

                    });

                }
                else {

                  Module.query('SELECT * FROM unit_resources WHERE unit_id in (' + dataParams.unit_id + ');', function (err, resource) {
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

                        var sqr_part2 = resource.length != 1 ? (r_data.join()) : resource['0']['resource_id'];
                        Module.query('SELECT R.`id` as resourceID, R.`name` as resourceName, ' +
                          'R.`resource_type_id`, R.`file_id`, R.`description`, ' +
                          'R.`heading_id`,RH.name AS h_name, R.confirm, RTT. name as resourceTypeName, RTT.icon ' +
                          'FROM `resources` R, resource_types RTT, headings RH ' +
                          'WHERE RTT. id = R.resource_type_id AND RH.id=R.heading_id AND ' +
                          'R.resource_type_id=' + dataParams.r_type + '  AND R.id IN(' + sqr_part2 + ') ORDER BY R.id ' +
                          'LIMIT ' + dataParams.st_limit + ',' + dataParams.pageLimit + ';', function (err, alldata) {

                          if (err) {

                            res.send(200, JSON.stringify({msg: "Something wrong"}));

                          }

                          if (alldata) {

                            cb(undefined, {resource: alldata});
                          }


                        });

                      }

                      else {


                      }
                    }


                  });



                }

                /*     if (unit_id == "") {

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


                 }*/


              }


            }

          }
        });

      }
    }
  });


};


