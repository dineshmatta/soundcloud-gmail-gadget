jQuery(document).ready(function() {
  $(document.body).gadgetize({
    dataType: 'jsonp',
    showDefault: 1,
    urls: google.contentmatch.getContentMatches(),
    updateHeightCallback: function(height) {
      gadgets.window.adjustHeight(height);
    }
  });
});
