app.controller('indexCtrl',
  function($scope,
           $http,
           $cordovaCamera,
           $cordovaFile,
           $cordovaImagePicker,
           $ionicActionSheet,
           $ionicPopup,
           $ionicSlideBoxDelegate,
           $ionicScrollDelegate) {

    $scope.mainPageSlider = 0;

    // bottom tab items
    var tabItems = $('.tab-item');

    // app settings
    $scope.settings = window.localStorage['idemo-settings'] ? JSON.parse(window.localStorage['idemo-settings']) : {
      avatarSrc: 'img/ionic.png',
      isImageShow: true,
      rssUrl: 'http://feed.cnblogs.com/news/rss',
      collections: []
    }
    var saveSettings = function() {
      window.localStorage['idemo-settings'] = JSON.stringify($scope.settings);
    }

    // show error message
    var showErrorMsg = function(errLoc, msg) {
      $ionicPopup.alert({
        title: '错误',
        template: errLoc + "<br>" + (msg.message ? msg.message : JSON.stringify(msg)) 
      });
    }

    // remove loading panel when finished
    var finishLoading = function() {
      $('ion-pane').css({ 'visibility': 'visible' });
      $('.idemo-loading-cover').removeClass('visible');
    }

    // get rss test
    $scope.refreshRssList = function() {
      $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=JSON_CALLBACK&q=' + encodeURIComponent($scope.settings.rssUrl))
        .success(function(response) {
          $scope.rssList = response.responseData.feed.entries;
        }).error(function() {
          alert("feed read failed.");
        }).finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          finishLoading();
        });


      // $http.jsonp('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'' + encodeURIComponent($scope.rssUrl) + '\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK')
      //   .success(function(response) {
      //     $scope.rssList = response.query.results.rss.channel.item;
      //   }).error(function() {
      //     alert("feed read failed.");
      //   }).finally(function() {
      //     $scope.$broadcast('scroll.refreshComplete');
      //     finishLoading();
      //   });

      // $http.jsonp('http://10x.222x.46x.15x/?url=' + $scope.settings.rssUrl + "&callback=JSON_CALLBACK")
      //   .success(function(response) {
      //     $scope.rssList = response.data;
      //   }).error(function() {
      //     alert("feed read failed.");
      //   }).finally(function() {
      //     $scope.$broadcast('scroll.refreshComplete');
      //     finishLoading();
      //   });

    };

    // change color of tab icon when slider slides
    $scope.slideHasChanged = function(selectedIndex) {
      tabItems.each(function() {
        $(this).removeClass('idemo-selected');
      });
      tabItems.eq(selectedIndex).addClass('idemo-selected');
    };

    // show switch rss popup
    $scope.showSwitchRssPrompt = function() {
      $ionicPopup.show({
        template: '<input type="text" ng-model="settings.rssUrl" placeholder="Enter address...">',
        title: '输入RSS源网址:',
        scope: $scope,
        buttons: [
          { text: '取消' },
          {
            text: '<b>保存</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.settings.rssUrl) {
                e.preventDefault();
              } else {
                return $scope.settings.rssUrl;
              }
            }
          }
        ]
      }).then(function(res) {
        if (res) {
          saveSettings();
          $scope.refreshRssList();
        }
      });
    };

    // copy image to cordova directory
    var copyImageAndSetAvatar = function(imageURI) {
      console.log("Image URI:" + imageURI);

      var lastSlashIndex = imageURI.lastIndexOf('/');
      var dirName = imageURI.substr(0, lastSlashIndex);
      var fileName = imageURI.substr(lastSlashIndex + 1);

      // var check = $cordovaFile.checkFile(cordova.file.dataDirectory, 'avatarrrr.jpg');
      // console.log("Check:" + JSON.stringify(check));

      $cordovaFile.copyFile(dirName, fileName, cordova.file.dataDirectory, 'avatar.jpg')
        .then(function(success) {
          console.log(JSON.stringify(success));
          $scope.settings.avatarSrc = success.nativeURL + "?rd=" + new Date().getTime();
          saveSettings();
        }, function(error) {
          showErrorMsg("copyImageAndSetAvatar", error);
        });

    };

    // open picture library
    var openPictureLib = function() {
      var options = {
        maximumImagesCount: 1,
        width: 100,
        height: 100,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          if (results.length > 0) {
            copyImageAndSetAvatar(results[0]);
          }
        }, function(error) {
          // error getting photos
          showErrorMsg("openPictureLib", error);
        });
    };

    // open camera to change user avatar
    var openCamera = function() {
      var options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        //console.log(imageURI);
        copyImageAndSetAvatar(imageURI);
      }, function(error) {
        // error
        //console.log(error);
        if (error.indexOf('Camera cancelled.') == -1) {
          showErrorMsg("openCamera", error);
        }
      });

      //$cordovaCamera.cleanup(); // only for FILE_URI
    };

    // popup to choose local pic or take photo
    $scope.showChangeAvatarPopup = function() {
      $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-image"></i>本地图片' },
          { text: '<i class="icon ion-camera"></i>拍照上传' }
        ],
        titleText: '修改头像',
        buttonClicked: function(index) {
          try {
            switch (index) {
              case 0:
                openPictureLib();
                break;
              case 1:
                openCamera();
                break;
              default:
                break;
            }
          } catch(e) {
            showErrorMsg("showChangeAvatarPopup", e);
            //throw e;
          }
          return true;
        }
      });
    };

    // show image or not
    $scope.isImageShowChange = function() {
      saveSettings();
    };

    // switch slider when tab icon clicked
    tabItems.each(function(index) {
      $(this).click(function() {
        if (index == 0 && $scope.mainPageSlider == 0) {
          $ionicScrollDelegate.scrollTop();
          return;
        }
        $ionicSlideBoxDelegate.slide(index);
      });
    });

    // initialize list
    $scope.refreshRssList();

  }
);
