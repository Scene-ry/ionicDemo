app.filter('imgSrcFilter', function() {
  return function(input) {
  	return input.replace(/src="\/\/images/g, 'src="http://images');
  };
});
