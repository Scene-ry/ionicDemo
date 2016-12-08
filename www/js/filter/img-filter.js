app.filter('imgFilter', function() {
  return function(input) {
  	return input.replace(/<img/g, '<img ng-if="settings.isImageShow"').replace(/src="\/\//g, 'src="http://');
  };
});
