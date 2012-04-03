(function($){
  var methods = {
    updateHeight : function($output, options) {
      var height = 0;
      if($output.find('a:visible').length > 0) {
        height += 15;
      }
      $output.find('li[data-sc-url]:visible').map(function(i, e){
        height += $(e).data('sc-height') + options.linePadding;
      });
      if($.isFunction(options.updateHeightCallback)) {
        options.updateHeightCallback(height)
      }
    },

    /**
     * Main function, iterate over given urls and load & append a widget
     */
    init : function( options ) {
      options = $.extend(true, {
        urls: [],
        addTitle: false,
        showDefault: 3,
        linePadding: 15,
        dataType: 'json',
      }, options);

      /**
       * Iterates over each collection element
       */
      return this.each(function() {
        var $output = $(this);

        if (options.addTitle) {
          $('<style>div.sc-gadget { padding: 0 10px; background: #F2F2F2; } .sc-gadget .title { font-size: 80%; padding-top: 8px; margin-bottom: 4px; display: none;} .sc-gadget ul { padding: 0; margin: 0; } .sc-gadget li { list-style-type: none; padding: 0 0 10px 0; margin: 0; } .sc-gadget a { font-size: 80%; color: #55688A; display: none; } </style>').appendTo($output);
          $output = $('<div class="sc-gadget"><div class="title"><b>SoundCloud</b> - Sounds from this email</div></div>').appendTo($output);
          //$output = $('<div />').appendTo($output);
        };

        $output.append('<div class="body"><a href="#" class="show">Show more</a><a href="#">Hide</a></div>');
        $output.scWidgetify(options.urls, {
          https: true,
          dataType: options.dataType,
          callback: function(element, result) {
            var cnt = $output.find('li[data-sc-url]').length;
            $output.find('.title').show();
            if(cnt > options.showDefault) {
              element.hide();
              $output.find('a.show').html('Show ' + (cnt - options.showDefault) + ' more').show();
            }
            methods.updateHeight($output, options);
          }
        });

        $output.find('a').click( function() {
          $output.find('a').toggle()
          $output.find('li[data-sc-url]').slice(options.showDefault).slideToggle("fast", function(){
            methods.updateHeight($output, options);
          });
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
