angular.module('searchService', [])

.factory('Search', function ($http, $q) {

	var searchFactory = {};
	
	searchFactory.getAllTopics = function() {
		return $http.get('https://goat-stg.kamelio-api.com/api/v1/topics', {
			headers: {'X-KML-APP-TOKEN' : 'rk1g92xe0ub4fnid'}
		});
	};

	searchFactory.getAllSources = function() {
		return $http.get('https://goat-stg.kamelio-api.com/api/v1/sources', {
			headers: {'X-KML-APP-TOKEN' : 'rk1g92xe0ub4fnid'}
		});
	};

	searchFactory.getAllSourceGroup = function() {
		return $http.get('https://goat-stg.kamelio-api.com/api/v1/sourcegroups', {
			headers: {'X-KML-APP-TOKEN' : 'rk1g92xe0ub4fnid'}
		});
	}

	searchFactory.doSearch = function(searchData) {

		var data = (searchData);
		var config = {
			headers: {
				'Content-Type' : 'application/json',
				'X-KML-APP-TOKEN' : 'rk1g92xe0ub4fnid'
			}
		}

		return $http.post('https://goat-stg.kamelio-api.com/api/v1/contents.multitopics', data, config);
	}

	return searchFactory;

});