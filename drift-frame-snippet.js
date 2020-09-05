/** Snippet for the iframe. Initializes the inner Drift iframe and acts as a communcation layer for the parent page. */

!function() {
  var SHIM_URL = "https://js.driftt.com/dist/shim-window-prod.js";
  function t() {
    t.__q.push(Array.prototype.slice.call(arguments));
  }
  t.__q = [];
  var i = window.drift = window.drift || t, n = [ "identify", "init", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on", "config" ];
  n.forEach(function(t) {
    i[t] || (i[t] = function() {
      i.apply(null, [ t ].concat(Array.prototype.slice.call(arguments)));
    });
  }), i.load = function(t) {
    var n = document.createElement("script");
    n.type = "text/javascript", n.async = !0, n.crossorigin = "anonymous", n.src = SHIM_URL;
    var e = document.getElementsByTagName("script")[0];
    e.parentNode.insertBefore(n, e), i.init(t);
  };
}();
drift.SNIPPET_VERSION = '1.0.0';

// rebroadcast drift widget API events to parent page
drift('on', 'iframeResize', function (data) {
  window.parent.postMessage({ type: 'driftIframeResize', data }, '*')
})

drift('on', 'bodyModalEnable', function (data) {
  window.parent.postMessage({ type: 'driftBodyModalEnable', data }, '*')
})

drift('on', 'bodyModalDisable', function (data) {
  window.parent.postMessage({ type: 'driftBodyModalDisable', data }, '*')
})

window.addEventListener('message', function (event) {
  if (event.source !== window.parent) {
    return
  }

  var message = event.data
  
  // set initial context, put widget in "iframeMode", load widget
  if (message && message.type === 'driftSetContext') {
    drift('setContext', message.data)
    drift('config', { iframeMode: true })
    drift('page')
    drift.load('icbxdngcx7ms') // TODO your Drift embed ID goes here
  }
  
  // acknowledge iframe resize / reposition is complete
  if (message && message.type === 'driftAcknowledgeIframeResize') {
    drift('acknowledgeIframeResize')
  }
})

// indicate iframe is ready to receive context
window.parent.postMessage({ type: 'driftIframeReady' }, '*')
