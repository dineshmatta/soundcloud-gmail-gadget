(function($){
  var styles = ' \
      div.sc-gadget { padding: 0 10px; font-size: 80%; font-family: arial, sans-serif; background: #F2F2F2; } \
      .sc-gadget .title { padding-top: 4px; margin-bottom: 8px; display: none;} \
      .sc-gadget ul { padding: 0; margin: 0; } \
      .sc-gadget li { list-style-type: none; padding: 0 0 10px 0; margin: 0; } \
      .sc-gadget a.show, .sc-gadget a.hide { color: #55688A; display: none; } \
      .sc-gadget a.settings { font-size: 80%; text-align: right; float: right; color: #55688A; } \
      div.sc-gadget a.settings { font-size: 100%; margin-top:-23px; } \
      div.sc-gadget br { display: none } \
      .sc-gadget .panel { \
        width: 100%; background: #F2F2F2; \
        -webkit-perspective: 1000px; \
        -moz-perspective: 1000px; \
      } \
      .sc-gadget .panel.flipped { height: 110px; } \
      .sc-gadget .panel .front { \
        position: absolute; z-index: 900; width: 100%; \
        -webkit-transform: rotateX(0deg); \
        -webkit-transform-style: preserve-3d; \
        -webkit-backface-visibility: hidden; \
        -moz-transform: rotateX(0deg); \
        -moz-transform-style: preserve-3d; \
        -moz-backface-visibility: hidden; \
        -o-transition: all .4s ease-in-out; \
        -ms-transition: all .4s ease-in-out; \
        -moz-transition: all .4s ease-in-out; \
        -webkit-transition: all .4s ease-in-out; \
        transition: all .4s ease-in-out; \
      } \
      .sc-gadget .panel.flipped .front { \
        -webkit-transform: rotateX(-180deg); \
        -moz-transform: rotateX(-180deg); \
      } \
      .sc-gadget .panel .back { \
        position: absolute; z-index: 800; width: 100%; background: #F2F2F2; \
        -webkit-transform: rotateX(180deg); \
        -webkit-transform-style: preserve-3d; \
        -webkit-backface-visibility: hidden; \
        -moz-transform: rotateX(180deg); \
        -moz-transform-style: preserve-3d; \
        -moz-backface-visibility: hidden; \
        -o-transition: all .4s ease-in-out; \
        -ms-transition: all .4s ease-in-out; \
        -moz-transition: all .4s ease-in-out; \
        -webkit-transition: all .4s ease-in-out; \
        transition: all .4s ease-in-out; \
      } \
      .sc-gadget .panel.flipped .back { \
        z-index: 1000; \
        -webkit-transform: rotateX(0deg); \
        -moz-transform: rotateX(0deg); \
      } \
      .sc-gadget .panel .back .settings { \
        padding: 5px; \
      } \
      .sc-gadget .panel .back ul { \
        padding: 5px 0 15px 20px; \
      } \
      .sc-gadget .panel .back li { \
        padding: 0; \
        padding-right: 10px; \
        display: inline; \
      } \
      .sc-gadget .panel .back label { \
        padding-left: 5px; \
      }',
    methods = {
    updateHeight : function($output, options) {
      var height = 0;
      $output.find('li[data-sc-url]:visible').map(function(i, e){
        height += $(e).data('sc-height') + options.linePadding;
      });
      if(height > 0) {
        $output.find('.panel,.panel .back').css("height", height);
      };
      if($output.find('a.show:visible,a.hide:visible').length > 0) {
        height += 20;
      };
      if($.isFunction(options.updateHeightCallback)) {
        options.updateHeightCallback(height);
      };
    },

    /**
     * Main function, iterate over given urls and load & append a widget
     */
    init : function( options ) {
      options = $.extend(true, {
        urls:            [],
        showTitle:       false,
        showDefault:     $.jStorage.get("sc:showDefault", 3),
        linePadding:     15,
        dataType:        'json',
        showComments:    $.jStorage.get("sc:showComments", true),
        resolveUser:     $.jStorage.get("sc:resolveUser", true),
        resolveTrack:    $.jStorage.get("sc:resolveTrack", true),
        resolveGroup:    $.jStorage.get("sc:resolveGroup", true),
        resolvePlaylist: $.jStorage.get("sc:resolvePlaylist", true),
        // resolve:         $.jStorage.get("sc:resolve", ['user', 'track', 'group', 'set']),
      }, options);

      /**
       * Iterates over each collection element
       */
      return this.each(function() {
        var $output = $(this);

        $output.append('<style>' + styles + '</style>');

        if (options.showTitle) {
          $output = $('<div class="sc-gadget"><div class="title"><b>SoundCloud</b> - Sounds from this email</div></div>').appendTo($output);
        }

        $output.append('<a class="settings" href="#">settings</a><br>');
        $output.find('a.settings').click( function() {
          $panel.toggleClass('flipped');
        });

        var $panel = $('<div class="panel"></div>').appendTo($output),
        $front = $('<div class="front"></div>').appendTo($panel),
        $back = $('<div class="back">\
          <div class="settings">\
            <b>Show SoundCloud Widget for:</b><br> \
            <ul> \
             <li><input type="checkbox" ' + (options.resolveUser     ? 'checked' : '') + ' id="resolveUser" ><label for="resolveUser">User</label></li> \
             <li><input type="checkbox" ' + (options.resolveTrack    ? 'checked' : '') + ' id="resolveTrack"><label for="resolveTrack">Track</label></li> \
             <li><input type="checkbox" ' + (options.resolvePlaylist ? 'checked' : '') + ' id="resolvePlaylist" ><label for="resolvePlaylist">Set</label></li> \
             <li><input type="checkbox" ' + (options.resolveGroup    ? 'checked' : '') + ' id="resolveGroup"><label for="resolveGroup">Group</label></li> \
            </ul> \
            <b>Show Comments:</b><br> \
            <ul> \
              <li><input type="checkbox" ' + (options.showComments ? 'checked' : '') + ' id="showComments"><label for="showComments">yes</label></li> \
            </ul> \
          </div> \
        </div>').appendTo($panel);

        $front.append('<a href="#" class="show">Show more</a><a href="#" class="hide">Hide</a>');
        $front.find('a.show,a.hide').click( function() {
          $front.find('a.show,a.hide').toggle();
          $front.find('li[data-sc-url]').slice(options.showDefault).slideToggle("fast", function(){
            methods.updateHeight($output, options);
          });
        });

        $front.scWidgetify(options.urls, {
          https:           true,
          showComments:    options.showComments,
          resolveUser:     options.resolveUser,
          resolveTrack:    options.resolveTrack,
          resolveGroup:    options.resolveGroup,
          resolvePlaylist: options.resolvePlaylist,
          resolve:         options.resolve,
          dataType:        options.dataType,
          callback: function(element, result) {
            var cnt = $front.find('li[data-sc-url]').length;
            $output.find('.title').show();
            if(cnt > options.showDefault) {
              element.hide();
              $front.find('a.show').html('Show ' + (cnt - options.showDefault) + ' more').show();
              $front.find('a.hide').hide();
            }
            methods.updateHeight($output, options);
          }
        });

        $back.find('input').click( function() {
          var $this = $(this);
          $.jStorage.set('sc:' + $this.attr('id'), $this.is(':checked'));
        });
      });
    }
  };

  /**
   * Plugin scope, check if function exits, fallback to main function
   * this is mainly done to be able to test internal functions
   */
  $.fn.gadgetize = function( method ) {
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if (typeof method === 'object') {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.scWidgetfiy' );
      return false;
    }
  };

})(jQuery);
