var extractUrls = function() {
  if( (urls = document.location.href.split(/urls=/)[1]) ) {
    return urls.split(',');
  }
  return [];
}

jQuery(document).ready(function() {
  $("body").gadgetize({
    urls: extractUrls(),
    showTitle: false,
    showDefault: 1,
    updateHeightCallback: function(height) {
      console.log("Updated height to "+ height + "px");
    }
  });
});
