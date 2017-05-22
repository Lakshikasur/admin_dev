//var format = require('date-format');
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
                    return res.view('abuse/abuse_summary', {
                                role: role0,
                                name: name0,
                                auth: key,
                            });
              }
        } else {
          return res.redirect("/login");
        }
    },
    
   getAbuseCount: function (req, res) {
        var auth = req.body.auth ? req.body.auth : false;
        if (auth) {
            Module.query('SELECT COUNT(id) AS data_count FROM report_abuse_feedback WHERE status = 0;', function (err, data) {
                if (err) {
                    res.send(200, JSON.stringify({msg: "Something wrong"}));
                }
                if (data) {
                   res.send(200, data);
                }
            });
        }
  },
   

   get_abuse_smry: function(req, res) {
        var page_id   = req.body.page_id ? req.body.page_id : false;
        var pageLimit = 5;
        if (page_id == 1) {
            var st_limit  = 0;
            var end_limit = 5;
        } else {
            var st_limit  = (page_id - 1) * pageLimit;
            var end_limit = (st_limit + pageLimit);
        }     
        Prize.query('SELECT r.id AS abuse_id, r.subject, r.content, r.type, r.status, r.date'+ 
                      ', s.reference, s.full_name, s.firstName, s.familyName, u.email ' +
                      ' FROM students s, users u, report_abuse_feedback r WHERE r.student_id = s.std_id '+
                      ' AND u.id = s.user_id AND r.status = 0 ORDER BY r.id DESC LIMIT '+
                        st_limit+','+ pageLimit +';', function(err, abs_data) {
                if (err || abs_data.length == 0 ) {
                    console.log(err);
                    return res.send(200, JSON.stringify({message:"error "}));
                } else {                  
                  var rec_cnt = 0;
                  var formatted_arr = new Array();
                  for( var ck in abs_data ) {
                      var obj     = abs_data[ck];
                      var nodeobj = {};

                      nodeobj.abuse_id = obj.abuse_id;
                      nodeobj.subject  = obj.subject; 
                      nodeobj.type     = obj.type;
                      nodeobj.status   = obj.status;
                      nodeobj.email    = obj.email;
                      nodeobj.family_name = obj.familyName;
                      nodeobj.first_name  = obj.firstName;
                      nodeobj.full_name   = obj.full_name;
                      nodeobj.reference   = obj.reference;
                      nodeobj.date    = obj.date;
                      nodeobj.content = obj.content;

                      formatted_arr[rec_cnt] = nodeobj;
                      rec_cnt++;
                  }
                    res.send(200, formatted_arr);
                }
            });
          
    },


   getAbuseDetails: function(req, res) { 
        var abuse_id = req.body.abuse_id ? req.body.abuse_id : false;
        Prize.query('SELECT r.id AS abuse_id, r.subject, r.content, r.type, r.status, r.date'+ 
                      ', s.reference, s.full_name, s.firstName, s.familyName, u.email ' +
                      ' FROM students s, users u, report_abuse_feedback r WHERE r.id = '+abuse_id+' AND r.student_id = s.std_id '+
                      ' AND u.id = s.user_id', function(err, abs_data) {
                if (err || abs_data.length == 0 ) {
                    console.log(err);
                    return res.send(200, JSON.stringify({message:"error "}));
                } else { 
                    res.send(200, abs_data);
                }
            });

   },


};
