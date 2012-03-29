/*
 * SoundCloud Gmail Gadget
 * [https://github.com/soundcloudlabs/soundcloud-gmail-gadget](https://github.com/soundcloudlabs/soundcloud-gmail-gadget)
 *
 * Copyright 2012, SoundCloud Ltd., Tobias Bielohlawek
 *
 */
gadget = function ($, styleUrl) {
  // only act in Conent Frame
  if (!window.frameElement || window.frameElement.id !== 'canvas_frame') {
    return;
  }

  // attach styling
  $('<link rel="stylesheet" type="text/css" />').attr('href', styleUrl).appendTo($('head'));

  var regexpURL =/(https?:\/\/)?(snd.sc\/[^\/]+|(www.)?soundcloud.com\/)[^ <'"\n]+/ig,
  locked = false,

  /**
   * Attach the gadget
   */
  attachGadget = function ($player) {
    $player.append( $('<div class="sc-gadget"><div class="title"><b>SoundCloud</b> - Sounds from this email</div>') );
    $('<div></div>').appendTo($player).gadgetize({
      urls: matches
    });
  },

  /**
   * Find urls and kick off attach process
   */
  init = function () {
    $('.ii.gt:not(.sc-checked)').each(function () {
      if( (matches = $(this).addClass('.sc-checked').html().match(regexpURL)) && matches.length > 0 ) {
        $(this).parent().parent().find('.hi:first:empty').each( function () {
          attachGadget($(this));
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
    //we need to lock here, otherwise it'll be triggered by our own changes
    if(!locked) {
      locked = true;
      init();
      removeDuplicate();
      locked = false;
    }
  });
};
