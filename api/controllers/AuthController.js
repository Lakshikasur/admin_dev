if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var crypto = require('crypto');
var algorithm = 'aes256';
var password = 'd6F3Efeq';

module.exports = {

    signupload: function(req, res) {

        Country.query('SELECT id,country_name FROM country', function(err, country) {
            if (err) {
                // console.log(err);
                return res.view('404');

            } else {
                return res.view('login/signup', {
                    country: country
                });
            }
        });


    },
    register: function(req, res) {
        if (req.body.pwd !== req.body.confirmpwd) {

            // console.log(res.json);
            return res.json(401, { err: 'Password doesn\'t match' });

        }
        //TODO: Do some validation on the input
        var passwd = crypto.createHash('md5').update(req.body.pwd).digest("hex");
        var name = req.body.name;
        var email = req.body.email;
        var type = req.body.type;
        var tel = req.body.tel;
        var country = req.body.country;


        Users.query("SET @p0='" + passwd + "'; SET @p1='" + name + "'; SET @p2='" + email + "'; SET @p3=" + type + "; SET @p4=" + tel + "; SET @p6=" + country + "; CALL spInsertUser(@p0, @p1, @p2, @p3, @p4, @p5, @p6); SELECT @p5 as msg", function(err, msg) {
            if (err) {
                //console.log(err);
                res.send(200, JSON.stringify({ msg: "danger" }));
            }

            if (msg) {

                if (msg['7']['0']['msg'] == 'T') {
                    res.send(200, JSON.stringify({ msg: "success" }));
                    var d = new Date();
                    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

                    Users.query("SET @p0='New User Register" + " " + name + "'; SET @p1='No link'; SET @p3='" + date + "';CALL spInsertNotification(@p0, @p1, @p2, @p3); SELECT @p0 AS notification, @p1 AS link, @p2 AS feedID,@p3 AS createdAt;", function(err, data) {
                        if (err) {
                            // console.log(err);
                            //res.send(401,JSON.stringify({msg:"Something wrong"}));
                            return res.view('404');
                        }

                        if (data) {

                            Users.query("SELECT id from users WHERE status=1 and type=1", function(err, admindata) {
                                if (err) {
                                    //console.log(err);
                                    // res.send(401,JSON.stringify({msg:"Something wrong"}));
                                    return res.view('404');
                                }
                                // console.log(admindata.length);
                                if (admindata.length != 0) {
                                    var feedID = data['4']['0']['feedID'];
                                    for (var i = 0; i < admindata.length; i++) {
                                        Feed.query('SET @p0 =  ' + admindata[i]['id'] + '; SET @p1 = ' + feedID + ';CALL `spInsertNotificationUser` (@p0 , @p1 , @p2 , @p3); SELECT @p0 AS  `userID` , @p1 AS  `notificationID` , @p2 AS  `notification` , @p3 AS  `createdAt` ;', function(err, msgdata) {
                                            if (err) {
                                                // console.log(err);
                                                // res.send(401,JSON.stringify({msg:"Something wrong"}));
                                                return res.view('404');
                                            }


                                            if (msgdata) {

                                                var entry = msgdata['3']['0'];
                                                Feed.datasync(entry, function(err) {


                                                });


                                            }
                                        });

                                    }
                                    for (var i = 0; i < admindata.length; i++) {


                                        Feed.query('SET @p0 =  ' + admindata[i]['id'] + ';CALL `spGetNotificationCount` (@p0 , @p1);SELECT @p0 AS  `userID` , @p1 AS  `num`;', function(err, count) {
                                            if (err) {
                                                // console.log(err);
                                                // res.send(401,JSON.stringify({msg:"Something wrong"}));
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


                    })
                }
                if (msg['7']['0']['msg'] == 'F') {

                    res.send(200, JSON.stringify({ msg: "danger" }));

                }

            }


        });

    },
    authlogin: function(req, res) {

        var pwd = crypto.createHash('md5').update(req.body.pwd).digest("hex");
        var email = req.body.email;
        var time = (new Date).getTime();
        var str_time = time.toString();
        var tmp_token = crypto.createHash('md5').update(str_time).digest("hex");
        var cipher1 = crypto.createCipher(algorithm, password);
        var crypted2 = cipher1.update(tmp_token, 'utf8', 'hex');

        Users.query("SELECT id from users WHERE status=1 and type=1", function(err, adminData) {
            if (err) {
              res.send(200, JSON.stringify({msg: "Something wrong"}));
            }

            if (adminData) {
                localStorage.setItem('admin0', JSON.stringify(adminData));

            }
        });
        Users.query("SELECT id from users WHERE status=1 and type=3", function(err, tutorData) {
            if (err) {
              res.send(200, JSON.stringify({msg: "Something wrong"}));
            }

            if (tutorData) {
                localStorage.setItem('tutor0', JSON.stringify(tutorData));

            }
        });
        Users.query("SELECT id from users WHERE status=1 and type=4", function(err, sysAdminData) {
            if (err) {
              res.send(200, JSON.stringify({msg: "Something wrong"}));
            }

            if (sysAdminData) {
                localStorage.setItem('sysAdmin0', JSON.stringify(sysAdminData));

            }
        });
        Users.query("SET @p0='" + email + "'; SET @p1='" + pwd + "'; CALL `spValidateLogin`(@p0, @p1, @p2, @p3, @p4, @p5); SELECT @p2 AS `uid`, @p3 AS `role`, @p4 AS `userName`, @p5 AS `com_status`;", function(err, msg) {
            if (err) {
              res.send(200, JSON.stringify({msg: "Something wrong"}));
            }
            if (msg) {

                var num = msg['3']['0']['uid'] ? msg['3']['0']['uid'] : false;
                var role = msg['3']['0']['role'] ? msg['3']['0']['role'] : false;
                var name = msg['3']['0']['userName'] ? msg['3']['0']['userName'] : false;
                var strnum = num.toString();
                var cipher = crypto.createCipher(algorithm, password);
                var crypted = cipher.update(strnum, 'utf8', 'hex');
                crypted += cipher.final('hex');
                if (role && name && num != "no name") {

                    var oldDataObj = new Date();
                    var newDataObj = new Date(oldDataObj.getTime() + 60000);
                    var sesId = req.body.csrf;
                    Users.query("SELECT `selection_list_id` FROM `tutor_assign` WHERE `tutor_id` IN (SELECT id FROM tutor WHERE user_id =" + num + ");", function(err, sectionData) {
                        if (err) {
                            // return res.view('404');
                            // console.log(err)
                        }
                        if (sectionData) {

                            if (sectionData.length > 0) {
                                localStorage.setItem('sec0', sectionData['0']['selection_list_id']);
                                var sec_id = sectionData['0']['selection_list_id'];
                                var userData = { id: num, role0: role, name0: name, auth0: crypted, auth1: crypted2, sec0: sec_id };
                                localStorage.setItem(sesId, JSON.stringify(userData));
                            } else {
                                req.session.sec0 = null;
                                var sec_id = false;
                                var userData = { id: num, role0: role, name0: name, auth0: crypted, auth1: crypted2, sec0: sec_id };
                                localStorage.setItem(sesId, JSON.stringify(userData));
                            }

                            Users.query("SET @p0=" + num + "; SET @p1='" + tmp_token + "'; CALL insertTempUsers(@p0, @p1);", function(err, msg) {
                                if (err) {

                                  res.send(200, JSON.stringify({msg: "Something wrong"}));
                                }

                                if (msg) {


                                    if (sec_id && role === 3) {

                                        res.send(200, JSON.stringify({
                                            uid: sesId,
                                            role: role,
                                            auth: num,
                                            token_tmp: tmp_token,
                                            sec_id: sec_id
                                        }));

                                    }

                                    if (!sec_id && role === 3) {

                                        res.send(200, JSON.stringify({
                                            uid: sesId,
                                            role: role,
                                            auth: num,
                                            token_tmp: tmp_token,
                                        }));

                                    }

                                    if (!sec_id && role === 1) {

                                        res.send(200, JSON.stringify({ uid: sesId, role: role, auth: num, token_tmp: tmp_token }));

                                    }


                                }
                            });


                        }
                    });

                }
                if (num && !name) {
                    var crypted = null;
                    res.send(200, JSON.stringify({
                        uid: crypted,
                        role: role,
                    }));
                }
                if (!num && name == 'no name') {

                    var crypted = null;
                    res.send(200, JSON.stringify({
                        uid: crypted,
                        role: role,
                    }));
                }

            }
        });

    },
    dashboardload: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            if (auth && auth1) {
                var decry = function(text) {
                    var decipher = crypto.createDecipher(algorithm, password);
                    try {
                        var dec = decipher.update(text, 'hex', 'utf8');
                        dec += decipher.final('utf8');
                        Users.query("SELECT type FROM users WHERE id=" + dec + "", function(err, role) {
                            if (err) {
                                return res.view('404');
                            } else {
                                return res.view("dashboard", {
                                    role: role0,
                                    name: name0,
                                    auth: key
                                });
                            }
                        });
                    } catch (ex) {
                        return res.redirect("/login");
                    }
                };
                decry(auth);

            }

        } else {
            return res.redirect("/login");
        }


    },
    logout: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));

        if (dataSet) {
            var id = dataSet.id ? dataSet.id : false;
            Users.query("DELETE FROM `temp_users` WHERE user_id=" + id + " ORDER BY id DESC LIMIT 1;", function(err, sucsess) {
                if (err) {
                    return res.view('404');
                }
                if (sucsess) {
                    localStorage.removeItem(key);
                    return res.redirect("/login");
                }
            });

        }


    }


};
