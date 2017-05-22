/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */


module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/



  //ui routes

  '/': {
    view: 'homepage'

  },
  '/login': {
    view: 'login/login'


  },
  '/message/show': {

    view: 'homepage'
  },
  '/feed/show': {
    controller: 'FeedController',
    action: 'loadinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/student/init': {
    controller: 'StudentController',
    action: 'loadinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },


  //ui routes


  //Start of login && sign_up routes

  '/signup': {
    controller: 'AuthController',
    action: 'signupload',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/logout': {
    controller: 'AuthController',
    action: 'logout',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },

  //End of login && sign_up routes

  //Start of package routing

  '/package/create': {
    controller: 'PackageController',
    action: 'loadcinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/package/init': {
    controller: 'PackageController',
    action: 'loadiinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/package/setPackageToSec': {
    controller: 'PackageController',
    action: 'setSectionToPackage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },

  'POST /addpackage': {
    controller: 'PackageController',
    action: 'add',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /getEditPackageData': {
    controller: 'PackageController',
    action: 'editPackageDataSet',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /updatePackageData': {
    controller: 'PackageController',
    action: 'update',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /deletePackageData': {
    controller: 'PackageController',
    action: 'delete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /package/count': {
    controller: 'PackageController',
    action: 'getPackageDataCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /package/getPageData': {
    controller: 'PackageController',
    action: 'getPackageData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },


  //End of package routing


  //Start of unit routing

  '/unit/create': {
    controller: 'UnitController',
    action: 'loadcinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/unit/init': {
    controller: 'UnitController',
    action: 'loadiinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/unit/faq': {
    controller: 'UnitController',
    action: 'loadFaqCreateInterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/unit/glossary': {
    controller: 'UnitController',
    action: 'loadGlossCreateInterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/unit/faq/init': {
    controller: 'UnitController',
    action: 'loadFaqInterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/unit/glossary/init': {
    controller: 'UnitController',
    action: 'loadGlossInterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },

  'POST /addunit': {
    controller: 'UnitController',
    action: 'add',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /updateUnit': {
    controller: 'UnitController',
    action: 'update',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /initmodulesfromesec': {
    controller: 'UnitController',
    action: 'loadmodule',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /unit/remove': {
    controller: 'UnitController',
    action: 'delete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /unit/get_description': {
    controller: 'UnitController',
    action: 'getDes',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /unit/addGlossary': {
    controller: 'UnitController',
    action: 'addGlossary',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /unit/addFaq': {
    controller: 'UnitController',
    action: 'addFaq',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /unit/faqImageUpload': {
    controller: 'UnitController',
    action: 'addFaqImage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /unit/glossImageUpload': {
    controller: 'UnitController',
    action: 'addGlossImage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /deleteFaqData': {
    controller: 'UnitController',
    action: 'faqDelete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /deleteGlossData': {
    controller: 'UnitController',
    action: 'GlossaryDelete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/unit/faqImageView': 'UnitController.unitFaqImageView',
  '/unit/glossImageView': 'UnitController.unitGlossImageView',



  //End  of unit routing


  //Start of module routing

  '/module/init': {
    controller: 'ModuleController',
    action: 'loadiinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/module/create': {
    controller: 'ModuleController',
    action: 'loadcinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },

  'POST /updateModule': {
    controller: 'ModuleController',
    action: 'update',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /initsuject': {
    controller: 'ModuleController',
    action: 'loadsubject',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /addmodule': {
    controller: 'ModuleController',
    action: 'add',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /module/get_description': {
    controller: 'ModuleController',
    action: 'getDes',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /module/remove': {
    controller: 'ModuleController',
    action: 'delete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /module/getModuleSec': {
    controller: 'ModuleController',
    action: 'getModuleFromSec',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /module/count': {
    controller: 'ModuleController',
    action: 'getModuleSecDataCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /module/getPageData': {
    controller: 'ModuleController',
    action: 'getModuleSecData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },


  //End of module routing

  //Start of  feed(Notification) routing
  '/feeddata': {
    controller: 'FeedController',
    action: 'loaddata',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/syncdata': {
    controller: 'FeedController',
    action: 'updatedata',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/feedcount': {
    controller: 'FeedController',
    action: 'loadfeedcount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/feed/count': {
    controller: 'FeedController',
    action: 'loadfeedcount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/feed/studentNotify': {
    controller: 'FeedController',
    action: 'studentFeed',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  //End of feed routing


  //Start of auth routing
  '/dashboard': {
    controller: 'AuthController',
    action: 'dashboardload',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/usersauth': {
    controller: 'UsersController',
    action: 'loadinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },


  },
  '/confirmuser': {
    controller: 'UsersController',
    action: 'confirmuser',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/initPackageSec': {
    controller: 'UsersController',
    action: 'loadPackageSec',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/confirmtutor': {
    controller: 'UsersController',
    action: 'tutorassign',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },

  'POST /getUserEditData': {
    controller: 'UsersController',
    action: 'getUserEditData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /updateTutorHelpData': {
    controller: 'UsersController',
    action: 'update',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /user/remove': {
    controller: 'UsersController',
    action: 'delete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /auth': {
    controller: 'AuthController',
    action: 'authlogin',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /register': {
    controller: 'AuthController',
    action: 'register',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },


  //End of auth routing

  //Start of add recourse

  '/resource/init': {
    controller: 'FileuploadController',
    action: 'loadiinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/resource/add': {
    controller: 'FileuploadController',
    action: 'loadnewinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/resource/addtutorChallenge': {
    controller: 'FileuploadController',
    action: 'addTutorChallenge',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/initResourceConfirm': {
    controller: 'FileuploadController',
    action: 'confirmDataInterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/resource/allActiveInit': {
    controller: 'FileuploadController',
    action: 'allActiveInit',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  /*  '/resource/tutorChallenge': {
   controller: 'FileuploadController',
   action: 'addTutorChallenge',
   cors: {
   origin: '*',
   headers: 'Content-Type, Authorization'
   },
   },*/
  '/resource/tutorChallengeActive': {
    controller: 'FileuploadController',
    action: 'loadTutorChallengeActive',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/resource/tutorChallenge/init': {
    controller: 'FileuploadController',
    action: 'loadTutorChallengeView',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /addresourcefile': {
    controller: 'FileuploadController',
    action: 'upload',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /initresourcepackage': {
    controller: 'FileuploadController',
    action: 'loadpackage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /unitResource': {
    controller: 'FileuploadController',
    action: 'unitResource',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /tutorUnitResource': {
    controller: 'FileuploadController',
    action: 'tutorUnitResource',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /unitResourceAll': {
    controller: 'FileuploadController',
    action: 'unitResourceAll',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/addTutorChallengeResource': {
    controller: 'FileuploadController',
    action: 'addTutorChallengeResource',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutorChallengeAdd': {
    controller: 'FileuploadController',
    action: 'addTutorChallengeData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  /*  'POST /initresourcepsubject': {
   controller: 'FileuploadController',
   action: 'loadpsubject',
   cors: {
   origin: 'http://localhost:1337'
   }
   },*/
  'POST /initresourcemodule': {
    controller: 'FileuploadController',
    action: 'loadmodule',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /initresourcegrades': {
    controller: 'FileuploadController',
    action: 'loadgrades',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /initresourceunits': {
    controller: 'FileuploadController',
    action: 'loadunit',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /addresoursetag': {
    controller: 'FileuploadController',
    action: 'addtag',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /addresoursehead': {
    controller: 'FileuploadController',
    action: 'addhead',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource_module_section': {
    controller: 'FileuploadController',
    action: 'loadModuleSec',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/confirmData': {
    controller: 'FileuploadController',
    action: 'confirmDataShow',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/confirm': {
    controller: 'FileuploadController',
    action: 'confirmResource',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/confirmAll': {
    controller: 'FileuploadController',
    action: 'confirmAllResourceByType',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/count': {
    controller: 'FileuploadController',
    action: 'getResDataCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/getPageData': {
    controller: 'FileuploadController',
    action: 'getResData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutor_challenge/count': {
    controller: 'FileuploadController',
    action: 'getTuChDataCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutor_challenge/getPageData': {
    controller: 'FileuploadController',
    action: 'getTuChData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutor_challenge_mark/addStar': {
    controller: 'FileuploadController',
    action: 'addTuchStars',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /checkUnitTuChallenge': {
    controller: 'FileuploadController',
    action: 'checkTutorChallenge',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/unit_faq/count': {
    controller: 'UnitController',
    action: 'getFaqCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /resource/unit_faq/getPageData': {
    controller: 'UnitController',
    action: 'getFaqData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /resource/unit_glossary/count': {
    controller: 'UnitController',
    action: 'getGlossaryCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /resource/unit_glossary/getPageData': {
    controller: 'UnitController',
    action: 'getGlossaryData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /resource/delete': {
    controller: 'FileuploadController',
    action: 'deleteResource',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tu_challengeConfirm': {
    controller: 'FileuploadController',
    action: 'confirmTuChallenge',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    }
  },
  'POST /resource/tutor_challenge_mark/count': {
    controller: 'FileuploadController',
    action: 'dueToMarkChallengeCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutor_challenge_mark/getPageData': {
    controller: 'FileuploadController',
    action: 'dueToMarkChallengeData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutor_challenge_mark/getAnswerData': {
    controller: 'FileuploadController',
    action: 'challengeAnswerData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutor_challenge_mark/addMark': {
    controller: 'FileuploadController',
    action: 'addMarkToStudent',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/confirmCount': {
    controller: 'FileuploadController',
    action: 'getResDataConfirmCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/ConfirmDataView': {
    controller: 'FileuploadController',
    action: 'getResDataConfirm',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tu_challengeDelete': {
    controller: 'FileuploadController',
    action: 'tuChDelete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/getEditData': {
    controller: 'FileuploadController',
    action: 'editUnitResource',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/update': {
    controller: 'FileuploadController',
    action: 'unitResourceUpdate',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutorResourceCount': {
    controller: 'FileuploadController',
    action: 'getSectionResourceCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /resource/tutorResourceData': {
    controller: 'FileuploadController',
    action: 'getSectionResourceData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },



  //End of add recourse


  //Start of message routes

  '/messages/init': {
    controller: 'MessageController',
    action: 'loadinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/messages': {
    controller: 'MessageController',
    action: 'loadAdminView',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/messages/showReply': {
    controller: 'MessageController',
    action: 'loadAdminSend',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  'POST /message/ShowReplyData': {
    controller: 'MessageController',
    action: 'loadAdminSendDataByID',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/studentView': {
    controller: 'MessageController',
    action: 'loadStudentSent',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/studentInboxView': {
    controller: 'MessageController',
    action: 'loadStudentInbox',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/stuMsgDelete': {
    controller: 'MessageController',
    action: 'deleteMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  /* 'POST /message/stuInboxMsgManyUpdate': {
   controller: 'MessageController',
   action: 'updateMessageMany',
   cors: {
   origin: '*',
   headers: 'Content-Type, Authorization'
   },

   },*/
  'POST /message/stuInboxMsgUpdate': {
    controller: 'MessageController',
    action: 'updateReplyStatus',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/getSentCount': {
    controller: 'MessageController',
    action: 'stSentCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/getInboxCount': {
    controller: 'MessageController',
    action: 'stInboxCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/initHelpers': {
    controller: 'MessageController',
    action: 'loadHelpers',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/showMsgReply': {
    controller: 'MessageController',
    action: 'viewReplyMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/stuMsgCreate': {
    controller: 'MessageController',
    action: 'insertMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },


  'POST /message/adminMsgReply': {
    controller: 'MessageController',
    action: 'adminReply',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/adminMsgView': {
    controller: 'MessageController',
    action: 'viewMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/adminInboxMsgView': {
    controller: 'MessageController',
    action: 'viewAdminInboxMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  /*'POST /message/adminMsgReply': {
   controller: 'MessageController',
   action: 'adminReply',
   cors: {
   origin: '*',
   headers: 'Content-Type, Authorization'
   },

   },*/

  //by Rajith--------------------------

  'POST /message/showMsgThread': {
    controller: 'MessageController',
    action: 'viewMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  // 'POST /message/showSentMsg': {
  //   controller: 'MessageController',
  //   action: 'viewSentMessage',
  //   cors: {
  //     origin: '*',
  //     headers: 'Content-Type, Authorization'
  //   },
  // },

  'POST /message/inboxReply': {
    controller: 'MessageController',
    action: 'inboxreply',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  'POST /message/tutorInboxView': {
    controller: 'MessageController',
    action: 'tutorinboxLoad',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  'POST /message/studentTrashView': {
    controller: 'MessageController',
    action: 'stdTrashLoad',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  'POST /message/studentInboxNotificationView': {
    controller: 'MessageController',
    action: 'messageNotification',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /message/foreverDelete': {
    controller: 'MessageController',
    action: 'deleteForeverMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /message/paginateInbox': {
    controller: 'MessageController',
    action: 'paginateInbox',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /message/paginateSend': {
    controller: 'MessageController',
    action: 'paginateSent',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /message/paginateTrash': {
    controller: 'MessageController',
    action: 'paginateTrash',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /message/paginateTutorHelp': {
    controller: 'MessageController',
    action: 'paginateTutorHelp',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  //by Rajith--------------------------


  // helper messgaes

  '/messages/helpers': {
    controller: 'HelpermessageController',
    action: 'loadHelperView',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/messages/hinit': {
    controller: 'HelpermessageController',
    action: 'loadinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  'POST /message/helperMessage': {
    controller: 'MessageController',
    action: 'helperMessages',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /gethelpermessage': {
    controller: 'HelpermessageController',
    action: 'gethelpermessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /hlpmsg/addHelperMsg': {
    controller: 'HelpermessageController',
    action: 'addMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /message/helperMsgView': {
    controller: 'HelpermessageController',
    action: 'viewHelperMessage',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /message/helperMsgReply': {
    controller: 'HelpermessageController',
    action: 'helperReply',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  //helper messages

  //end of message routes


  //Start of assessmentzone routes

  '/assessment/init': {
    controller: 'AssessmentzoneController',
    action: 'loadiinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/assessment/create': {
    controller: 'AssessmentzoneController',
    action: 'loadcinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/assessment/addquizmeta': {

    controller: 'AssessmentzoneController',
    action: 'loadQuizMeta',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/assessment/addQuestion': {
    controller: 'AssessmentzoneController',
    action: 'addQuestion',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/assessment/qconfig_summary': {
    controller: 'AssessmentzoneController',
    action: 'qconfig_summary',
    cors: {
      origin: 'http://localhost:1337,http://192.168.1.51:8003'
    }
  },
  '/assessment/quest_smry': {
    controller: 'AssessmentzoneController',
    action: 'load_summry',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },


  'GET /assessment/multiple_choice': 'AssessmentzoneController.initMultipleSelectQuiz',
  'GET /assessment/addQuestionInit': 'AssessmentzoneController.addQuestionInit',
  'GET /assessment/written_spoken': 'AssessmentzoneController.initWrittenSpoken',
  'GET /assessment/true_false': 'AssessmentzoneController.initTrueFalse',
  'GET /assessment/yes_no': 'AssessmentzoneController.initYesNo',
  'GET /assessment/view_imageAnswer': 'AssessmentzoneController.initViewImageAnswer',


  'POST /assessment/subjectinit': {
    controller: 'AssessmentzoneController',
    action: 'loadPackageSubjects',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/moduleinit': {
    controller: 'AssessmentzoneController',
    action: 'loadPackageSubjectsModule',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/configData': {
    controller: 'AssessmentzoneController',
    action: 'configQuizData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/filter_qConfig': {
    controller: 'AssessmentzoneController',
    action: 'filter_qConfig',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    }

  },
  'POST /assessment/quiz_submit': {
    controller: 'AssessmentzoneController',
    action: 'addQuestionData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/answer_submit': {
    controller: 'AssessmentzoneController',
    action: 'answerSubmit',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/answer_tf_submit': {
    controller: 'AssessmentzoneController',
    action: 'answerTruFalseSubmit',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/answer_yn_submit': {
    controller: 'AssessmentzoneController',
    action: 'answerYesNoSubmit',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/ws_answer_submit': {
    controller: 'AssessmentzoneController',
    action: 'writtenSpokenSave',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  /*'POST /assessment/ws_answer_submit': {
   controller: 'AssessmentzoneController',
   action: 'writtenSpokenSave',
   cors: {
   origin: '*',
   headers: 'Content-Type, Authorization'
   },

   },*/
  'POST /assessment/quesConfirm': {
    controller: 'AssessmentzoneController',
    action: 'confirmTest',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/questionConfirm': {
    controller: 'AssessmentzoneController',
    action: 'confirmAllQuestion',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/questionConfirmAll': {
    controller: 'AssessmentzoneController',
    action: 'confirmAllQuestion',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /assessment/sectionData': {
    controller: 'AssessmentzoneController',
    action: 'dataFromSection',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/getQuizTypeEditData': {
    controller: 'AssessmentzoneController',
    action: 'quizTypeEditData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/deleteQuizTypeData': {
    controller: 'AssessmentzoneController',
    action: 'deleteQuizType',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/quizConfirm/count': {
    controller: 'AssessmentzoneController',
    action: 'getQuizConfirmDataCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/quizConfirm/getPageData': {
    controller: 'AssessmentzoneController',
    action: 'getQuizConfirmData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/questionImageUpload': {
    controller: 'AssessmentzoneController',
    action: 'questionImageUpload',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/answerImageUpload': {
    controller: 'AssessmentzoneController',
    action: 'answerImageUpload',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /quest/count': {
    controller: 'AssessmentzoneController',
    action: 'getQuestCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /quest/get_quest_smry': {
    controller: 'AssessmentzoneController',
    action: 'get_quest_smry',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/quest/get_details': {
    controller: 'AssessmentzoneController',
    action: 'get_quest_details',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /assessment/quest/del_question': {
    controller: 'AssessmentzoneController',
    action: 'del_question',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/assessment/questionImageView': 'AssessmentzoneController.questionImageView',
  '/assessment/questionAnswerImageView': 'AssessmentzoneController.questionAnswerImageView',





//Snd of assessmentzone routes


  //Start of sectioncontroller routes


  '/section/init': {
    controller: 'SectionController',
    action: 'loadiinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/section/create': {
    controller: 'SectionController',
    action: 'loadcinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/section/addsection': {
    controller: 'SectionController',
    action: 'insertSection',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/section/loadAddPackageSec': {
    controller: 'PackageController',
    action: 'loadAddPackageSec',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/section/packageToSection': {
    controller: 'PackageController',
    action: 'loadAddPackageSecFromPid',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  '/section/editedPackageToSection': {
    controller: 'PackageController',
    action: 'loadAddPackageSecFromEditPid',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },

  'POST /section/remove': {
    controller: 'SectionController',
    action: 'delete',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /getEditSectionData': {
    controller: 'SectionController',
    action: 'edit',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /section/count': {
    controller: 'SectionController',
    action: 'getSectionDataCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /section/getPageData': {
    controller: 'SectionController',
    action: 'getSectionData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },

  //end of sectioncontroller routes

  //start prize routing


  '/prize/prize_summery': {
    controller: 'PrizeController',
    action: 'loadiinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  '/prize_conf/add_new': {
    controller: 'PrizeController',
    action: 'load_addinterface',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },

  },
  'POST /prize_conf/count': {
    controller: 'PrizeController',
    action: 'getPrizeConfCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /prize_conf/get_prize_smry': {
    controller: 'PrizeController',
    action: 'get_prize_smry',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /prize/configData': {
    controller: 'PrizeController',
    action: 'addConfirmData',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  //end of prize routing



  '/abuse/abuse_summery': {
     controller: 'SupportController',
     action: 'loadiinterface',
     cors: {
       origin: '*',
       headers: 'Content-Type, Authorization'
    },
  },
 'POST /abuse/count': {
    controller: 'SupportController',
    action: 'getAbuseCount',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
  'POST /abuse/get_abuse_smry': {
    controller: 'SupportController',
    action: 'get_abuse_smry',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
   'POST /abuse/details': {
    controller: 'SupportController',
    action: 'getAbuseDetails',
    cors: {
      origin: '*',
      headers: 'Content-Type, Authorization'
    },
  },
 




  //api routes


  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};
