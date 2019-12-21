/* https://github.com/DiemenDesign/summernote-text-manipulator */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'],factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
}(function ($) {
  $.extend(true, $.summernote.lang, {
    'en-US': {
      textManipulator: {
        tooltip: 'Text Manipulator',
        currency: '$',
        noSelection: 'No Text Selected to Manipulate!',
        noNumber: 'Selection is NOT a Number!',
      }
    }
  });
  $.extend($.summernote.options, {
    textManipulator: {
      icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="12" height="12"><path d="M 12,1 2,1 2,4 2.9995,4 C 2.9995,3.413 3.198,2.5 4,2.5 l 2,0 0,8.437 C 6,11.524 5.5875,12 5,12 l -0.5,0 0,1 4.9995,0 0,-1 L 9,12 C 8.413,12 8,11.524 8,10.937 L 8,2.5 l 2,0 c 0.8245,0 1.01,0.913 1.01,1.5 L 12,4 12,1 Z"/></svg></i> ',
      noteSatus: 'position:absolute;top:0;left:0;right:0',
      menu: [
        'camelCase',
        'Currency',
        'Humanize',
        'lowercase',
        'Reverse',
        'Titleize',
        'UPPERCASE',
      ]
    }
  });
  $.extend($.summernote.plugins, {
    'textManipulator': function(context) {
      var ui        = $.summernote.ui,
          $note     = context.layoutInfo.note,
          options   = context.options,
          lang      = options.langInfo;
      context.memo('button.textManipulator', function () {
        var button = ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: options.textManipulator.icon,
            tooltip: lang.textManipulator.tooltip,
            container: 'body',
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdown({
            className: 'dropdown-template',
            items: options.textManipulator.menu,
            click: function (e) {
              var $button = $(e.target);
              var menuSelect = $button.data('value');
              e.preventDefault();
              var selection = $note.summernote('createRange').toString();
              if ($('.summernote-textManipulatorAlert').length > 0)$('.summernote-textManipulatorAlert').remove();
              if(selection == '') {
                if ($('.note-status-output').length > 0)
                  $('.note-status-output').html('<div class="summernote-textManipulatorAlert alert alert-danger">' + lang.textManipulator.noSelection + '</div>');
                else
                  $editor.find('.note-resizebar').append('<div class="summernote-textManipulatorAlert alert alert-danger" style="' + options.textManipulator.noteSatus + '">' + lang.textManipulator.noSelection + '</div>');
              } else {
                switch (menuSelect){
                  case 'camelCase':
                    var modded = toCamelCaseString(selection);
                  break;
                  case 'Currency':
                    if (isNumeric(selection)){
                      var modded = lang.textManipulator.currency + formatDollar(selection);
                    } else {
                      var modded = 'textManipulatorError';
                      if ($('.note-status-output').length > 0)
                        $('.note-status-output').html('<div class="summernote-textManipulatorAlert alert alert-danger">' + lang.textManipulator.noNumber + '</div>');
                      else
                        $editor.find('.note-resizebar').append('<div class="summernote-textManipulatorAlert alert alert-danger" style="' + options.textManipulator.noteSatus + '">' + lang.textManipulator.noNumber + '</div>');
                    }
                  break;
                  case 'Humanize':
                    var mod = selection.replace(/[_-]+([a-zA-Z])/g, addSpace).replace(/([A-Z])/g, addSpace);
                    var modded = capitalize(mod);
                  break;
                  case 'lowercase':
                    var modded = selection.toLowerCase();
                  break;
                  case 'Reverse':
                    var modded = selection.split("").reverse().join("");
                  break;
                  case 'Titleize':
                    var modded = selection.replace(/[^\s+|^-]+/g, (word) => { return capitalize(word, true);});
                  break;
                  case 'UPPERCASE':
                    var modded = selection.toUpperCase();
                  break;
                }
                if(modded != 'textManipulatorError') $note.summernote('insertText', modded);
              }
            }
          })
        ]);
        return button.render();
      });
    }
  });
}));

/* Various String Helper Functions found in various places */
function isNumeric(v) {
  return /^-{0,1}\d+$/.test(v);
}

function addSpace (m, l, i) {
  if (i === 0 && !/[A-Z]/.test(l)) return l.toUpperCase();
  return ' ' + l.toLowerCase();
}

function capitalize (str, lR = false) {
  var r = str.slice(1);
  r = lR ? r.toLowerCase() : r;
  return str.charAt(0).toUpperCase() + r;
}

function formatDollar (n) {
  var p = parseFloat(n).toFixed(2).split(".");
  return p[0].split("").reverse().reduce(function(a, n, i, orig) {
    return  n=="-" ? a : n + (i && !(i % 3) ? "," : "") + a;
  }, "") + "." + p[1];
}

function toWords (i) {
  var r = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
  return i.match(r);
}

function toCamelCase (iA) {
  var r = "";
  for(let i = 0 , l = iA.length; i < l; i++) {
    var cS = iA[i];
    var tS = cS.toLowerCase();
    if(i != 0) tS = tS.substr(0, 1).toUpperCase() + tS.substr(1);
    r += tS;
  }
  return r;
}

function toCamelCaseString (i) {
  var w = toWords(i);
  return toCamelCase(w);
}
