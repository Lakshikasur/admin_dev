module.exports = {

    subscribe: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));

        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            if (auth) {
                if (!req.isSocket) {
                    return res.badRequest();
                }

                // console.log("test");
                sails.sockets.join(req.socket, 'feed');

                return res.ok();

            }

        } else {
            return res.redirect("/login");
        }
    },
    subscribecount: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            if (auth) {
                if (!req.isSocket) {
                    return res.badRequest();
                }

                //console.log("test");
                sails.sockets.join(req.socket, 'count');

                return res.ok();

            }
        } else {
            return res.redirect("/login");
        }
    },
    loadinterface: function(req, res) {


        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var auth = dataSet.auth0 ? dataSet.auth0 : false;
            var auth1 = dataSet.auth1 ? dataSet.auth1 : false;
            var name0 = dataSet.name0 ? dataSet.name0 : false;
            var role0 = dataSet.role0 ? dataSet.role0 : false;
            if (auth && auth1) {
                return res.view('messages/feed', {
                    role: role0,
                    name: name0,
                    auth: key
                });
            }

        } else {

            return res.redirect("/login");
        }


    },
    loaddata: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var id = dataSet.id ? dataSet.id : false;
            Feed.query("SET @p0=" + id + "; CALL spGetNotification(@p0);", function(err, msg) {
                if (err) {
                    // console.log(err);
                    // res.send(401, JSON.stringify(err));
                    //res.send(401,JSON.stringify({msg:"Something wrong"}));
                    return res.view('404');
                }
                if (msg) {
                    // console.log(msg['1']);
                    if (msg['1']) {
                        res.send(msg['1']);
                    } else {
                        res.send("No Feed Yet");
                    }

                }
            });
        }

    },
    updatedata: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var id = dataSet.id ? dataSet.id : false;
            Feed.query("SET @p0=" + id + "; CALL spGetNotification(@p0);", function(err, msg) {
                if (err) {
                    //  console.log(err);
                    // res.send(401, JSON.stringify(err));
                    //res.send(401,JSON.stringify({msg:"Something wrong"}));
                    return res.view('404');
                }
                if (msg) {
                    // console.log("test");
                    //res.send(msg['3']['0']);
                    var entry = msg['3']['0'];
                    Feed.datasync(entry, function(err) {

                        res.send(200, JSON.stringify({ online: "ok" }));

                    })


                }
            });
        }


    },
    loadfeedcount: function(req, res) {
        var key = req.param('auth') ? req.param('auth') : false;
        var dataSet = JSON.parse(localStorage.getItem(key));
        if (dataSet != null) {
            var id = dataSet.id ? dataSet.id : false;
            if (id) {
                Feed.query('SET @p0 =  ' + id + ';CALL `spGetNotificationCount` (@p0 , @p1);SELECT @p0 AS  `userID` , @p1 AS  `num`;', function(err, count) {
                    if (err) {
                        //console.log(err);
                        // res.send(401,JSON.stringify({msg:"Something wrong"}));
                        return res.view('404');

                    }
                    if (count) {
                        var count = count['2'];
                        res.send(count);

                    }
                });


            }

        }


    },
    studentFeed: function(req, res) {
        //var id = localStorage.getItem('auth0');
        if (dataSet != null) {
            var st_id = req.body.st_id;
            Feed.query("SET @p0=" + st_id + "; CALL spGetNotification(@p0);", function(err, msg) {
                if (err) {
                    //  console.log(err);
                    // res.send(401, JSON.stringify(err));
                    // res.send(401,JSON.stringify({msg:"Something wrong"}));
                    return res.view('404');
                }
                if (msg) {
                    var entry = msg['3']['0'];
                    Feed.datasync(entry, function(err) {
                        res.send(200, JSON.stringify({ online: "ok" }));

                    })


                }
            });

        }


    }

};