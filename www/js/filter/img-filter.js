app.filter('imgFilter', function() {
  return function(input) {
  	return input.replace(/<img/g, '<img ng-if="isImageShow"').replace(/src="\/\/images/g, 'src="http://images');
  };
});
