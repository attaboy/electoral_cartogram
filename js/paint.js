canadaMap.partyNames = {
  'con': 'Conservative',
  'lib': 'Liberal',
  'ndp': 'New Democrat',
  'bq': 'Bloc Québécois',
  'grn': 'Green',
  'ind': 'Independent'
};

function labelRiding(name, hash, year) {
  var party = hash[year];
  if (!party) {
    console.error(name + ': no party');
  } else {
    var $riding = $('#' + name);
    var partyName = canadaMap.partyNames[party] ? ' (' + canadaMap.partyNames[party] + ')' : '';
    $riding
      .removeClass()
      .addClass('riding ' + party)
      .attr({ title: hash.name + partyName });
  }
}

function labelRidings(year) {
  canadaMap.provinces.forEach(function(province) {
    for (var provinceName in province) {
      province[provinceName].forEach(function(riding) {
        for (var ridingName in riding) {
          labelRiding(ridingName, riding[ridingName], year);
        }
      })
    }
  });
}

$('.yearButton').click(function(e) {
  labelRidings(this.value);
  $('label.selected').removeClass('selected');
  $(this).closest('label').addClass('selected');
})

$('.yearButton:checked').click();

$.fn.tipsy.defaults = {
    delayIn: 600,      // delay before showing tooltip (ms)
    delayOut: 0,     // delay before hiding tooltip (ms)
    fade: false,     // fade tooltips in/out?
    fallback: '',    // fallback text to use when no tooltip text
    gravity: 'n',    // gravity
    html: false,     // is tooltip content HTML?
    live: false,     // use live event support?
    offset: 0,       // pixel offset of tooltip from element
    opacity: 0.75,    // opacity of tooltip
    title: 'title',  // attribute/callback containing tooltip text
    trigger: 'hover' // how tooltip is triggered - hover | focus | manual
};

$('.riding').tipsy();