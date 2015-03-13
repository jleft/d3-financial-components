/* global $ */
(function($) {
    'use strict';

    var $sideBar = $('.sidebar-nav');

    $('body').scrollspy({
        target: '.sidebar-nav'
    });
    $('window').on('load', function() {
        $('body').scrollspy('refresh');
    });

    $('.sidebar-nav').affix({
        offset: {
            top: function() {
                var offsetTop      = $sideBar.offset().top;
                var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10);
                var navOuterHeight = $('.navbar').height();
                return (this.top = offsetTop - navOuterHeight - sideBarMargin);
                // return (this.top = $('.navbar').outerHeight(true));
            },
            bottom: 0
        }
    });

}($));