/*
 * SoundCloud Gmail Gadget
 * [https://github.com/soundcloudlabs/soundcloud-gmail-gadget](https://github.com/soundcloudlabs/soundcloud-gmail-gadget)
 *
 * Copyright 2012, SoundCloud Ltd., Tobias Bielohlawek
 *
 */
gadget = function ($) {
  // only act in Content Frame
  if (!window.frameElement || window.frameElement.id !== 'canvas_frame') {
    return;
  }

  var regexpURL =/(https?:\/\/)?(snd.sc\/[^\/]+|(www.)?soundcloud.com\/)[^ <'"\n]+/ig,
  locked = false,

  /**
   * Find urls and kick off attach process
   */
  init = function () {
    $('.ii.gt.adP.adO:not(.sc-checked)').each(function () {
      var matches = $(this).addClass('sc-checked').html().replace(/<\/?w?br>/g,"").match(regexpURL);
      if( matches && matches.length > 0 ) {
        $(this).parent().parent().find('.hi:first:empty').each( function () {
          $(this).gadgetize({
            showDefault: 1,
            showTitle: true,
            urls: matches
          });
        });
      }
    });
  },

  /**
   * Remove gadget in case the gmail gadget is loaded as well.
   */
  removeDuplicate = function () {
    $('.hi div:not(.sc-gadget)').parent().find('.sc-gadget').hide();
  };

  $(document).bind('DOMSubtreeModified', function () {
    // attach styling
    //we need to lock here, otherwise it'll be triggered by our own changes
    if(!locked) {
      locked = true;
      init();
      removeDuplicate();
      locked = false;
    }
  });
};
