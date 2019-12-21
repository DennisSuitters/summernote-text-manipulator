# summernote-text-manipulator
A plugin for the [Summernote](https://github.com/summernote/summernote/) WYSIWYG editor.

Adds a dropdown to the Toolbar that contains various text manipulation options.

### Installation

#### 1. Include JS

Include the following code after including Summernote:

```html
<script src="summernote-text-manipulator.js"></script>
<script src="lang/[language-COUNTRY].js"></script>
```

#### 2. Supported languages

Supported languages can be found in the `lang` folder, and should be included after the plugin, then setting the chosen language when initialising Summernote.

#### 3. Summernote options
Finally, customize the Summernote Toolbar.

```javascript
$(document).ready(function() {
  $('#summernote').summernote({
    toolbar:[
      ['custom',['textmanipulator']], // The dropdown
      ['style',['style']],
      ['font',['bold','italic','underline','clear']],
      ['fontname',['fontname']],
      ['color',['color']],
      ['para',['ul','ol','paragraph']],
      ['height',['height']],
      ['table',['table']],
      ['insert',['media','link','hr']],
      ['view',['fullscreen','codeview']],
      ['help',['help']]
    ],
    textManipulator:{
      lang: 'en-US' // Change to your chosen language
    }
  });
});
```

#### 4. Check out our other Summernote Plugins via our main Github page.
- [Diemen Design](https://github.com/DiemenDesign/)
