if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fun /*, thisp */) {
    "use strict";
    if (this === void 0 || this === null)
      throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t)
        fun.call(thisp, t[i], i, t);
    }
  };
}

canadaMap.partyNames = {
  'con': 'Conservative',
  'lib': 'Liberal',
  'ndp': 'New&nbsp;Democrat',
  'bq': 'Bloc&nbsp;Québécois',
  'grn': 'Green',
  'ind': 'Independent'
};

canadaMap.labelRiding = function(name, hash, year) {
  var oldParty = hash['2010'];
  var newParty = hash['2011'];
  try {
    var $riding = $('#' + name);
    var oldPartyName = canadaMap.partyNames[oldParty];
    var newPartyName = canadaMap.partyNames[newParty];
    var party = oldPartyName;
    if (year === '2011') {
      if (newPartyName !== oldPartyName) {
        party += '&nbsp;→&nbsp;' + newPartyName;
      } else {
        party += ' hold';
      }
    }
    $riding
      .removeClass()
      .addClass('riding ' + hash[year])
      .attr({ 'meta-data': hash.name + '<br>' + party });
  } catch(err) {}
};

canadaMap.labelRidings = function(year) {
  canadaMap.provinces.forEach(function(province) {
    for (var provinceName in province) {
      province[provinceName].forEach(function(riding) {
        for (var ridingName in riding) {
          canadaMap.labelRiding(ridingName, riding[ridingName], year);
        }
      })
    }
  });
};

canadaMap.updateHash = function(year) {
  var hash = window.location.hash;
  var newParam = 'show:' + year;
  if (hash && hash.indexOf('#!/') === 0) {
    var match = hash.match(/\b(show:\d*)\b/);
    if (match && match[1]) {
      hash = hash.replace(/\bshow:\d*\b/, newParam);
    } else {
      hash += '/' + newParam;
    }
  } else {
    hash = '#!/' + newParam;
  }
  window.location.hash = hash;
};

canadaMap.handleButtonFor = function($label) {
  var year = $label.find('input').val();
  canadaMap.labelRidings(year);
  $('label.selected').removeClass('selected');
  $label.addClass('selected');
  canadaMap.updateHash(year);
};

canadaMap.getYearFromHash = function() {
  var hash = window.location.hash;
  var match = hash.match(/\bshow:(\d{4})\b/);
  return match && match[1] || null;
};

canadaMap.resetYear = function() {
  var year = canadaMap.getYearFromHash();
  if (year) {
    $('.yearButton:checked').each(function() { this.checked = false; });
    $('.yearButton[value=' + year + ']').each(function() { this.checked = true; });
  }

  $('.yearButton:checked').click();
};

canadaMap.initialize = function() {
  $('.yearButtonLabel').click(function(e) {
    canadaMap.handleButtonFor($(this));
  })

  canadaMap.resetYear();

  $(window).bind('hashchange', function() { canadaMap.resetYear(); });

  $.fn.tipsy.defaults = {
    delayIn: 300,      // delay before showing tooltip (ms)
    delayOut: 0,     // delay before hiding tooltip (ms)
    fade: false,     // fade tooltips in/out?
    fallback: '',    // fallback text to use when no tooltip text
    gravity: 's',    // gravity
    html: true,     // is tooltip content HTML?
    live: false,     // use live event support?
    offset: 0,       // pixel offset of tooltip from element
    opacity: 0.75,    // opacity of tooltip
    title: 'meta-data',  // attribute/callback containing tooltip text
    trigger: 'hover' // how tooltip is triggered - hover | focus | manual
  };

  $('.riding').tipsy();
};

$(function() {
  window.setTimeout(function() {
    canadaMap.initialize();
  }, 250);
})