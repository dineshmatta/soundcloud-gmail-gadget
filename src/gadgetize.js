(function($){
  var methods = {
    updateHeight : function(options) {
      var height = 0;
      if( $('.sc-gadget a:visible').length > 0 ) {
        height += 15;
      }
      $('.sc-gadget li[data-sc-url]:visible').map(function(i, e){
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
        showDefault: 3,
        linePadding: 15
      }, options);

      /**
       * Iterates over each collection element
       */
      return this.each(function() {
        var $this = $(this);
        $this.append('<div class="body"><a href="" class="show">Show more</a><a href="">Hide</a></div>');
        $this.scWidgetify(options.urls, {
          callback: function(element, result) {
              var cnt = $('.sc-gadget li[data-sc-url]').length;
              if(cnt > options.showDefault) {
                element.hide();
                $('.sc-gadget a.show').html('Show ' + (cnt - options.showDefault) + ' more').show();
              }
              methods.updateHeight(options);
            }
          });

        $('.sc-gadget a').click( function() {
          $('.sc-gadget a').toggle()
          $('.sc-gadget li[data-sc-url]').slice(showDefault).slideToggle("fast", function(){
            methods.updateHeight(options);
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
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.scWidgetfiy' );
      return false;
    }
  };

})(jQuery);
