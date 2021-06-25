// ==UserScript==
// @name         Hide the Ignored
// @namespace    http://bhargavrao.com
// @version      1.1
// @description  Hides those posts that you've already seen in the flag dashboard
// @author       bhargavrao
// @author       Glorfindel
// @match        *://*.stackexchange.com/admin/dashboard
// @match        *://*.stackoverflow.com/admin/dashboard
// @match        *://*.stackapps.com/admin/dashboard
// @match        *://*.askubuntu.com/admin/dashboard
// @match        *://*.superuser.com/admin/dashboard
// @match        *://*.serverfault.com/admin/dashboard
// @match        *://*.mathoverflow.net/admin/dashboard
// @include      *://*.stackexchange.com/admin/dashboard
// @include      *://*.stackoverflow.com/admin/dashboard
// @include      *://*.stackapps.com/admin/dashboard
// @include      *://*.askubuntu.com/admin/dashboard
// @include      *://*.superuser.com/admin/dashboard
// @include      *://*.serverfault.com/admin/dashboard
// @include      *://*.mathoverflow.net/admin/dashboard
// @grant        none
// ==/UserScript==

// keys for window.localStorage
const storageKeyToggle = "HideTheIgnored", storageKeyPostIDs = "HideTheIgnored-PostIDs";

(function() {
  // set of post IDs which are explicitly ignored (without visiting them)
  var ignoredPostIDs;
  
  // Event handler for master toggle
  let onChange = function(newValue) {
    // Remember value
    if (newValue) {
      window.localStorage.setItem(storageKeyToggle, true);
    } else {
      window.localStorage.removeItem(storageKeyToggle);
    }
    // Show/hide visited and ignored posts
    $("div.js-flagged-post").each(function() {
      let postID = $(this).attr("data-post-id");
      if (!$(this).hasClass("visited-post") && !ignoredPostIDs.has(postID))
        return;
      if (newValue) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  };
  
  // Add checkbox and label 'Ignore' to each post
  $("div.js-flagged-post").each(function() {
    let postID = $(this).attr("data-post-id");
    let header = $(this).find("a.js-post-title-link").parent().parent();
    if (header.children().length == 1) {
      // no 'viewed by' container yet
      header.append('<div class="grid--cell js-hide-on-delete ml4"></div>');
    }
    $(header.children()[1]).append(`
                                <div class="grid gs8 gsx jc-end">
                                    <div class="grid--cell">
                                        <input class="s-checkbox ignore-post" type="checkbox" id="ignore-` + postID + `" data-post-id="` + postID + `">
                                    </div>
                                    <div class="grid--cell">
                                        <div class="s-label fw-normal">
                                            <label for="ignore-` + postID + `">Ignore</label>                                            
                                        </div>
                                    </div>
                                </div>`);    
  })
  // Add event handler for those
  $(".ignore-post").change(function() {
    let postID = $(this).attr("data-post-id");
    let newValue = $(this).is(":checked");
    if (newValue) {
      ignoredPostIDs.add(postID);
      if ($("#hide-ignored").is(":checked")) {
        // Hide the post immediately
        $(this).parents(".js-flagged-post").hide();
      }
    } else {
      ignoredPostIDs.delete(postID);
    }
    // Remember this
    window.localStorage.setItem(storageKeyPostIDs, [...ignoredPostIDs].join());
  });
  
  // Add checkbox and label to sidebar widget
  let grid = $("input.js-toggle-apply-filters").parents("fieldset");
  grid.append(`
                                <div class="grid gs8 gsx">
                                    <div class="grid--cell">
                                        <input class="s-checkbox hide-ignored" type="checkbox" id="hide-ignored">
                                    </div>
                                    <div class="grid--cell">
                                        <div class="s-label fw-normal">
                                            <label for="hide-ignored">Hide ignored posts</label>
                                            <p class="s-description sm:d-none">Hide posts that you have already visited or ignored</p>
                                        </div>
                                    </div>
                                </div>`);  
  $("#hide-ignored").change(function() {
    onChange($(this).is(":checked"));
  });
  
  // Determine initial state of ignore checkboxes
  ignoredPostIDs = window.localStorage.getItem(storageKeyPostIDs) == null ? new Set()
    : new Set(window.localStorage.getItem(storageKeyPostIDs).split(","));
  for (let postID of ignoredPostIDs) {
    if ($("#ignore-" + postID).length == 0) {
      // post no longer flagged, forget about it
      ignoredPostIDs.delete(postID);  
    } else {
      $("#ignore-" + postID).prop("checked", true);
    }
  }
  window.localStorage.setItem(storageKeyPostIDs, [...ignoredPostIDs].join());

  // Determine initial state of master toggle
  if (window.localStorage.getItem(storageKeyToggle)) {
    $("#hide-ignored").prop("checked", true);
    onChange(true);
  }
})();