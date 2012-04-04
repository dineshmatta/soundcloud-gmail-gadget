jQuery(document).ready(function() {
  $(document.body).gadgetize({
    dataType: 'jsonp',
    urls: google.contentmatch.getContentMatches(),
    updateHeightCallback: function(height) {
      gadgets.window.adjustHeight(height);
    }
  });
});
