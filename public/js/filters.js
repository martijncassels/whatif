'use strict';

/* Filters */

angular.module('whatif.filters', [])
.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]
)
.filter('highlight', function($sce) {
    return function(text, searchvalue) {
      if (searchvalue) text = text.replace(new RegExp('('+searchvalue+')', 'gi'),
        '<strong>$1</strong>'
      )
      return $sce.trustAsHtml(text)
    }
  }
)
;
