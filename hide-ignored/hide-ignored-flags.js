// ==UserScript==
// @name         Hide the Ignored
// @homepage     https://gist.github.com/Bhargav-Rao/fd4202b609b9610f2aeb3df350513be7
// @version      0.2
// @description  Hides those posts that you've already seen in the queue
// @author       bhargavrao
// @match        *://*.stackoverflow.com/admin/*
// @include      *://*.stackoverflow.com/admin/*
// @grant        none
// ==/UserScript==

(function() {
    $('.s-sidebarwidget:first').append('<div class="s-sidebarwidget--content sm:pt8 sm:pb8"><fieldset><div class="grid gs8 gsx"><div class="grid--cell"><input class="s-checkbox" id="hide-ignored" type="checkbox"></div><div class="grid--cell"><div class="s-label fw-normal"><span>Hide Ignored Posts</span><p class="js-toggle-apply-filters s-description sm:d-none">Hide posts that you have already visited</p></div></div></div></fieldset></div>')
    $('#hide-ignored').change(
            function(){
                if ($(this).is(':checked')) {
                    $(".visited-post").each(
                        function(index){
                            $(this).hide();
                        }
                    );
                }
                if ($(this).is(':checkbox:not(:checked)')) {
                    $(".visited-post").each(
                        function(index){
                            $(this).show();
                        }
                    );
                }
            });
})();
