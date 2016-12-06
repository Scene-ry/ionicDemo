app.controller('indexCtrl', ['$scope', '$http', '$timeout', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', function($scope, $http, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

  $scope.mainPageSlider = 0;

  var tabItems = $('.tab-item');

  // get rss test
  $scope.rssUrl = window.localStorage['RssUrl'] || 'http://feed.cnblogs.com/news/rss';
  $scope.refreshRssList = function() {
    $.ajax({
      type: 'GET',
      url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent($scope.rssUrl),
      dataType: 'json',
      error: function() {
        alert("feed read failed.");
      },
      success: function(response) {
        //console.log(response.responseData.feed.entries);
        $scope.rssList = response.responseData.feed.entries;
        $scope.$apply();
      },
      complete: function() {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  // change color of tab icon when slider slides
  $scope.slideHasChanged = function(selectedIndex) {
    tabItems.each(function() {
      $(this).removeClass('idemo-selected');
    });
    tabItems.eq(selectedIndex).addClass('idemo-selected');

    // var bottomBarHeight = parseFloat($('.idemo-bottom').css('height'));
    // var currentSlideHeight = parseFloat($('.slider-slide:eq(' + selectedIndex + ')').css('height'));
    // var windowHeight = window.screen.height - bottomBarHeight - 11;

    // if (currentSlideHeight <= window.screen.height) {
    //   $('.slider').css({ 'maxHeight': windowHeight + 'px', 'marginBottom': '0' });
    // } else {
    //   $('.slider').css({ 'maxHeight': currentSlideHeight + 'px', 'marginBottom': '60px' });
    // }
  };


  // show switch rss popup
  $scope.showSwitchRssPrompt = function() {
    var url = prompt('输入RSS源网址:', $scope.rssUrl);
    if (url != null && url != '') {
      $scope.rssUrl = url;
      window.localStorage['RssUrl'] = url;
      $scope.refreshRssList();
    }
  };


  // switch slider when tab icon clicked
  tabItems.each(function(index) {
    $(this).click(function() {
      $ionicSlideBoxDelegate.slide(index);
    });
  });

  // initialize list
  $scope.refreshRssList();

}]);
