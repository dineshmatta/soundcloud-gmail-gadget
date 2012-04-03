var self = require("self");

require("page-mod").PageMod({
  include : [ "https://mail.google.com/mail/u/*", "https://mail.google.com/mail/?ui=2&view=bsp*" ],
  contentScriptFile: [self.data.url("jquery-1.7.2.min.js"), self.data.url("sc-widgetify.js"), self.data.url("javascripts.js")],
  contentScript: "gadget(jQuery)",
  contentScriptWhen: 'end'
});

