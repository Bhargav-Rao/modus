// ==UserScript==
// @name         Hide the Ignored
// @namespace    http://bhargavrao.com
// @version      1.0
// @description  Hides those posts that you've already seen in the flag dashboard
// @author       bhargavrao
// @author       Glorfindel
// @match        *://*.stackexchange.com/admin/*
// @match        *://*.stackoverflow.com/admin/*
// @match        *://*.stackapps.com/admin/*
// @match        *://*.askubuntu.com/admin/*
// @match        *://*.superuser.com/admin/*
// @match        *://*.serverfault.com/admin/*
// @match        *://*.mathoverflow.net/admin/*
// @include      *://*.stackexchange.com/admin/*
// @include      *://*.stackoverflow.com/admin/*
// @include      *://*.stackapps.com/admin/*
// @include      *://*.askubuntu.com/admin/*
// @include      *://*.superuser.com/admin/*
// @include      *://*.serverfault.com/admin/*
// @include      *://*.mathoverflow.net/admin/*
// @grant        none
// ==/UserScript==

(function() {
  // Event handler
  let onChange = function(newValue) {
    // Remember value
    if (newValue) {
      window.localStorage.setItem("HideTheIgnored", true);
    } else {
      window.localStorage.removeItem("HideTheIgnored");
    }
    // Show/hide visited posts
    $(".visited-post").each(function(index) {
      if (newValue) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  };
  
  // Add checkbox and label
  let grid = $("input.js-toggle-apply-filters").parent().parent().parent();
  grid.append(`
                                <div class="grid gs8 gsx">
                                    <div class="grid--cell">
                                        <input class="s-checkbox hide-ignored" type="checkbox" id="hide-ignored">
                                    </div>
                                    <div class="grid--cell">
                                        <div class="s-label fw-normal">
                                            <label for="hide-ignored">Hide ignored posts</label>
                                            <p class="js-toggle-apply-filters s-description sm:d-none">Hide posts that you have already visited</p>
                                        </div>
                                    </div>
                                </div>`);  
  $("#hide-ignored").change(function() {
    onChange($(this).is(":checked"));
  });
  
  // Determine initial state
  if (window.localStorage.getItem("HideTheIgnored")) {
    $("#hide-ignored").prop("checked", true);
    onChange(true);
  }
})();