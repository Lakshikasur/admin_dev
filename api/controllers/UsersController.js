/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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

                Users.query('SELECT id, name FROM	selection_list WHERE id IN (SELECT DISTINCT `selection_list_id` FROM `package_subject`);', function(err, section) {
                    if (err) {

                        // console.log(err);
                        //res.send(err);
                        // res.send(401,JSON.stringify("No Data found"));
                        return res.view('404');
                    } else {

                        Users.query('SELECT id,name FROM helpers', function(err, helpers) {
                            if (err) {
                                //res.send(err);
                                //res.send(401,JSON.stringify("No Data found"));
                                return res.view('404');
                            } else {

                                Users.query("SELECT id, email , type FROM	users WHERE	status=1 AND type=1;", function(err, activeAdmin) {
                                    if (err) {

                                        activeAdmin = (activeAdmin.length > 0) ? activeAdmin : false;
                                        // res.send(200,JSON.stringify("No Data found"));
                                        return res.view('404');
                                    } else {
                                        Users.query("SELECT id, email , type FROM	users WHERE	status=1 AND type=3;", function(err, activeTutor) {
                                            if (err) {
                                                // res.send(200,JSON.stringify("No Data found"));
                                                return res.view('404');
                                            } else {
                                                activeTutor = (activeTutor.length) > 0 ? activeTutor : false;

                                                Users.query("SELECT id, email , type FROM	users WHERE	status=1 AND type=4;", function(err, activeSysAdmin) {
                                                    if (err) {
                                                        // res.send(200,JSON.stringify("No Data found"));
                                                        return res.view('404');
                                                    } else {

                                                        activeSysAdmin = (activeSysAdmin.length) > 0 ? activeSysAdmin : false;

                                                        Users.query("CALL spGetNotConfrimStaff();", function(err, data) {
                                                            if (err) {
                                                                // res.send(200,JSON.stringify("No Data found"));
                                                                return res.view('404');
                                                            } else {
                                                                if (typeof data['0'] !== 'undefined' && data['0'].length > 0) {
                                                                    res.view("users/index", {
                                                                        section: section,
                                                                        helpers: helpers,
                                                                        users: data['0'],
                                                                        activeAdmin: activeAdmin,
                                                                        activeTutor: activeTutor,
                                                                        activeSysAdmin: activeSysAdmin,
                                                                        msg: true,
                                                                        active_msg: true,
                                                                        role: role0,
                                                                        name: name0,
                                                                        auth: key
                                                                    });

                                                                } else {
                                                                    res.view("users/index", {
                                                                        msg: false,
                                                                        active_msg: true,
                                                                        activeAdmin: activeAdmin,
                                                                        activeTutor: activeTutor,
                                                                        activeSysAdmin: activeSysAdmin,
                                                                        role: role0,
                                                                        name: name0,
                                                                        auth: key
                                                                    });
                                                                }

                                                            }

                                                        });

                                                        //console.log(section);


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
        } else {

            localStorage.removeItem('admin0');
            return res.redirect("/login");
        }


    },
    confirmuser: function(req, res) {

        if (req.body.id) {
            var uid = req.body.id;
            var id = req.body.a_id;
            var stat = 1;
        }
        Users.query("SET @p0=" + uid + "; SET @p1=" + stat + "; CALL spValidateUserStatus(@p0, @p1);", function(err, data) {

            if (err) {
                //console.log(err);
                // res.send(401,JSON.stringify("No Data found"));
                return res.view('404');
            }

            if (data) {

                var d = new Date();
                var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                var admin = JSON.parse(localStorage.getItem('admin0'));

                Users.query("SET @p0='Add New User by Admin" + " " + localStorage.getItem('name0') + "'; SET @p1='No link'; SET @p3='" + date + "'; CALL `spInsertNotification`(@p0, @p1, @p2, @p3); SELECT @p0 AS `notification`, @p1 AS `link`, @p2 AS `feedID`,@p3 AS `createdAt`;", function(err, data) {
                    if (err) {
                        //console.log(err);
                        //res.send(401,JSON.stringify("No Data found"));
                        return res.view('404');
                    }

                    if (data) {

                        Users.query("SELECT id from users WHERE status=1 and type=1", function(err, admindata) {
                            if (err) {
                                //console.log(err);
                                // res.send(401,JSON.stringify("No Data found"));
                                return res.view('404');
                            }
                            if (admindata['0']['id']) {
                                var feedID = data['4']['0']['feedID'];
                                for (var i = 0; i < admindata.length; i++) {
                                    Feed.query('SET @p0 =  ' + admindata[i]['id'] + '; SET @p1 = ' + feedID + ';CALL `spInsertNotificationUser` (@p0 , @p1 , @p2 , @p3); SELECT @p0 AS  `userID` , @p1 AS  `notificationID` , @p2 AS  `notification` , @p3 AS  `date` ;', function(err, msgdata) {
                                        if (err) {
                                            // console.log(err);
                                            //res.send(401, JSON.stringify(err));
                                            // res.send(401,JSON.stringify("No Data found"));
                                            return res.view('404');
                                        }


                                        if (msgdata) {

                                            // console.log(msgdata);
                                            var entry = msgdata['3']['0'];
                                            Feed.datasync(entry, function(err) {


                                            });


                                        }
                                    });

                                }
                                for (var i = 0; i < admindata.length; i++) {
                                    Feed.query('SET @p0 =  ' + admindata[i]['id'] + ';CALL `spGetNotificationCount` (@p0 , @p1);SELECT @p0 AS  `userID` , @p1 AS  `num`;', function(err, count) {
                                        if (err) {
                                            //console.log(err);
                                            // res.send(401,JSON.stringify("No Data found"));
                                            return res.view('404');

                                        }
                                        if (count) {
                                            //console.log(count);
                                            var count = count['2'];
                                            Feed.datacountsync(count, function(err) {


                                            });


                                        }
                                    });
                                }


                            }

                        });


                    }


                });
                res.send(200, data);
            }


        });

    },
    loadPackageSec: function(req, res) {
        var sec_type = req.body.sec_type ? req.body.sec_type : false;


        if (sec_type) {
            Module.query('SET @p0=' + gval + '; SET @p1=' + c_type + '; CALL `spGetPackage`(@p0, @p1);', function(err, subjects) {
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
    tutorassign: function(req, res) {

        var sec_type = req.body.sec_type ? req.body.sec_type : false;
        var uid = req.body.uid ? req.body.uid : false;
        var h_type = req.body.h_type ? req.body.h_type : false;
        var id = req.body.a_id ? req.body.a_id : false;
        if (sec_type && uid && h_type) {
            Users.query('SET @p0=' + uid + '; SET @p1=' + sec_type + '; CALL `spInsertAssignTutor`(@p0, @p1, @p2); SELECT @p0 AS `userID`, @p2 AS `st`;', function(err, data) {

                if (err) {
                    //console.log(err);
                    //res.send(401,JSON.stringify("No Data found"));
                    res.send(401, JSON.stringify("No Data found"));
                    // return res.view('404');
                }

                if (data) {

                    console.log(data);

                    var st = (data['3']['0']['st']) == 'T' ? true : false;

                    if (st) {
                        var stat = 1;
                        var tu_id = JSON.stringify(data['3']['0']['userID']);
                        Users.query("SET @p0=" + tu_id + "; SET @p1=" + stat + "; CALL spValidateUserStatus(@p0, @p1);", function(err, data) {

                            if (err) {
                                return res.view('404');
                            }
                            Users.query('SET @p0 =  ' + uid + ';SET @p1 =  ' + h_type + ';SELECT  `fnInsertUserHelper` (@p0 , @p1) AS  `fnInsertUserHelper` ;', function(err, data) {

                                if (err) {
                                    return res.view('404');
                                }
                                if (data) {
                                    console.log(data + '--');
                                    var d = new Date();
                                    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                                    var admin = JSON.parse(localStorage.getItem('admin0'));

                                    Users.query("SET @p0='Add New Tutor by Admin'; SET @p1='No link'; SET @p3='" + date + "'; CALL `spInsertNotification`(@p0, @p1, @p2, @p3); SELECT @p0 AS `notification`, @p1 AS `link`, @p2 AS `feedID`,@p3 AS `createdAt`;", function(err, data) {
                                        if (err) {
                                            //console.log(err);
                                            return res.view('404');
                                        }

                                        if (data) {

                                            Users.query("SELECT id from users WHERE status=1 and type=1", function(err, admindata) {
                                                if (err) {
                                                    console.log(err);
                                                    return res.view('404');
                                                }
                                                if (admindata['0']['id']) {
                                                    var feedID = data['4']['0']['feedID'];
                                                    for (var i = 0; i < admindata.length; i++) {
                                                        Feed.query('SET @p0 =  ' + admindata[i]['id'] + '; SET @p1 = ' + feedID + ';CALL `spInsertNotificationUser` (@p0 , @p1 , @p2 , @p3); SELECT @p0 AS  `userID` , @p1 AS  `notificationID` , @p2 AS  `notification` , @p3 AS  `date` ;', function(err, msgdata) {
                                                            if (err) {
                                                                //console.log(err);
                                                                //res.send(401, JSON.stringify(err));
                                                                // res.send(401,JSON.stringify("No Data found"));
                                                                return res.view('404');
                                                            }


                                                            if (msgdata) {

                                                                // console.log(msgdata);
                                                                var entry = data['3']['0'];
                                                                Feed.datasync(entry, function(err) {


                                                                });


                                                            }
                                                        });

                                                    }
                                                    for (var i = 0; i < admindata.length; i++) {
                                                        Feed.query('SET @p0 =  ' + admindata[i]['id'] + ';CALL `spGetNotificationCount` (@p0 , @p1);SELECT @p0 AS  `userID` , @p1 AS  `num`;', function(err, count) {
                                                            if (err) {
                                                                //console.log(err);
                                                                //res.send(401,JSON.stringify("No Data found"));
                                                                return res.view('404');

                                                            }
                                                            if (count) {
                                                                //console.log(count);
                                                                var count = count['2'];
                                                                Feed.datacountsync(count, function(err) {


                                                                });


                                                            }
                                                        });
                                                    }


                                                }

                                            });


                                        }


                                    });


                                }


                            });


                        });

                    }


                    res.send(200, { status: st });


                }


            });


        }

    },
    getUserEditData: function(req, res) {
        var tutor_id = req.body.uid ? req.body.uid : false;
        if (tutor_id) {
            Users.query('SELECT id, name FROM	selection_list WHERE id IN (SELECT DISTINCT `selection_list_id` FROM `package_subject`);', function(err, section) {
                if (err) {

                    // console.log(err);
                    //res.send(err);
                    // res.send(401,JSON.stringify("No Data found"));
                    return res.view('404');
                } else {

                    Users.query('SELECT id,name FROM helpers', function(err, helpers) {
                        if (err) {
                            //res.send(err);
                            //res.send(401,JSON.stringify("No Data found"));
                            return res.view('404');
                        } else {
                            Users.query('SET @p0 =' + tutor_id + ';CALL `spGetTutorDetails` (@p0);', function(err, data) {

                                if (err) {
                                    res.send(401, JSON.stringify("No Data found"));
                                    // return res.view('404');
                                }

                                if (data) {


                                    var tutor_array = [];
                                    tutor_array = data;
                                    tutor_array.splice(0, 1);
                                    tutor_array.splice((tutor_array.length - 1), 1);
                                    if (tutor_array[0].length > 0) {

                                        res.send(200, JSON.stringify({
                                            section: section,
                                            helpers: helpers,
                                            data: tutor_array[0]
                                        }));

                                    }


                                }


                            });
                        }


                    });
                }


            });


        }

    },
    update: function(req, res) {
        var sec_type = req.body.sec_type ? req.body.sec_type : false;
        var h_type = req.body.h_type ? req.body.h_type : false;
        var user_id = req.body.tutor_id ? req.body.tutor_id : false;



        if (sec_type && h_type && user_id) {
            Users.query("SELECT `id` AS tutor_id FROM `tutor` WHERE `user_id`=" + user_id + ";", function(err, tutorId) {
                if (err) {
                    res.send(401, JSON.stringify("No Data found"));
                } else {
                    var id = tutorId['0']['tutor_id'];
                    Users.query("UPDATE tutor_assign SET selection_list_id=" + sec_type + " WHERE tutor_id=" + id + ";", function(err, msg) {
                        if (err) {
                            res.send(401, JSON.stringify("No Data found"));
                        } else {
                            Users.query("UPDATE user_helpers SET helper_id=" + h_type + " WHERE user_id=" + user_id + ";", function(err, msgs) {
                                if (err) {
                                    // res.send(401, JSON.stringify("No Data found"));
                                    console.log(err);
                                } else {

                                    res.send(200, { status: true });

                                }

                            });
                        }



                    });
                }

            });

        }


    },
    delete: function(req, res) {
        var tu_id = req.body.user_id ? req.body.user_id : false;
        var stat = 2;

        if (tu_id) {
            Users.query("SET @p0=" + tu_id + "; SET @p1=" + stat + "; CALL spValidateUserStatus(@p0, @p1);", function(err, data) {

                if (err) {
                    //  console.log(err);
                    return res.view('404');
                } else {
                    res.send(200, JSON.stringify({ msg: 'Success' }));

                }

            });

        } else {


        }
    }


};