//main.js - some simple javascript used for the image classification site
'use strict';

$('document').ready(function () {
  var transEffect = Barba.BaseTransition.extend({
    start: function start() {
      var _this2 = this;

      this.newContainerLoading.then(function (val) {
        return _this2.fadeInNewcontent(jQuery(_this2.newContainer));
      });
    },
    fadeInNewcontent: function fadeInNewcontent(nc) {
      nc.hide();
      var _this = this;
      $(this.oldContainer).fadeOut(300).promise().done(function () {
        nc.css('visibility', 'visible');
        nc.fadeIn(300, function () {
          _this.done();
        });
      });
    }
  });
  Barba.Pjax.getTransition = function () {
    return transEffect;
  };
  Barba.Pjax.start();
});