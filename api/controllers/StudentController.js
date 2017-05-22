/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
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

                var status = 0;

                Users.query("CALL spGetNotConfrimStaff();", function(err, stdata) {
                    if (err) {
                        // res.send(401,JSON.stringify("No Data found"));
                        return res.view('404');
                    }
                    if (stdata) {

                        res.view('student/index', {
                            student: stdata,
                            role: role0,
                            name: name0,
                            auth: key
                        });
                    }

                });

            }
        } else {

            localStorage.removeItem('admin0');
            return res.redirect("/login");
        }
    },


};