angular.module( 'webapp.filters', [] )

.filter( 'trim', function() {
	return function(input, length, complete) {
		if(input.length <= length) {
			return input;
		} else {
			return input.slice(0,length) + ((complete === undefined) ? "..." : complete);
		}
	};
})

;

