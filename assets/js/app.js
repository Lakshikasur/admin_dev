var notificationApp = angular.module('notificationApp', ['ngResource', 'angularMoment', 'ngAnimate', 'angular-notification-icons',
  'ngSanitize', 'ui.bootstrap', 'moment-picker', 'textAngular', 'base64', 'flow', 'ngRoute'
]);
notificationApp.controller('NotificationCtrl', ['$scope', '$resource', '$timeout', function ($scope, $resource, $timeout) {
  $scope.token = sessionStorage.getItem('token');
  $scope.notificationEntries = $resource('/feeddata?auth=' + $scope.token).query();
  $scope.getID = {id: sessionStorage.getItem('auth')};
  io.sails.url = admin_portal;
  io.socket.get(admin_portal + '/feed/subscribe?auth=' + $scope.token, function (data, jwr) {
    io.socket.on('new_entry', function (entry) {
      $timeout(function () {
        $scope.notificationEntries.unshift(entry);
      });

    });
  });
}]);
notificationApp.controller('NotificationShowCtrl', ['$scope', '$resource', '$timeout', function ($scope, $resource, $timeout) {
  $scope.token = sessionStorage.getItem('token');
  $scope.notificationCount = $resource('/feedcount?auth=' + $scope.token).query();
  // console.log($scope.notificationCount);
  $scope.getID = {id: sessionStorage.getItem('auth')};
  io.sails.url = admin_portal;
  io.socket.get(admin_portal + '/feed/subscribecount?auth=' + $scope.token, function (data, jwr) {
    io.socket.on('new_count', function (feed) {
      $timeout(function () {
        // console.log(feed['0'].userID);
        if (feed['0'].userID == sessionStorage.getItem('auth')) {
          //console.log(feed['0'].num);
          $scope.notificationCount['0'].num = feed['0'].num;
        }


      });

    });
  });
}]);
notificationApp.controller('NotificationLogoutCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
  $scope.logout = function () {
    $scope.token = sessionStorage.getItem('token');
    $window.sessionStorage.clear();
    var host = $window.location.host;
    var landingUrl = "http://" + host + "/logout?auth=" + $scope.token;
    $window.location.href = landingUrl;
  }
}]);
notificationApp.controller('MessageCtrl', ['$scope', '$resource', '$timeout', function ($scope, $resource) {
  $scope.token = sessionStorage.getItem('token');
  $scope.messageEntries = $resource('/messages?auth=' + $scope.token).query();
  $scope.getID = {id: sessionStorage.getItem('auth')};


}]);
notificationApp.controller('MessageReplyCtrl', ['$scope', '$resource', '$timeout', function ($scope, $resource) {
  $scope.token = sessionStorage.getItem('token');
  $scope.messageReplyEntries = $resource('/messages/showReply?auth=' + $scope.token).query();
  $scope.getID = {id: sessionStorage.getItem('auth')};


}]);
notificationApp.controller('HelperMessageCtrl', ['$scope', '$resource', '$timeout', function ($scope, $resource) {
  $scope.token = sessionStorage.getItem('token');
  $scope.helperMessageEntries = $resource('/messages/helpers?auth=' + $scope.token).query();
  $scope.getID = {id: sessionStorage.getItem('auth')};


}]);
notificationApp.controller('addQuizAnswer', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

  $scope.data = {};
  $scope.choices = [];
  $scope.choices.c_answer = 0;
  $scope.addNewChoice = function () {

    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({'id': newItemNo, 'answer': $scope.choices.answer, 'c_answer': $scope.choices.c_answer});
  };

  $scope.removeChoice = function () {
    var lastItem = $scope.choices.length - 1;
    $scope.choices.splice(lastItem);
  };

  $scope.changeAnswer = function (id) {
    choice.checked;
    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].c_answer = 1;
    }

    $scope.choices[id - 1].c_answer = 0;


  }


  $scope.saveQuestionData = function () {


    $scope.data.m_id = localStorage.getItem("m_typeid");
    $scope.data.u_id = localStorage.getItem("mu_typeid");
    $scope.data.qs_id = localStorage.getItem("qs_id");
    $scope.data.token = sessionStorage.getItem('token');
    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].uid = sessionStorage.getItem('auth');
      $scope.choices[i].qsid = localStorage.getItem("qs_id");
    }
    $scope.data.choice = $scope.choices;

    if ($scope.data.qs_id && $scope.data.qs_id && $scope.data.qs_id == 4 && typeof($scope.data.question) != "undefined" && typeof($scope.data.questiondes) != "undefined") {
      $http.post("/assessment/quiz_submit", $scope.data)
        .then(function (response) {
          if (response) {

            $.alert({
              title: 'Success!',
              content: 'Question Insert Successfully',
            });

            $scope.data = {};
            $scope.data = {};
            $scope.choices.splice(0, ($scope.choices.length));

          }
          // console.log(data);

        }, function (err) {
          console.log(err);

        });

    } else {
      $.alert({
        title: 'Error',
        content: 'Fill the All Field!'
      });
    }
    ;


  }

}]);
notificationApp.controller('addWritingSpokeAnswer', ['$scope', '$http', '$base64', '$location', '$window', function ($scope, $http, $location, $window) {

  $scope.data = {};
  $scope.choices = [];
  $scope.choices.c_answer = 0;
  $scope.addNewChoice = function () {

    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({'id': newItemNo, 'answer': $scope.choices.answer, 'c_answer': $scope.choices.c_answer});
  };

  $scope.removeChoice = function () {
    var lastItem = $scope.choices.length - 1;
    $scope.choices.splice(lastItem);
  };

  $scope.changeAnswer = function (id) {

    choice.checked;
    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].c_answer = 1;
    }

    $scope.choices[id - 1].c_answer = 0;


  }

  $scope.data.m_id = localStorage.getItem("m_typeid");
  $scope.data.u_id = localStorage.getItem("mu_typeid");
  $scope.data.qs_id = localStorage.getItem("qs_id");
  $scope.data.token = sessionStorage.getItem('token');


  $scope.saversQuestionData = function () {

    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].uid = sessionStorage.getItem('auth');
      $scope.choices[i].qsid = localStorage.getItem("qs_id");
    }


    $scope.imgtag = angular.element($scope.data.htmlVariable).find('img');
    if ($scope.imgtag.length > 0) {
      $scope.sourseimg = $scope.imgtag[0].src;
      var binary = atob($scope.sourseimg.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }
      var image = new Blob([buffer], {type: "image/png"});
      // $scope.data.withoutimgtag = angular.element($scope.data.htmlVariable).remove('img');
      $scope.data.question = $scope.data.htmlVariable.replace(/<\/?img[^>]*>/g, "<img src=''>");
      $scope.data.choice = $scope.choices;


      if ($scope.data.questiondes) {
        var fd = new FormData();
        fd.append('upload', image, 'upload.png');
        $http.post("/assessment/questionImageUpload", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).then(function (response) {
          if (response) {

            if (response.data.filename) {
              $scope.data.htmlVariable = $scope.data.question.replace("<img src=''>", "<img src='" + admin_portal + "/assessment/questionImageView?src=" + response.data.filename + "'>");
              $http.post("/assessment/ws_answer_submit", $scope.data)
                .then(function (response) {
                  if (response) {

                    $.alert({
                      title: 'Success!',
                      content: 'Question Insert Successfully',
                    });

                    $scope.data = {};
                    $scope.data = {};
                    $scope.choices.splice(0, ($scope.choices.length));

                  }
                  // console.log(data);

                }, function (err) {
                  console.log(err);

                });
            }
            else {
              $.alert({
                title: 'Error',
                content: 'Fail The Creation!'
              });

            }

          }
          // console.log(data);

        }, function (err) {
          console.log(err);

        });

      } else {
        $.alert({
          title: 'Error',
          content: 'Fill the All Field!'
        });
      }
      ;

      /* else{
       $.alert({
       title: 'Error',
       content: 'Fill the All Field!'
       });
       };*/

    }
    else {

      $.confirm({
        title: 'Alert!',
        content: 'Please Insert Image',
        buttons: {
          Done: function () {
            return;

          }

        }
      });

    }
  }

}]);
notificationApp.controller('addTrueFalseAnswer', ['$scope', '$http', '$base64', '$location', '$window', function ($scope, $http, $location, $window) {
  $scope.data = {};
  $scope.choices = [];
  $scope.addNewChoice = function () {
    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({'id': newItemNo, 'answer': $scope.choices.answer, 'c_answer': $scope.choices.c_answer});
  };
  $scope.removeChoice = function () {
    var lastItem = $scope.choices.length - 1;
    $scope.choices.splice(lastItem);
  };


  $scope.saveQuestionData = function () {

    $scope.data.m_id = localStorage.getItem("m_typeid");
    $scope.data.u_id = localStorage.getItem("mu_typeid");
    $scope.data.qs_id = localStorage.getItem("qs_id");
    $scope.data.token = sessionStorage.getItem('token');
    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].uid = sessionStorage.getItem('auth');
      $scope.choices[i].qsid = localStorage.getItem("qs_id");
    }
    $scope.data.choice = $scope.choices;
    if ($scope.data.questiondes && $scope.data.question && $scope.data.qs_id == 2 && typeof($scope.data.question) != "undefined" && typeof($scope.data.questiondes) != "undefined") {
      $http.post("/assessment/quiz_submit", $scope.data)
        .then(function (response) {
          if (response) {

            $.alert({
              title: 'Success!',
              content: 'Question Insert Successfully',
            });

            $scope.data = {};
            $scope.data = {};
            $scope.choices.splice(0, ($scope.choices.length));


          }
        }, function (err) {
          console.log(err);

        });

    } else {
      $.alert({
        title: 'Error',
        content: 'Fill the All Field!'
      });
    }
    ;


  }

}]);
notificationApp.controller('addYesNoAnswer', ['$scope', '$http', '$base64', '$location', '$window', function ($scope, $http, $location, $window) {
  $scope.data = {};
  $scope.choices = [];
  $scope.addNewChoice = function () {
    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({'id': newItemNo, 'answer': $scope.choices.answer, 'c_answer': $scope.choices.c_answer});
  };
  $scope.removeChoice = function () {
    var lastItem = $scope.choices.length - 1;
    $scope.choices.splice(lastItem);
  };


  $scope.saveQuestionData = function () {

    $scope.data.m_id = localStorage.getItem("m_typeid");
    $scope.data.u_id = localStorage.getItem("mu_typeid");
    $scope.data.qs_id = localStorage.getItem("qs_id");
    $scope.data.token = sessionStorage.getItem('token');
    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].uid = sessionStorage.getItem('auth');
      $scope.choices[i].qsid = localStorage.getItem("qs_id");
    }
    $scope.data.choice = $scope.choices;

    if ($scope.data.questiondes && $scope.data.question && $scope.data.qs_id == 6 && typeof($scope.data.question) != "undefined" && typeof($scope.data.questiondes) != "undefined") {
      $http.post("/assessment/quiz_submit", $scope.data).then(function (response) {
        if (response) {

          $.confirm({
            title: 'Success!',
            content: 'Question Insert Successfully',
            buttons: {
              Done: function () {

                $scope.data = null;

              }

            }
          });

        }
      }, function (err) {
        console.log(err);
      });

    } else {
      $.alert({
        title: 'Error',
        content: 'Fill the All Field!'
      });
    }
    ;


  }

}]);
notificationApp.config(['flowFactoryProvider', function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4,
    singleFile: true,
  };
  //console.log('app1 config', flowFactoryProvider);
  //console.log('app1 config - flowFactoryProvider.opts', flowFactoryProvider.opts);

  flowFactoryProvider.on('catchAll', function (event) {
    // console.log('catchAll', arguments[1]);
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);
notificationApp.controller('addViewAndImageAnswer', ['$scope', '$http', '$base64', function ($scope, $http) {

  $scope.data = {};
  $scope.choices = [];
  $scope.choices.c_answer = 0;
  $scope.files = [];
  $scope.data.m_id = localStorage.getItem("m_typeid");
  $scope.data.u_id = localStorage.getItem("mu_typeid");
  $scope.data.qs_id = localStorage.getItem("qs_id");
  $scope.data.token = sessionStorage.getItem('token');
  $scope.addNewChoice = function () {

    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({'id': newItemNo, 'answer': 0, 'c_answer': $scope.choices.c_answer});


  };
  $scope.removeChoice = function (id) {
    var target = id.currentTarget.id;
    var new_string = target.replace('file', '');
    var index = parseInt(new_string);
    $scope.choices.splice(index, 1);

  };
  $scope.changeAnswer = function (id) {
    choice.checked;
    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].c_answer = 1;
    }

    $scope.choices[id - 1].c_answer = 0;


  };
  $scope.fileNameChanged = function (file, id) {
    var new_string = id.replace('file', '');
    var fd = new FormData();
    fd.append('uploadAnswer', file[0]);
    var index = parseInt(new_string);
    $http.post("/assessment/answerImageUpload", fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(function (response) {

      $scope.choices[index].answer = "<img src='" + admin_portal + "/assessment/questionAnswerImageView?src=" + response.data.filename + "'>"
      document.getElementById(id).disabled = true;


    }, function (err) {
      console.log(err);

    });


  };
  $scope.saversQuestionData = function () {

    for (var i = 0; i < $scope.choices.length; i++) {
      $scope.choices[i].uid = sessionStorage.getItem('auth');
      $scope.choices[i].qsid = localStorage.getItem("qs_id");
    }


    $scope.imgtag = angular.element($scope.data.htmlVariable).find('img');
    if ($scope.imgtag.length > 0) {
      $scope.sourseimg = $scope.imgtag[0].src;
      var binary = atob($scope.sourseimg.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }
      var image = new Blob([buffer], {type: "image/png"});
      $scope.data.question = $scope.data.htmlVariable.replace(/<\/?img[^>]*>/g, "<img src=''>");
      $scope.data.choice = $scope.choices;


      if ($scope.data.questiondes) {
        var fd = new FormData();
        fd.append('upload', image, 'upload.png');
        $http.post("/assessment/questionImageUpload", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).then(function (response) {
          if (response) {

            if (response.data.filename) {
              $scope.data.htmlVariable = $scope.data.question.replace("<img src=''>", "<img src='" + admin_portal + "/assessment/questionImageView?src=" + response.data.filename + "'>");
              $http.post("/assessment/ws_answer_submit", $scope.data)
                .then(function (response) {
                  if (response) {

                    $.alert({
                      title: 'Success!',
                      content: 'Question Insert Successfully',
                    });

                    $scope.data = {};
                    $scope.data = {};
                    $scope.choices.splice(0, ($scope.choices.length));

                  }
                  // console.log(data);

                }, function (err) {
                  console.log(err);

                });
            }
            else {
              $.alert({
                title: 'Error',
                content: 'Fail The Creation!'
              });

            }

          }
          // console.log(data);

        }, function (err) {
          console.log(err);

        });

      } else {
        $.alert({
          title: 'Error',
          content: 'Fill the All Field!'
        });
      }
      ;

      /* else{
       $.alert({
       title: 'Error',
       content: 'Fill the All Field!'
       });
       };*/

    }
    else {

      $.confirm({
        title: 'Alert!',
        content: 'Please Insert Image',
        buttons: {
          Done: function () {
            return;

          }

        }
      });

    }
  }

}]);
notificationApp.controller('unitFormController', ['$scope', '$http', function ($scope) {
  $scope.data = {
    unitName: "",
  };


}]);
notificationApp.controller('moduleFormController', ['$scope', '$http', function ($scope) {
  $scope.data = {
    moduleName: "",
  };


}]);
notificationApp.controller('moduleEditFormController', ['$scope', '$http', function ($scope, $http) {
  $scope.getModuleData = function (event) {
    var elem = event.currentTarget || event.srcElement;
    var id = elem.id;
    var _csrf = document.getElementById('_csrf').value;
    var data = {"id": id, _csrf: _csrf};
    $http.post("/module/get_description", data).then(function (response) {
      $scope.orightml = response.data[0].description;
      $scope.htmlcontent = $scope.orightml;
      $scope.disabled = false;
    }, function (err) {
      console.log(err);
    });
  };


}]);
notificationApp.controller('unitEditFormController', ['$scope', '$http', function ($scope, $http) {
  $scope.getUnitData = function (event) {
    var elem = event.currentTarget || event.srcElement;
    var id = elem.id;
    var _csrf = document.getElementById('_csrf').value;
    var data = {"id": id, _csrf: _csrf};
    $http.post("/unit/get_description", data).then(function (response) {
      $scope.orightml1 = response.data[0].description;
      $scope.htmlcontentdes = $scope.orightml1;
      $scope.disabled = false;
    }, function (err) {
      console.log(err);
    });
  };


}]);
notificationApp.controller('resourceEditFormController', ['$scope', '$http', function ($scope, $http) {
  var initData = {
    u_type: "",
    sec_id:sessionStorage.getItem('sec_id'),
  };
  $http.post("/tutorUnitResource", initData)
    .then(function (response) {
      if (response) {
        $scope.unitsData=response.data['data'];

      }
      // console.log(data);

    }, function (err) {
      console.log(err);

    });
  $scope.getResourceData = function (event) {
    var elem = event.currentTarget || event.srcElement;
    var id = elem.name;
    var _csrf = document.getElementById('_csrf').value;
    var data = {
      'id': id,
      'auth': sessionStorage.getItem('auth'),
      _csrf: _csrf
    };
    $http.post("/resource/getEditData", data).then(function (response) {
      $scope.orightml1 = response.data[0].description;
      $scope.htmlcontentdes = $scope.orightml1;
      $scope.disabled = false;
    }, function (err) {
      console.log(err);
    });
  };
  $scope.selectedItemChanged=function () {
    console.log($scope.selectedItem);
    var data = {
      m_type: $scope.selectedItem,
    };
    $http.post("/initresourceunits", data)
      .then(function (response) {
        if (response) {

          var units=response.data[0];
          $scope.units=units;

        }
        // console.log(data);

      }, function (err) {
        console.log(err);

      });
  };
  $scope.selectedUnitChanged=function () {
    var data = {
      u_type: $scope.selectedUnit,
      sec_id:sessionStorage.getItem('sec_id'),
    };
     $http.post("/tutorUnitResource", data)
      .then(function (response) {
        if (response) {
           $scope.unitsData=response.data['data'];

        }
        // console.log(data);

      }, function (err) {
        console.log(err);

      });
  }



}]);
notificationApp.controller('resourceSummeryController', ['$scope', '$http', function ($scope) {

  $scope.data = {
    resourseSummery: "",
  };


}]);
notificationApp.controller('tutorChallengeController', ['$scope', '$http', function ($scope) {

  $scope.data = {
    resourseSummery: "",
  };


}]);
notificationApp.controller('addUnitFaq', ['$scope', '$http', '$base64', '$location', '$window', function ($scope, $http, $location, $window) {
  $scope.data = {};
  $scope.choices = [];
  $scope.addNewChoice = function () {
    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({
      'id': newItemNo,
      'f_question': $scope.choices.f_question,
      'f_answer': $scope.choices.f_answer
    });
  };
  $scope.removeChoice = function (id) {
    var target = id.currentTarget.id;
    var new_string = target.replace('faq', '');
    var index = parseInt(new_string);
    $scope.choices.splice(index, 1);

  };
  $scope.saveFaqData=function () {




    var unit_st= sessionStorage.getItem('faq_unitId')==null?false:true;
    var unit_qs= $scope.choices[0].f_question==null?false:true;
    var unit_an= $scope.choices[0].f_answer==null?false:true;

    if(unit_st && unit_qs && unit_an) {
      $scope.imgtag = angular.element($scope.choices[0].f_answer).find('img');
      if ($scope.imgtag.length > 0) {
        $scope.sourseimg = $scope.imgtag[0].src;
        var binary = atob($scope.sourseimg.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var j = 0; j < len; j++) {
          view[j] = binary.charCodeAt(j);
        }
        var image = new Blob([buffer], {type: "image/png"});
        $scope.choices[0].f_answer = $scope.choices[0].f_answer.replace(/<\/?img[^>]*>/g, "<img src=''>");
          var fd = new FormData();
          fd.append('upload', image, 'upload.png');

        $http.post("/unit/faqImageUpload", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).then(function (response) {
          if (response) {
            if (response.data.filename) {
               $scope.choices[0].f_answer= $scope.choices[0].f_answer.replace("<img src=''>", "<img src='" + admin_portal + "/unit/faqImageView?src=" + response.data.filename + "'>");
              var data = {
                'unit_id': sessionStorage.getItem('faq_unitId'),
                'u_faq': $scope.choices,
                'tutor_id': sessionStorage.getItem('auth'),

              };

              $http.post("/unit/addFaq", data).then(function (response) {
                sessionStorage.removeItem('faq_unitId');
                if (response.data.msg == 'error') {
                  $(".loader-wrapper").addClass('hide');
                  $.confirm({
                    title: 'Error',
                    content: 'Data error!',
                    buttons: {
                      Done: function () {
                        location.href = '/unit/faq?auth=' + sessionStorage.getItem('token');
                      }

                    }
                  });

                } else {
                  $(".loader-wrapper").addClass('hide');
                  $.confirm({
                    title: 'Success',
                    content: 'Data insert successfully!',
                    buttons: {
                      Done: function () {
                        location.href = '/unit/faq?auth=' + sessionStorage.getItem('token');
                      }

                    }
                  });

                }
              }, function (err) {
                console.log(err);
              });
            }
            else {
              $.alert({
                title: 'Error',
                content: 'Fail The Creation!'
              });

            }

          }
          // console.log(data);

        }, function (err) {
          console.log(err);

        });



      }
      else{





            var data = {
              'unit_id': sessionStorage.getItem('faq_unitId'),
              'u_faq': $scope.choices,
              'tutor_id': sessionStorage.getItem('auth'),

            };

            $http.post("/unit/addFaq", data).then(function (response) {
              sessionStorage.removeItem('faq_unitId');
              if (response.data.msg == 'error') {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Error',
                  content: 'Data error!',
                  buttons: {
                    Done: function () {
                      location.href = '/unit/faq?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });

              } else {
                $(".loader-wrapper").addClass('hide');
                $.confirm({
                  title: 'Success',
                  content: 'Data insert successfully!',
                  buttons: {
                    Done: function () {
                      location.href = '/unit/faq?auth=' + sessionStorage.getItem('token');
                    }

                  }
                });

              }
            }, function (err) {
              console.log(err);
            });

          }







      }
    else{

      $.confirm({
        title: 'Data Error',
        content: 'Please Fill The All Data!',
        buttons: {
          Done: function () {
            return
          }

        }
      });

    }








  }

}]);
notificationApp.controller('addUnitGlossary', ['$scope', '$http', '$base64', '$location', '$window', function ($scope, $http, $location, $window) {
/*  $scope.data = {};
  $scope.choices = [];
  $scope.addNewChoice = function () {
    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({
      'id': newItemNo,
      'g_header': $scope.choices.g_header,
      'g_description': $scope.choices.g_description
    });
  };
  $scope.removeChoice = function () {
    var lastItem = $scope.choices.length - 1;
    $scope.choices.splice(lastItem);
  };*/

  $scope.data = {};
  $scope.choices = [];
  $scope.addNewChoice = function () {
    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({
      'id': newItemNo,
      'g_header': $scope.choices.g_header,
      'g_description': $scope.choices.g_description
    });
  };
  $scope.removeChoice = function (id) {
    var target = id.currentTarget.id;
    var new_string = target.replace('gloss', '');
    var index = parseInt(new_string);
    $scope.choices.splice(index, 1);

  };
  $scope.saveGlossData=function () {




    var unit_st= sessionStorage.getItem('gloss_unitId')==null?false:true;
    var unit_qs= $scope.choices[0].g_header==null?false:true;
    var unit_an= $scope.choices[0].g_description==null?false:true;

    if(unit_st && unit_qs && unit_an) {
      $scope.imgtag = angular.element($scope.choices[0].g_description).find('img');
      if ($scope.imgtag.length > 0) {
        $scope.sourseimg = $scope.imgtag[0].src;
        var binary = atob($scope.sourseimg.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var j = 0; j < len; j++) {
          view[j] = binary.charCodeAt(j);
        }
        var image = new Blob([buffer], {type: "image/png"});
        $scope.choices[0].g_description = $scope.choices[0].g_description.replace(/<\/?img[^>]*>/g, "<img src=''>");
        var fd = new FormData();
        fd.append('upload', image, 'upload.png');

        $http.post("/unit/glossImageUpload", fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).then(function (response) {
          if (response) {
            if (response.data.filename) {
              $scope.choices[0].g_description= $scope.choices[0].g_description.replace("<img src=''>", "<img src='" + admin_portal + "/unit/glossImageView?src=" + response.data.filename + "'>");
              var data = {
                'unit_id': sessionStorage.getItem('gloss_unitId'),
                'u_gloss': $scope.choices,
                'tutor_id': sessionStorage.getItem('auth'),

              };

              $http.post("/unit/addGlossary", data).then(function (response) {
                sessionStorage.removeItem('gloss_unitId');
                if (response.data.msg == 'error') {
                  $(".loader-wrapper").addClass('hide');
                  $.confirm({
                    title: 'Error',
                    content: 'Data error!',
                    buttons: {
                      Done: function () {
                        location.href = '/unit/glossary/init?auth=' + sessionStorage.getItem('token');
                      }

                    }
                  });

                } else {
                  $(".loader-wrapper").addClass('hide');
                  $.confirm({
                    title: 'Success',
                    content: 'Data insert successfully!',
                    buttons: {
                      Done: function () {
                        location.href = '/unit/glossary/init?auth=' + sessionStorage.getItem('token');
                      }

                    }
                  });

                }
              }, function (err) {
                console.log(err);
              });
            }
            else {
              $.alert({
                title: 'Error',
                content: 'Fail The Creation!'
              });

            }

          }
          // console.log(data);

        }, function (err) {
          console.log(err);

        });



      }
      else{
        var data = {
          'unit_id': sessionStorage.getItem('gloss_unitId'),
          'u_gloss': $scope.choices,
          'tutor_id': sessionStorage.getItem('auth'),

        };
        $http.post("/unit/addGlossary", data).then(function (response) {
          sessionStorage.removeItem('gloss_unitId');
          if (response.data.msg == 'error') {
            $(".loader-wrapper").addClass('hide');
            $.confirm({
              title: 'Error',
              content: 'Data error!',
              buttons: {
                Done: function () {
                  location.href = '/unit/glossary?auth=' + sessionStorage.getItem('token');
                }

              }
            });

          } else {
            $(".loader-wrapper").addClass('hide');
            $.confirm({
              title: 'Success',
              content: 'Data insert successfully!',
              buttons: {
                Done: function () {
                  location.href = '/unit/glossary?auth=' + sessionStorage.getItem('token');
                }

              }
            });

          }
        }, function (err) {
          console.log(err);
        });

      }


    }
    else{

      $.confirm({
        title: 'Data Error',
        content: 'Please Fill The All Data!',
        buttons: {
          Done: function () {
            return
          }

        }
      });

    }








  }


}]);
notificationApp.controller('addUnitData', ['$scope', '$http', '$base64', '$location', '$window', function ($scope, $http, $location, $window) {
  $scope.data = {};
  $scope.choices = [];
  $scope.addNewChoice = function () {
    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({'id': newItemNo, 'answer': $scope.choices.answer, 'c_answer': $scope.choices.c_answer});
  };
  $scope.removeChoice = function () {
    var lastItem = $scope.choices.length - 1;
    $scope.choices.splice(lastItem);
  };


}]);
notificationApp.controller('resourceViewFormController', ['$scope', '$http', '$base64', '$location', '$window', function ($scope, $http, $location, $window) {
  $scope.data = {};
  $scope.choices = [];
  $scope.addNewChoice = function () {
    var newItemNo = $scope.choices.length + 1;
    $scope.choices.push({'id': newItemNo, 'answer': $scope.choices.answer, 'c_answer': $scope.choices.c_answer});
  };
  $scope.removeChoice = function () {
    var lastItem = $scope.choices.length - 1;
    $scope.choices.splice(lastItem);
  };


}]);
