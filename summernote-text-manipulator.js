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
              if ($('.summernote-cleanerAlert').length > 0)$('.summernote-cleanerAlert').remove();
              if(selection == '') {
                if ($('.note-status-output').length > 0)
                  $('.note-status-output').html('<div class="summernote-cleanerAlert alert alert-danger">' + lang.textManipulator.noSelection + '</div>');
                else
                  $editor.find('.note-resizebar').append('<div class="summernote-cleanerAlert alert alert-danger" style="' + options.textManipulator.noteSatus + '">' + lang.textManipulator.noSelection + '</div>');
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
                        $('.note-status-output').html('<div class="summernote-cleanerAlert alert alert-danger">' + lang.textManipulator.noNumber + '</div>');
                      else
                        $editor.find('.note-resizebar').append('<div class="summernote-cleanerAlert alert alert-danger" style="' + options.textManipulator.noteSatus + '">' + lang.textManipulator.noNumber + '</div>');
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
function isNumeric(value) {
  return /^-{0,1}\d+$/.test(value);
}
function addSpace (match, letter, index) {
  if (index === 0 && !/[A-Z]/.test(letter)) {
    return letter.toUpperCase()
  }
  return ' ' + letter.toLowerCase()
}

function capitalize (str, lowercaseRest = false) {
  let rest = str.slice(1)
  rest = lowercaseRest ? rest.toLowerCase() : rest
  return str.charAt(0).toUpperCase() + rest
}

function formatDollar (num) {
  var p = parseFloat(num).toFixed(2).split(".");
  return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
    return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
  }, "") + "." + p[1];
}

function toWords (input) {
  var regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
  return input.match(regex);
}

function toCamelCase (inputArray) {
  let result = "";
  for(let i = 0 , len = inputArray.length; i < len; i++) {
    let currentStr = inputArray[i];
    let tempStr = currentStr.toLowerCase();
    if(i != 0) {
      tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
    }
    result +=tempStr;
  }
  return result;
}

function toCamelCaseString (input) {
  let words = toWords(input);
  return toCamelCase(words);
}
