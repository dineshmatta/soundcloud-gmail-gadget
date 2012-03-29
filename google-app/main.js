jQuery(document).ready(function() {
  $(document.body).gadgetize({
    urls: google.contentmatch.getContentMatches(),
    updateHeightCallback: function(height) {
      gadgets.window.adjustHeight(height);
    }
  });
});
