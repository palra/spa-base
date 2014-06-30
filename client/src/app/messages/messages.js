/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'webapp.messages', [
  'ui.router',
  'ui.bootstrap',
  'webapp.filters',
  'ngResource'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'messagesList', {
    url: '/messages',
    views: {
      "main": {
        controller: 'MessagesListCtrl',
        templateUrl: 'messages/list.tpl.html'
      }
    },
    data:{ pageTitle: 'Messages' }
  });
  $stateProvider.state( 'messagesNew', {
    url: '/messages/new',
    views: {
      "main": {
        controller: 'MessagesNewCtrl',
        templateUrl: 'messages/form.tpl.html'
      }
    },
    data:{ pageTitle: 'New message' }
  });
  $stateProvider.state( 'messagesGet', {
    url: '/messages/:messageId',
    views: {
      "main": {
        controller: 'MessagesGetCtrl',
        templateUrl: 'messages/get.tpl.html'
      }
    },
    data:{ pageTitle: 'Messages' }
  });
  $stateProvider.state( 'messagesEdit', {
    url: '/messages/:messageId/edit',
    views: {
      "main": {
        controller: 'MessagesEditCtrl',
        templateUrl: 'messages/form.tpl.html'
      }
    },
    data:{ pageTitle: 'Messages' }
  });
})

.factory("Message", ['$resource', function($resource) {
  return $resource('/api/messages/:id', {}, {
    findAll: {
      method: 'GET',
      url: '/api/messages'
    },
    find: {
      method: 'GET'
    },
    edit: {
      method: 'PUT'
    },
    create: {
      method: 'POST',
      url: '/api/messages'
    },
    destroy: {
      method: 'DELETE'
    }
  });
}])

/**
 * And of course we define a controller for our route.
 */
.controller( 'MessagesListCtrl', function MessagesListCtrl( $scope, Message ) {
  $scope.pagination = {
    page: 1,
    byPage: 9,
    total: 0
  };

  $scope.loadMessages = function () {
    return Message.findAll({
      page: $scope.pagination.page,
      byPage: $scope.pagination.byPage
    }, function(data, headers) {
      $scope.pagination = data._meta;
      $scope.messages = data.data;
    });
  };

  $scope.messages = $scope.loadMessages();
})

.controller( 'MessagesNewCtrl', function MessagesNewCtrl( $scope, $rootScope, Message, $location ) {
  $scope.formTitle = 'New message';
  $scope.errors = {};

  $scope.sendMessage = function() {
    Message.create({}, {
      message: $scope.message,
      title: $scope.title
    }, function() {
      $location.path("/messages");
    }, function(data) {
      var error = data.data.data[0];
      if(error.code == "DB020") {
        $scope.errors = error.errors;
      } else {
        $rootScope.addFlash('warning',
          'Unexpected error '+error.code);
      }
    });
  };
})

.controller( 'MessagesEditCtrl', function MessagesNewCtrl( $scope, $rootScope, Message, $location, $stateParams ) {
  $scope.formTitle = 'Edit message';
  $scope.errors = {};

  Message.find({
    id: $stateParams.messageId
  }, function(data) {
    $scope.message = data.data[0].message;
    $scope.title = data.data[0].title;
    $scope.formTitle += ' #'+data.data[0]._id;
  }, function() {
    $location.path("/messages");
      $rootScope.addFlash('warning',
        'Message #'+$stateParams.messageId+' not found.');
  });
  
  $scope.sendMessage = function() {
    Message.edit({
      id: $stateParams.messageId
    }, {
      message: $scope.message,
      title: $scope.title
    }, function() {
      $location.path("/messages/"+$stateParams.messageId);
      $rootScope.addFlash('success',
        'Message #'+$stateParams.messageId+' sucessfully edited.');
    }, function(data) {
      var error = data.data.data[0];
      if(error.code == "DB020") {
        $scope.errors = error.errors;
      } else {
        $rootScope.addFlash('warning',
          'Unexpected error '+error.code);
      }
    });
  };
})

.controller( 'MessagesGetCtrl', function MessagesNewCtrl( $scope, $rootScope, Message, $stateParams, $location, $modal) {
  $scope.message = Message.find({
    id: $stateParams.messageId
  }, function(data) {
    $scope.message = data.data[0];
  }, function() {
    $location.path("/messages");
    $rootScope.addFlash('warning',
      'Message #'+$stateParams.messageId+' not found.');
  });

  $scope.edit = function() {
    $location.path("/messages/"+$stateParams.messageId+"/edit");
  };

  $scope.deleteModal = function() {
    var modal = $modal.open({
      templateUrl: 'messages/deleteModal.tpl.html',
      controller: function($scope, $modalInstance, message) {
        $scope.message = message;

        $scope.ok = function() {
          Message.destroy({
            id: message._id
          }, {}, function() {
            $modalInstance.close();
            $location.path("/messages");
            $rootScope.addFlash('success',
              'Message #'+$stateParams.messageId+' successfully deleted.');
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      },
      resolve: {
        message: function() {
          return $scope.message;
        }
      }
    });
  };

})
;

