(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sf = require('javascript-stringify');
var GitHub = require('github-api');

var config = {
    username: 'goddess-salsas',
    password: 'G0dde55Salsas', // Either your password or an authentication token if two-factor authentication is enabled
    // auth: 'basic',
    token: '88b26e42178af38410b46731be19216132792cb2',
    repository: 'goddess-salsas.github.io',
    branchName: 'master'
};
var gitHub = new GitHub(config);
const repository = gitHub.getRepo(config.username, config.repository);

/**
 * Reads the content of the file provided. Returns a promise whose resolved value is an object literal containing the
 * name (<code>filename</code> property) and the content (<code>content</code> property) of the file.
 *
 * @param {File} file The file to read
 *
 * @returns {Promise}
 */
function readFile(file) {
   return new Promise(function (resolve, reject) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function (event) {
         var content = event.target.result;

         // Strip out the information about the mime type of the file and the encoding
         // at the beginning of the file (e.g. data:image/gif;base64,).
         content = atob(content.replace(/^(.+,)/, ''));

         resolve({
            filename: file.name,
            content: content
         });
      });

      fileReader.addEventListener('error', function (error) {
         reject(error);
      });

      fileReader.readAsDataURL(file);
   });
}
/**
 * uploads a single file
 *
 * @param {*} fileName once stored
 * @param {*} content file content
 * @param {*} folder storage folder within repository
 * @param {*} commitReason
 */
function uploadFile(fileName, content, folder, commitReason) {
    return new Promise(function (resolve, reject) {
        var repository = gitHub.getRepo(config.username, config.repository);
        repository.write(
            'master', // e.g. branch name
            folder + fileName, // e.g. 'path/to/file'
            content, // e.g. 'Hello world, this is my new content'
            commitReason, // e.g. 'Created new index'
            function(err) {
                if (err) {
                   reject(err);
                } else {
                   resolve(true);
                }
             }
        );
    });
}
/**
 * Save the files provided on the repository with the commit title specified. Each file will be saved with
 * a different commit.
 *
 * @param {FileList} files The files to save
 * @param {string} commitTitle The commit title
 *
 * @returns {Promise}
 */
function uploadFiles(files, commitTitle, folder) {
   // Creates an array of Promises resolved when the content
   // of the file provided is read successfully.
   var filesPromises = [].map.call(files, readFile);

   return Promise
      .all(filesPromises)
      .then(function(files) {
         return files.reduce(
            function(promise, file) {
               return promise.then(function() {
                  // Upload the file on GitHub
                  return saveFile({
                     repository: repository,
                     branchName: config.branchName,
                     filename: folder + file.filename,
                     content: file.content,
                     commitTitle: commitTitle
                  });
               });
            },
            Promise.resolve()
         );
      });
}
/**
 * Update a file of the repository (or create a new if it didn't exist). The method returns a Promise that,
 * when resolved returns the repository object. This is the same as the <code>repository</code> property of the
 * <code>data</code> parameter.
 *
 * @param {Object} data An object containing the data to update (or create) the new file. The object must contain
 * the following properties:
 * - {string} <code>branchName</code>: The name of the branch in which the file should be updated (or create)
 * - {string} <code>commitTitle</code>: The commit message for the change
 * - {string} <code>content</code>: The content of the file
 * - {string} <code>filename</code>: The path of the file to update (or create)
 * - {Object} <code>repository</code>: The object representing the repository to update
 *
 * @returns {Promise}
 */
function saveFile(data) {
    return new Promise(function(resolve, reject) {
       data.repository.write(
          data.branchName,
          data.filename,
          data.content,
          data.commitTitle,
          function(err) {
             if (err) {
                reject(err);
             } else {
                resolve(data.repository);
             }
          }
       );
    });
}

function uploadProducts(json) {
    var js = generateJS(json, 'products');
    uploadFile('products.js', js, 'js/', 'updated products from Admin Console')
    .then(function() {
        displayMessage("Products uploaded to site");
     })
     .catch(function(err) {
        console.error(err);
        displayMessage("Something went wrong, please try again.");
     });
}
function uploadJSFile(json, objName, fileName, folder, commitComment) {
   var js = generateJS(json, objName);
   uploadFile(fileName, js, folder + '/', commitComment)
   .then(function() {
       displayMessage(objName + " uploaded to site at " + folder + '/' + filename);
    })
    .catch(function(err) {
       console.error(err);
       displayMessage("Something went wrong, please try again.");
    });
}
function uploadJSONFile(json, objName, fileName, folder, commitComment) {
   var js = 'var ' + objName + ' = `' + json + '`;';
   uploadFile(fileName, js, folder + '/', commitComment)
   .then(function() {
       displayMessage(objName + " uploaded to site at " + folder + '/' + filename);
    })
    .catch(function(err) {
       console.error(err);
       displayMessage("Something went wrong, please try again.");
    });
}
function displayMessage(msg) {
    var message = document.querySelector("#message");
    if (message) {
        message.innerHTML = msg;
    }
    var statusMessage = document.querySelector(".status_message");
    if (statusMessage) {
        statusMessage.style.display = "block";
    }
    setTimeout(function () {
        statusMessage.style.display='none';
    }, 10000);
    return false;
}
function uploadSingleImage(file) {
    var files = [];
    var commitTitle = "uploaded image via Admin Console";
    var folder = "images/";
    files.push(file);
    uploadFiles(files, commitTitle, folder)
        .then(function() {
            displayMessage("Image uploaded to site");
        })
        .catch(function(err) {
            console.error(err);
            displayMessage("Something went wrong, please try again.");
        });
}
function generateJS(jsonText, objName) {
    var result = '';
    var spaces = 4;
    var text = sf.stringify(JSON.parse(jsonText), null, spaces);
    result = 'var ' + objName + ' = ' + text;
    return result;
}
function buildSitePages() {
   // first 9 pages are the base static pages
   var nextProductId = 10;
   var newPages = site.filter((p) => p.id < 10);
   products.forEach((p) => {
       var newSitePage = {};
       newSitePage.id = nextProductId;
       newSitePage.name = p.name;
       newSitePage.page = 'single-product.html?id=' + p.id;
       newSitePage.text = p.name + ' ' + p.desc_short + ' ' + p.desc_long;
       newPages.push(newSitePage);
       nextProductId++;
   });
   blogs.forEach((b) => {
       var newSitePage = {};
       newSitePage.id = nextProductId;
       newSitePage.name = b.title; 
       newSitePage.page = 'blog-post.html?id=' + b.id;
       newSitePage.text = b.title + ' ' + b.description + ' ' + b.content;
       newPages.push(newSitePage);
       nextProductId++;
   });
   return newPages();
}
function buildSearchIndexJSON(pages) {
   var newIDX = '';
   const lunrIDX = lunr(function() {
       this.field("name");
       this.field("text");
   
       for (let i = 0; i < site.length; i++) {
       this.add(site[i]);
       }
   });
   newIDX = JSON.stringify(idx);
   return newIDX;
}
function updateSearch() {
   var updatedSitePages = buildSitePages();
   var searchIndexJSON = buildSearchIndexJSON(updatedSitePages);
}

document.querySelector('#uploadImages_btn').addEventListener('click', function (event) {
    event.preventDefault();
    var files = document.getElementById('imageFiles').files;
    var commitTitle = 'updated via Admin Console';
    uploadFiles(files, commitTitle, 'images/')
    .then(function() {
        displayMessage("Image(s) uploaded to site");
     })
     .catch(function(err) {
        console.error(err);
        displayMessage("Something went wrong, please try again.");
     });
 });
 
document.querySelector('#save_json').addEventListener('click', function (event) {
    event.preventDefault();
    var productsJSON = JSON.stringify(products);
    uploadProducts(productsJSON);
    var pages = buildSitePages();
    var sitePagesJSON = JSON.stringify(pages);
    uploadJSFile(sitePagesJSON, 'site', 'site-pages.js', 'js', 'updated via Admin Console');
    var indexJSON = buildSearchIndexJSON(pages);
    uploadJSONFile(indexJSON, 'searchIDX', 'search-index.js', 'js', 'updated via Admin Console');
 });

document.addEventListener('change',function(event){
    var target = event.srcElement || event.target;
    if(target && target.classList.contains('uploadFile')){
        var files = !!target.files ? target.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
        if (/^image/.test( files[0].type)){ // only image file
            uploadSingleImage(files[0]);
        } 

    }
});

},{"github-api":6,"javascript-stringify":10}],2:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":2,"ieee754":7,"isarray":5}],5:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],6:[function(require,module,exports){
/*!
 * @overview  Github.js
 *
 * @copyright (c) 2013 Michael Aufreiter, Development Seed
 *            Github.js is freely distributable.
 *
 * @license   Licensed under BSD-3-Clause-Clear
 *
 *            For all details and documentation:
 *            http://substance.io/michael/github
 */

(function (root, factory) {
   // UMD boilerplate from https://github.com/umdjs/umd/blob/master/returnExportsGlobal.js
   'use strict';

   /* istanbul ignore next */
   if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['xmlhttprequest', 'js-base64'], function (XMLHttpRequest, b64encode) {
         return (root.Github = factory(XMLHttpRequest.XMLHttpRequest, b64encode.Base64.encode));
      });
   } else if (typeof module === 'object' && module.exports) {
      if (typeof window !== 'undefined') { // jscs:ignore
         module.exports = factory(window.XMLHttpRequest, window.btoa);
      } else { // jscs:ignore
         module.exports = factory(require('xmlhttprequest').XMLHttpRequest, require('js-base64').Base64.encode);
      }
   } else {
      // Browser globals
      var b64encode = function(str) {
         return root.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
         }));
      };

      root.Github = factory(root.XMLHttpRequest, b64encode);
   }
}(this, function (XMLHttpRequest, b64encode) {
   'use strict';

   // Initial Setup
   // -------------

   var Github = function(options) {
      var API_URL = options.apiUrl || 'https://api.github.com';

      // HTTP Request Abstraction
      // =======
      //
      // I'm not proud of this and neither should you be if you were responsible for the XMLHttpRequest spec.

      var _request = Github._request = function _request(method, path, data, cb, raw, sync) {
         function getURL() {
            var url = path.indexOf('//') >= 0 ? path : API_URL + path;

            url += ((/\?/).test(url) ? '&' : '?');

            if (data && typeof data === 'object' && ['GET', 'HEAD', 'DELETE'].indexOf(method) > -1) {
               for(var param in data) {
                  if (data.hasOwnProperty(param))
                    url += '&' + encodeURIComponent(param) + '=' + encodeURIComponent(data[param]);
               }
            }

            return url + (typeof window !== 'undefined' ? '&' + new Date().getTime() : '');
         }

         var xhr = new XMLHttpRequest();

         xhr.open(method, getURL(), !sync);

         if (!sync) {
            xhr.onreadystatechange = function () {
               if (this.readyState === 4) {
                  if (this.status >= 200 && this.status < 300 || this.status === 304) {
                     cb(null, raw ? this.responseText : this.responseText ? JSON.parse(this.responseText) : true, this);
                  } else {
                     cb({
                        path: path, request: this, error: this.status
                     });
                  }
               }
            };
         }

         if (!raw) {
            xhr.dataType = 'json';
            xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
         } else {
            xhr.setRequestHeader('Accept', 'application/vnd.github.v3.raw+json');
         }

         xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

         if ((options.token) || (options.username && options.password)) {
            var authorization = options.token ? 'token ' + options.token :
               'Basic ' + b64encode(options.username + ':' + options.password);

            xhr.setRequestHeader('Authorization', authorization);
         }

         if (data) {
            xhr.send(JSON.stringify(data));
         } else {
            xhr.send();
         }

         if (sync) {
            return xhr.response;
         }
      };

      var _requestAllPages = Github._requestAllPages = function _requestAllPages(path, cb) {
         var results = [];

         (function iterate() {
            _request('GET', path, null, function(err, res, xhr) {
               if (err) {
                  return cb(err);
               }

               results.push.apply(results, res);

               var links = (xhr.getResponseHeader('link') || '').split(/\s*,\s*/g);
               var next = null;

               links.forEach(function(link) {
                  next = /rel="next"/.test(link) ? link : next;
               });

               if (next) {
                  next = (/<(.*)>/.exec(next) || [])[1];
               }

               if (!next) {
                  cb(err, results);
               } else {
                  path = next;
                  iterate();
               }
            });
         })();
      };

      // User API
      // =======

      Github.User = function() {
         this.repos = function(options, cb) {
            if (arguments.length === 1 && typeof arguments[0] === 'function') {
               cb = options;
               options = {};
            }

            options = options || {};

            var url = '/user/repos';
            var params = [];

            params.push('type=' + encodeURIComponent(options.type || 'all'));
            params.push('sort=' + encodeURIComponent(options.sort || 'updated'));
            params.push('per_page=' + encodeURIComponent(options.per_page || '1000')); // jscs:ignore

            if (options.page) {
               params.push('page=' + encodeURIComponent(options.page));
            }

            url += '?' + params.join('&');

            _request('GET', url, null, cb);
         };

         // List user organizations
         // -------

         this.orgs = function(cb) {
            _request('GET', '/user/orgs', null, cb);
         };

         // List authenticated user's gists
         // -------

         this.gists = function(cb) {
            _request('GET', '/gists', null, cb);
         };

         // List authenticated user's unread notifications
         // -------

         this.notifications = function(options, cb) {
            if (arguments.length === 1 && typeof arguments[0] === 'function') {
               cb = options;
               options = {};
            }

            options = options || {};
            var url = '/notifications';
            var params = [];

            if (options.all) {
               params.push('all=true');
            }

            if (options.participating) {
               params.push('participating=true');
            }

            if (options.since) {
               var since = options.since;

               if (since.constructor === Date) {
                  since = since.toISOString();
               }

               params.push('since=' + encodeURIComponent(since));
            }

            if (options.before) {
               var before = options.before;

               if (before.constructor === Date) {
                  before = before.toISOString();
               }

               params.push('before=' + encodeURIComponent(before));
            }

            if (options.page) {
               params.push('page=' + encodeURIComponent(options.page));
            }

            if (params.length > 0) {
               url += '?' + params.join('&');
            }

            _request('GET', url, null, cb);
         };

         // Show user information
         // -------

         this.show = function(username, cb) {
            var command = username ? '/users/' + username : '/user';

            _request('GET', command, null, cb);
         };

         // List user repositories
         // -------

         this.userRepos = function(username, cb) {
            // Github does not always honor the 1000 limit so we want to iterate over the data set.
            _requestAllPages('/users/' + username + '/repos?type=all&per_page=1000&sort=updated', cb);
         };

         // List user starred repositories
         // -------

         this.userStarred = function(username, cb) {
            // Github does not always honor the 1000 limit so we want to iterate over the data set.
            _requestAllPages('/users/' + username + '/starred?type=all&per_page=1000', function(err, res) {
               cb(err, res);
            });
         };

         // List a user's gists
         // -------

         this.userGists = function(username, cb) {
            _request('GET', '/users/' + username + '/gists', null, cb);
         };

         // List organization repositories
         // -------

         this.orgRepos = function(orgname, cb) {
            // Github does not always honor the 1000 limit so we want to iterate over the data set.
            _requestAllPages('/orgs/' + orgname + '/repos?type=all&&page_num=1000&sort=updated&direction=desc', cb);
         };

         // Follow user
         // -------

         this.follow = function(username, cb) {
            _request('PUT', '/user/following/' + username, null, cb);
         };

         // Unfollow user
         // -------

         this.unfollow = function(username, cb) {
            _request('DELETE', '/user/following/' + username, null, cb);
         };

         // Create a repo
         // -------
         this.createRepo = function(options, cb) {
            _request('POST', '/user/repos', options, cb);
         };
      };

      // Repository API
      // =======

      Github.Repository = function(options) {
         var repo = options.name;
         var user = options.user;
         var fullname = options.fullname;

         var that = this;
         var repoPath;

         if (fullname) {
            repoPath = '/repos/' + fullname;
         } else {
            repoPath = '/repos/' + user + '/' + repo;
         }

         var currentTree = {
            branch: null,
            sha: null
         };

         // Delete a repo
         // --------

         this.deleteRepo = function(cb) {
            _request('DELETE', repoPath, options, cb);
         };

         // Uses the cache if branch has not been changed
         // -------

         function updateTree(branch, cb) {
            if (branch === currentTree.branch && currentTree.sha) {
               return cb(null, currentTree.sha);
            }

            that.getRef('heads/' + branch, function(err, sha) {
               currentTree.branch = branch;
               currentTree.sha = sha;
               cb(err, sha);
            });
         }

         // Get a particular reference
         // -------

         this.getRef = function(ref, cb) {
            _request('GET', repoPath + '/git/refs/' + ref, null, function(err, res, xhr) {
               if (err) {
                  return cb(err);
               }

               cb(null, res.object.sha, xhr);
            });
         };

         // Create a new reference
         // --------
         //
         // {
         //   "ref": "refs/heads/my-new-branch-name",
         //   "sha": "827efc6d56897b048c772eb4087f854f46256132"
         // }

         this.createRef = function(options, cb) {
            _request('POST', repoPath + '/git/refs', options, cb);
         };

         // Delete a reference
         // --------
         //
         // Repo.deleteRef('heads/gh-pages')
         // repo.deleteRef('tags/v1.0')

         this.deleteRef = function(ref, cb) {
            _request('DELETE', repoPath + '/git/refs/' + ref, options, function(err, res, xhr) {
               cb(err, res, xhr);
            });
         };

         // Create a repo
         // -------

         this.createRepo = function(options, cb) {
            _request('POST', '/user/repos', options, cb);
         };

         // Delete a repo
         // --------

         this.deleteRepo = function(cb) {
            _request('DELETE', repoPath, options, cb);
         };

         // List all tags of a repository
         // -------

         this.listTags = function(cb) {
            _request('GET', repoPath + '/tags', null, function(err, tags, xhr) {
               if (err) {
                  return cb(err);
               }

               cb(null, tags, xhr);
            });
         };

         // List all pull requests of a respository
         // -------

         this.listPulls = function(options, cb) {
            options = options || {};
            var url = repoPath + '/pulls';
            var params = [];

            if (typeof options === 'string') {
               // Backward compatibility
               params.push('state=' + options);
            } else {
               if (options.state) {
                  params.push('state=' + encodeURIComponent(options.state));
               }

               if (options.head) {
                  params.push('head=' + encodeURIComponent(options.head));
               }

               if (options.base) {
                  params.push('base=' + encodeURIComponent(options.base));
               }

               if (options.sort) {
                  params.push('sort=' + encodeURIComponent(options.sort));
               }

               if (options.direction) {
                  params.push('direction=' + encodeURIComponent(options.direction));
               }

               if (options.page) {
                  params.push('page=' + options.page);
               }

               if (options.per_page) {
                  params.push('per_page=' + options.per_page);
               }
            }

            if (params.length > 0) {
               url += '?' + params.join('&');
            }

            _request('GET', url, null, function(err, pulls, xhr) {
               if (err) return cb(err);
               cb(null, pulls, xhr);
            });
         };

         // Gets details for a specific pull request
         // -------

         this.getPull = function(number, cb) {
            _request('GET', repoPath + '/pulls/' + number, null, function(err, pull, xhr) {
               if (err) return cb(err);
               cb(null, pull, xhr);
            });
         };

         // Retrieve the changes made between base and head
         // -------

         this.compare = function(base, head, cb) {
            _request('GET', repoPath + '/compare/' + base + '...' + head, null, function(err, diff, xhr) {
               if (err) return cb(err);
               cb(null, diff, xhr);
            });
         };

         // List all branches of a repository
         // -------

         this.listBranches = function(cb) {
            _request('GET', repoPath + '/git/refs/heads', null, function(err, heads, xhr) {
               if (err) return cb(err);
               cb(null, heads.map(function(head) {
                  return head.ref.replace(/^refs\/heads\//, '');
               }), xhr);
            });
         };

         // Retrieve the contents of a blob
         // -------

         this.getBlob = function(sha, cb) {
            _request('GET', repoPath + '/git/blobs/' + sha, null, cb, 'raw');
         };

         // For a given file path, get the corresponding sha (blob for files, tree for dirs)
         // -------

         this.getCommit = function(branch, sha, cb) {
            _request('GET', repoPath + '/git/commits/' + sha, null, function(err, commit, xhr) {
               if (err) return cb(err);
               cb(null, commit, xhr);
            });
         };

         // For a given file path, get the corresponding sha (blob for files, tree for dirs)
         // -------

         this.getSha = function(branch, path, cb) {
            if (!path || path === '') return that.getRef('heads/' + branch, cb);
            _request('GET', repoPath + '/contents/' + path + (branch ? '?ref=' + branch : ''),
               null, function(err, pathContent, xhr) {
                  if (err) return cb(err);
                  cb(null, pathContent.sha, xhr);
               });
         };

         // Retrieve the tree a commit points to
         // -------

         this.getTree = function(tree, cb) {
            _request('GET', repoPath + '/git/trees/' + tree, null, function(err, res, xhr) {
               if (err) return cb(err);
               cb(null, res.tree, xhr);
            });
         };

         // Post a new blob object, getting a blob SHA back
         // -------

         this.postBlob = function(content, cb) {
            if (typeof (content) === 'string') {
               content = {
                  content: content,
                  encoding: 'utf-8'
               };
            } else {
               content = {
                  content: b64encode(content),
                  encoding: 'base64'
               };
            }

            _request('POST', repoPath + '/git/blobs', content, function(err, res) {
               if (err) return cb(err);
               cb(null, res.sha);
            });
         };

         // Update an existing tree adding a new blob object getting a tree SHA back
         // -------

         this.updateTree = function(baseTree, path, blob, cb) {
            var data = {
               base_tree: baseTree,
               tree: [
            {
               path: path,
               mode: '100644',
               type: 'blob',
               sha: blob
            }
          ]
            };

            _request('POST', repoPath + '/git/trees', data, function(err, res) {
               if (err) return cb(err);
               cb(null, res.sha);
            });
         };

         // Post a new tree object having a file path pointer replaced
         // with a new blob SHA getting a tree SHA back
         // -------

         this.postTree = function(tree, cb) {
            _request('POST', repoPath + '/git/trees', {
               tree: tree
            }, function(err, res) {
               if (err) return cb(err);
               cb(null, res.sha);
            });
         };

         // Create a new commit object with the current commit SHA as the parent
         // and the new tree SHA, getting a commit SHA back
         // -------

         this.commit = function(parent, tree, message, cb) {
            var user = new Github.User();

            user.show(null, function(err, userData) {
               if (err) return cb(err);
               var data = {
                  message: message,
                  author: {
                     name: options.user,
                     email: userData.email
                  },
                  parents: [
                    parent
                  ],
                  tree: tree
               };

               _request('POST', repoPath + '/git/commits', data, function(err, res) {
                  if (err) return cb(err);
                  currentTree.sha = res.sha; // Update latest commit
                  cb(null, res.sha);
               });
            });
         };

         // Update the reference of your head to point to the new commit SHA
         // -------

         this.updateHead = function(head, commit, cb) {
            _request('PATCH', repoPath + '/git/refs/heads/' + head, {
               sha: commit
            }, function(err) {
               cb(err);
            });
         };

         // Show repository information
         // -------

         this.show = function(cb) {
            _request('GET', repoPath, null, cb);
         };

         // Show repository contributors
         // -------

         this.contributors = function (cb, retry) {
            retry = retry || 1000;
            var that = this;

            _request('GET', repoPath + '/stats/contributors', null, function (err, data, xhr) {
               if (err) return cb(err);

               if (xhr.status === 202) {
                  setTimeout(
              function () {
                 that.contributors(cb, retry);
              },
              retry
            );
               } else {
                  cb(err, data, xhr);
               }
            });
         };

         // Get contents
         // --------

         this.contents = function(ref, path, cb) {
            path = encodeURI(path);
            _request('GET', repoPath + '/contents' + (path ? '/' + path : ''), {
               ref: ref
            }, cb);
         };

         // Fork repository
         // -------

         this.fork = function(cb) {
            _request('POST', repoPath + '/forks', null, cb);
         };

         // Branch repository
         // --------

         this.branch = function(oldBranch, newBranch, cb) {
            if (arguments.length === 2 && typeof arguments[1] === 'function') {
               cb = newBranch;
               newBranch = oldBranch;
               oldBranch = 'master';
            }

            this.getRef('heads/' + oldBranch, function(err, ref) {
               if (err && cb) return cb(err);
               that.createRef({
                  ref: 'refs/heads/' + newBranch,
                  sha: ref
               }, cb);
            });
         };

         // Create pull request
         // --------

         this.createPullRequest = function(options, cb) {
            _request('POST', repoPath + '/pulls', options, cb);
         };

         // List hooks
         // --------

         this.listHooks = function(cb) {
            _request('GET', repoPath + '/hooks', null, cb);
         };

         // Get a hook
         // --------

         this.getHook = function(id, cb) {
            _request('GET', repoPath + '/hooks/' + id, null, cb);
         };

         // Create a hook
         // --------

         this.createHook = function(options, cb) {
            _request('POST', repoPath + '/hooks', options, cb);
         };

         // Edit a hook
         // --------

         this.editHook = function(id, options, cb) {
            _request('PATCH', repoPath + '/hooks/' + id, options, cb);
         };

         // Delete a hook
         // --------

         this.deleteHook = function(id, cb) {
            _request('DELETE', repoPath + '/hooks/' + id, null, cb);
         };

         // Read file at given path
         // -------

         this.read = function(branch, path, cb) {
            _request('GET', repoPath + '/contents/' + encodeURI(path) + (branch ? '?ref=' + branch : ''),
               null, function(err, obj, xhr) {
                  if (err && err.error === 404) return cb('not found', null, null);

                  if (err) return cb(err);
                  cb(null, obj, xhr);
               }, true);
         };

         // Remove a file
         // -------

         this.remove = function(branch, path, cb) {
            that.getSha(branch, path, function(err, sha) {
               if (err) return cb(err);
               _request('DELETE', repoPath + '/contents/' + path, {
                  message: path + ' is removed',
                  sha: sha,
                  branch: branch
               }, cb);
            });
         };

         // Alias for repo.remove for backwards comapt.
         // -------
         this.delete = this.remove;

         // Move a file to a new location
         // -------

         this.move = function(branch, path, newPath, cb) {
            updateTree(branch, function(err, latestCommit) {
               that.getTree(latestCommit + '?recursive=true', function(err, tree) {
                  // Update Tree
                  tree.forEach(function(ref) {
                     if (ref.path === path) ref.path = newPath;

                     if (ref.type === 'tree') delete ref.sha;
                  });

                  that.postTree(tree, function(err, rootTree) {
                     that.commit(latestCommit, rootTree, 'Deleted ' + path , function(err, commit) {
                        that.updateHead(branch, commit, function(err) {
                           cb(err);
                        });
                     });
                  });
               });
            });
         };

         // Write file contents to a given branch and path
         // -------

         this.write = function(branch, path, content, message, options, cb) {
            if (typeof cb === 'undefined') {
               cb = options;
               options = {};
            }

            that.getSha(branch, encodeURI(path), function(err, sha) {
               var writeOptions = {
                  message: message,
                  content: typeof options.encode === 'undefined' || options.encode ? b64encode(content) : content,
                  branch: branch,
                  committer: options && options.committer ? options.committer : undefined,
                  author: options && options.author ? options.author : undefined
               };

               // If no error, we set the sha to overwrite an existing file
               if (!(err && err.error !== 404)) writeOptions.sha = sha;
               _request('PUT', repoPath + '/contents/' + encodeURI(path), writeOptions, cb);
            });
         };

         // List commits on a repository. Takes an object of optional paramaters:
         // sha: SHA or branch to start listing commits from
         // path: Only commits containing this file path will be returned
         // since: ISO 8601 date - only commits after this date will be returned
         // until: ISO 8601 date - only commits before this date will be returned
         // -------

         this.getCommits = function(options, cb) {
            options = options || {};
            var url = repoPath + '/commits';
            var params = [];

            if (options.sha) {
               params.push('sha=' + encodeURIComponent(options.sha));
            }

            if (options.path) {
               params.push('path=' + encodeURIComponent(options.path));
            }

            if (options.since) {
               var since = options.since;

               if (since.constructor === Date) {
                  since = since.toISOString();
               }

               params.push('since=' + encodeURIComponent(since));
            }

            if (options.until) {
               var until = options.until;

               if (until.constructor === Date) {
                  until = until.toISOString();
               }

               params.push('until=' + encodeURIComponent(until));
            }

            if (options.page) {
               params.push('page=' + options.page);
            }

            if (options.perpage) {
               params.push('per_page=' + options.perpage);
            }

            if (params.length > 0) {
               url += '?' + params.join('&');
            }

            _request('GET', url, null, cb);
         };
      };

      // Gists API
      // =======

      Github.Gist = function(options) {
         var id = options.id;
         var gistPath = '/gists/' + id;

         // Read the gist
         // --------

         this.read = function(cb) {
            _request('GET', gistPath, null, cb);
         };

         // Create the gist
         // --------
         // {
         //  "description": "the description for this gist",
         //    "public": true,
         //    "files": {
         //      "file1.txt": {
         //        "content": "String file contents"
         //      }
         //    }
         // }

         this.create = function(options, cb) {
            _request('POST', '/gists', options, cb);
         };

         // Delete the gist
         // --------

         this.delete = function(cb) {
            _request('DELETE', gistPath, null, cb);
         };

         // Fork a gist
         // --------

         this.fork = function(cb) {
            _request('POST', gistPath + '/fork', null, cb);
         };

         // Update a gist with the new stuff
         // --------

         this.update = function(options, cb) {
            _request('PATCH', gistPath, options, cb);
         };

         // Star a gist
         // --------

         this.star = function(cb) {
            _request('PUT', gistPath + '/star', null, cb);
         };

         // Untar a gist
         // --------

         this.unstar = function(cb) {
            _request('DELETE', gistPath + '/star', null, cb);
         };

         // Check if a gist is starred
         // --------

         this.isStarred = function(cb) {
            _request('GET', gistPath + '/star', null, cb);
         };
      };

      // Issues API
      // ==========

      Github.Issue = function(options) {
         var path = '/repos/' + options.user + '/' + options.repo + '/issues';

         this.list = function(options, cb) {
            var query = [];

            for(var key in options) {
               if (options.hasOwnProperty(key)) {
                  query.push(encodeURIComponent(key) + '=' + encodeURIComponent(options[key]));
               }
            }

            _requestAllPages(path + '?' + query.join('&'), cb);
         };

         this.comment = function(issue, comment, cb) {
            _request('POST', issue.comments_url, {
               body: comment
            }, function(err, res) {
               cb(err, res);
            });
         };
      };

      // Search API
      // ==========

      Github.Search = function(options) {
         var path = '/search/';
         var query = '?q=' + options.query;

         this.repositories = function(options, cb) {
            _request('GET', path + 'repositories' + query, options, cb);
         };

         this.code = function(options, cb) {
            _request('GET', path + 'code' + query, options, cb);
         };

         this.issues = function(options, cb) {
            _request('GET', path + 'issues' + query, options, cb);
         };

         this.users = function(options, cb) {
            _request('GET', path + 'users' + query, options, cb);
         };
      };

      return Github;
   };

   // Top Level API
   // -------

   Github.getIssues = function(user, repo) {
      return new Github.Issue({
         user: user, repo: repo
      });
   };

   Github.getRepo = function(user, repo) {
      if (!repo) {
         var fullname = user;

         return new Github.Repository({
            fullname: fullname
         });
      } else {
         return new Github.Repository({
            user: user, name: repo
         });
      }
   };

   Github.getUser = function() {
      return new Github.User();
   };

   Github.getGist = function(id) {
      return new Github.Gist({
         id: id
      });
   };

   Github.getSearch = function(query) {
      return new Github.Search({
         query: query
      });
   };

   return Github;
}));

},{"js-base64":14,"xmlhttprequest":3}],7:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Stringify an array of values.
 */
exports.arrayToString = (array, space, next) => {
    // Map array values to their stringified values with correct indentation.
    const values = array
        .map(function (value, index) {
        const result = next(value, index);
        if (result === undefined)
            return String(result);
        return space + result.split("\n").join(`\n${space}`);
    })
        .join(space ? ",\n" : ",");
    const eol = space && values ? "\n" : "";
    return `[${eol}${values}${eol}]`;
};

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quote_1 = require("./quote");
/**
 * Used in function stringification.
 */
/* istanbul ignore next */
const METHOD_NAMES_ARE_QUOTED = {
    " "() {
        /* Empty. */
    }
}[" "]
    .toString()
    .charAt(0) === '"';
const FUNCTION_PREFIXES = {
    Function: "function ",
    GeneratorFunction: "function* ",
    AsyncFunction: "async function ",
    AsyncGeneratorFunction: "async function* "
};
const METHOD_PREFIXES = {
    Function: "",
    GeneratorFunction: "*",
    AsyncFunction: "async ",
    AsyncGeneratorFunction: "async *"
};
const TOKENS_PRECEDING_REGEXPS = new Set(("case delete else in instanceof new return throw typeof void " +
    ", ; : + - ! ~ & | ^ * / % < > ? =").split(" "));
/**
 * Track function parser usage.
 */
exports.USED_METHOD_KEY = new WeakSet();
/**
 * Stringify a function.
 */
exports.functionToString = (fn, space, next, key) => {
    const name = typeof key === "string" ? key : undefined;
    // Track in function parser for object stringify to avoid duplicate output.
    if (name !== undefined)
        exports.USED_METHOD_KEY.add(fn);
    return new FunctionParser(fn, space, next, name).stringify();
};
/**
 * Rewrite a stringified function to remove initial indentation.
 */
function dedentFunction(fnString) {
    let found;
    for (const line of fnString.split("\n").slice(1)) {
        const m = /^[\s\t]+/.exec(line);
        if (!m)
            return fnString; // Early exit without indent.
        const [str] = m;
        if (found === undefined)
            found = str;
        else if (str.length < found.length)
            found = str;
    }
    return found ? fnString.split(`\n${found}`).join("\n") : fnString;
}
exports.dedentFunction = dedentFunction;
/**
 * Function parser and stringify.
 */
class FunctionParser {
    constructor(fn, indent, next, key) {
        this.fn = fn;
        this.indent = indent;
        this.next = next;
        this.key = key;
        this.pos = 0;
        this.hadKeyword = false;
        this.fnString = Function.prototype.toString.call(fn);
        this.fnType = fn.constructor.name;
        this.keyQuote = key === undefined ? "" : quote_1.quoteKey(key, next);
        this.keyPrefix =
            key === undefined ? "" : `${this.keyQuote}:${indent ? " " : ""}`;
        this.isMethodCandidate =
            key === undefined ? false : this.fn.name === "" || this.fn.name === key;
    }
    stringify() {
        const value = this.tryParse();
        // If we can't stringify this function, return a void expression; for
        // bonus help with debugging, include the function as a string literal.
        if (!value) {
            return `${this.keyPrefix}void ${this.next(this.fnString)}`;
        }
        return dedentFunction(value);
    }
    getPrefix() {
        if (this.isMethodCandidate && !this.hadKeyword) {
            return METHOD_PREFIXES[this.fnType] + this.keyQuote;
        }
        return this.keyPrefix + FUNCTION_PREFIXES[this.fnType];
    }
    tryParse() {
        if (this.fnString[this.fnString.length - 1] !== "}") {
            // Must be an arrow function.
            return this.keyPrefix + this.fnString;
        }
        // Attempt to remove function prefix.
        if (this.fn.name) {
            const result = this.tryStrippingName();
            if (result)
                return result;
        }
        // Support class expressions.
        const prevPos = this.pos;
        if (this.consumeSyntax() === "class")
            return this.fnString;
        this.pos = prevPos;
        if (this.tryParsePrefixTokens()) {
            const result = this.tryStrippingName();
            if (result)
                return result;
            let offset = this.pos;
            switch (this.consumeSyntax("WORD_LIKE")) {
                case "WORD_LIKE":
                    if (this.isMethodCandidate && !this.hadKeyword) {
                        offset = this.pos;
                    }
                // tslint:disable-next-line no-switch-case-fall-through
                case "()":
                    if (this.fnString.substr(this.pos, 2) === "=>") {
                        return this.keyPrefix + this.fnString;
                    }
                    this.pos = offset;
                // tslint:disable-next-line no-switch-case-fall-through
                case '"':
                case "'":
                case "[]":
                    return this.getPrefix() + this.fnString.substr(this.pos);
            }
        }
    }
    /**
     * Attempt to parse the function from the current position by first stripping
     * the function's name from the front. This is not a fool-proof method on all
     * JavaScript engines, but yields good results on Node.js 4 (and slightly
     * less good results on Node.js 6 and 8).
     */
    tryStrippingName() {
        if (METHOD_NAMES_ARE_QUOTED) {
            // ... then this approach is unnecessary and yields false positives.
            return;
        }
        let start = this.pos;
        const prefix = this.fnString.substr(this.pos, this.fn.name.length);
        if (prefix === this.fn.name) {
            this.pos += prefix.length;
            if (this.consumeSyntax() === "()" &&
                this.consumeSyntax() === "{}" &&
                this.pos === this.fnString.length) {
                // Don't include the function's name if it will be included in the
                // prefix, or if it's invalid as a name in a function expression.
                if (this.isMethodCandidate || !quote_1.isValidVariableName(prefix)) {
                    start += prefix.length;
                }
                return this.getPrefix() + this.fnString.substr(start);
            }
        }
        this.pos = start;
    }
    /**
     * Attempt to advance the parser past the keywords expected to be at the
     * start of this function's definition. This method sets `this.hadKeyword`
     * based on whether or not a `function` keyword is consumed.
     *
     * @return {boolean}
     */
    tryParsePrefixTokens() {
        let posPrev = this.pos;
        this.hadKeyword = false;
        switch (this.fnType) {
            case "AsyncFunction":
                if (this.consumeSyntax() !== "async")
                    return false;
                posPrev = this.pos;
            // tslint:disable-next-line no-switch-case-fall-through
            case "Function":
                if (this.consumeSyntax() === "function") {
                    this.hadKeyword = true;
                }
                else {
                    this.pos = posPrev;
                }
                return true;
            case "AsyncGeneratorFunction":
                if (this.consumeSyntax() !== "async")
                    return false;
            // tslint:disable-next-line no-switch-case-fall-through
            case "GeneratorFunction":
                let token = this.consumeSyntax();
                if (token === "function") {
                    token = this.consumeSyntax();
                    this.hadKeyword = true;
                }
                return token === "*";
        }
    }
    /**
     * Advance the parser past one element of JavaScript syntax. This could be a
     * matched pair of delimiters, like braces or parentheses, or an atomic unit
     * like a keyword, variable, or operator. Return a normalized string
     * representation of the element parsed--for example, returns '{}' for a
     * matched pair of braces. Comments and whitespace are skipped.
     *
     * (This isn't a full parser, so the token scanning logic used here is as
     * simple as it can be. As a consequence, some things that are one token in
     * JavaScript, like decimal number literals or most multicharacter operators
     * like '&&', are split into more than one token here. However, awareness of
     * some multicharacter sequences like '=>' is necessary, so we match the few
     * of them that we care about.)
     */
    consumeSyntax(wordLikeToken) {
        const m = this.consumeMatch(/^(?:([A-Za-z_0-9$\xA0-\uFFFF]+)|=>|\+\+|\-\-|.)/);
        if (!m)
            return;
        const [token, match] = m;
        this.consumeWhitespace();
        if (match)
            return wordLikeToken || match;
        switch (token) {
            case "(":
                return this.consumeSyntaxUntil("(", ")");
            case "[":
                return this.consumeSyntaxUntil("[", "]");
            case "{":
                return this.consumeSyntaxUntil("{", "}");
            case "`":
                return this.consumeTemplate();
            case '"':
                return this.consumeRegExp(/^(?:[^\\"]|\\.)*"/, '"');
            case "'":
                return this.consumeRegExp(/^(?:[^\\']|\\.)*'/, "'");
        }
        return token;
    }
    consumeSyntaxUntil(startToken, endToken) {
        let isRegExpAllowed = true;
        for (;;) {
            const token = this.consumeSyntax();
            if (token === endToken)
                return startToken + endToken;
            if (!token || token === ")" || token === "]" || token === "}")
                return;
            if (token === "/" &&
                isRegExpAllowed &&
                this.consumeMatch(/^(?:\\.|[^\\\/\n[]|\[(?:\\.|[^\]])*\])+\/[a-z]*/)) {
                isRegExpAllowed = false;
                this.consumeWhitespace();
            }
            else {
                isRegExpAllowed = TOKENS_PRECEDING_REGEXPS.has(token);
            }
        }
    }
    consumeMatch(re) {
        const m = re.exec(this.fnString.substr(this.pos));
        if (m)
            this.pos += m[0].length;
        return m;
    }
    /**
     * Advance the parser past an arbitrary regular expression. Return `token`,
     * or the match object of the regexp.
     */
    consumeRegExp(re, token) {
        const m = re.exec(this.fnString.substr(this.pos));
        if (!m)
            return;
        this.pos += m[0].length;
        this.consumeWhitespace();
        return token;
    }
    /**
     * Advance the parser past a template string.
     */
    consumeTemplate() {
        for (;;) {
            this.consumeMatch(/^(?:[^`$\\]|\\.|\$(?!{))*/);
            if (this.fnString[this.pos] === "`") {
                this.pos++;
                this.consumeWhitespace();
                return "`";
            }
            if (this.fnString.substr(this.pos, 2) === "${") {
                this.pos += 2;
                this.consumeWhitespace();
                if (this.consumeSyntaxUntil("{", "}"))
                    continue;
            }
            return;
        }
    }
    /**
     * Advance the parser past any whitespace or comments.
     */
    consumeWhitespace() {
        this.consumeMatch(/^(?:\s|\/\/.*|\/\*[^]*?\*\/)*/);
    }
}
exports.FunctionParser = FunctionParser;

},{"./quote":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify_1 = require("./stringify");
const quote_1 = require("./quote");
/**
 * Root path node.
 */
const ROOT_SENTINEL = Symbol("root");
/**
 * Stringify any JavaScript value.
 */
function stringify(value, replacer, indent, options = {}) {
    const space = typeof indent === "string" ? indent : " ".repeat(indent || 0);
    const path = [];
    const stack = new Set();
    const tracking = new Map();
    const unpack = new Map();
    let valueCount = 0;
    const { maxDepth = 100, references = false, skipUndefinedProperties = false, maxValues = 100000 } = options;
    // Wrap replacer function to support falling back on supported stringify.
    const valueToString = replacerToString(replacer);
    // Every time you call `next(value)` execute this function.
    const onNext = (value, key) => {
        if (++valueCount > maxValues)
            return;
        if (skipUndefinedProperties && value === undefined)
            return;
        if (path.length > maxDepth)
            return;
        // An undefined key is treated as an out-of-band "value".
        if (key === undefined)
            return valueToString(value, space, onNext, key);
        path.push(key);
        const result = builder(value, key === ROOT_SENTINEL ? undefined : key);
        path.pop();
        return result;
    };
    const builder = references
        ? (value, key) => {
            if (value !== null &&
                (typeof value === "object" ||
                    typeof value === "function" ||
                    typeof value === "symbol")) {
                // Track nodes to restore later.
                if (tracking.has(value)) {
                    unpack.set(path.slice(1), tracking.get(value));
                    return; // Avoid serializing referenced nodes on an expression.
                }
                // Track encountered nodes.
                tracking.set(value, path.slice(1));
            }
            return valueToString(value, space, onNext, key);
        }
        : (value, key) => {
            // Stop on recursion.
            if (stack.has(value))
                return;
            stack.add(value);
            const result = valueToString(value, space, onNext, key);
            stack.delete(value);
            return result;
        };
    const result = onNext(value, ROOT_SENTINEL);
    // Attempt to restore circular references.
    if (unpack.size) {
        const sp = space ? " " : "";
        const eol = space ? "\n" : "";
        let wrapper = `var x${sp}=${sp}${result};${eol}`;
        for (const [key, value] of unpack.entries()) {
            const keyPath = quote_1.stringifyPath(key, onNext);
            const valuePath = quote_1.stringifyPath(value, onNext);
            wrapper += `x${keyPath}${sp}=${sp}x${valuePath};${eol}`;
        }
        return `(function${sp}()${sp}{${eol}${wrapper}return x;${eol}}())`;
    }
    return result;
}
exports.stringify = stringify;
/**
 * Create `toString()` function from replacer.
 */
function replacerToString(replacer) {
    if (!replacer)
        return stringify_1.toString;
    return (value, space, next, key) => {
        return replacer(value, space, (value) => stringify_1.toString(value, space, next, key), key);
    };
}

},{"./quote":12,"./stringify":13}],11:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quote_1 = require("./quote");
const function_1 = require("./function");
const array_1 = require("./array");
/**
 * Transform an object into a string.
 */
exports.objectToString = (value, space, next, key) => {
    if (typeof Buffer === "function" && Buffer.isBuffer(value)) {
        return `new Buffer(${next(value.toString())})`;
    }
    // Use the internal object string to select stringify method.
    const toString = OBJECT_TYPES[Object.prototype.toString.call(value)];
    return toString ? toString(value, space, next, key) : undefined;
};
/**
 * Stringify an object of keys and values.
 */
const rawObjectToString = (obj, indent, next) => {
    const eol = indent ? "\n" : "";
    const space = indent ? " " : "";
    // Iterate over object keys and concat string together.
    const values = Object.keys(obj)
        .reduce(function (values, key) {
        const fn = obj[key];
        const result = next(fn, key);
        // Omit `undefined` object entries.
        if (result === undefined)
            return values;
        // String format the value data.
        const value = result.split("\n").join(`\n${indent}`);
        // Skip `key` prefix for function parser.
        if (function_1.USED_METHOD_KEY.has(fn)) {
            values.push(`${indent}${value}`);
            return values;
        }
        values.push(`${indent}${quote_1.quoteKey(key, next)}:${space}${value}`);
        return values;
    }, [])
        .join(`,${eol}`);
    // Avoid new lines in an empty object.
    if (values === "")
        return "{}";
    return `{${eol}${values}${eol}}`;
};
/**
 * Stringify global variable access.
 */
const globalToString = (value, space, next) => {
    return `Function(${next("return this")})()`;
};
/**
 * Convert JavaScript objects into strings.
 */
const OBJECT_TYPES = {
    "[object Array]": array_1.arrayToString,
    "[object Object]": rawObjectToString,
    "[object Error]": (error, space, next) => {
        return `new Error(${next(error.message)})`;
    },
    "[object Date]": (date) => {
        return `new Date(${date.getTime()})`;
    },
    "[object String]": (str, space, next) => {
        return `new String(${next(str.toString())})`;
    },
    "[object Number]": (num) => {
        return `new Number(${num})`;
    },
    "[object Boolean]": (bool) => {
        return `new Boolean(${bool})`;
    },
    "[object Set]": (set, space, next) => {
        return `new Set(${next(Array.from(set))})`;
    },
    "[object Map]": (map, space, next) => {
        return `new Map(${next(Array.from(map))})`;
    },
    "[object RegExp]": String,
    "[object global]": globalToString,
    "[object Window]": globalToString
};

}).call(this,require("buffer").Buffer)
},{"./array":8,"./function":9,"./quote":12,"buffer":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Match all characters that need to be escaped in a string. Modified from
 * source to match single quotes instead of double.
 *
 * Source: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
 */
const ESCAPABLE = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
/**
 * Map of characters to escape characters.
 */
const META_CHARS = new Map([
    ["\b", "\\b"],
    ["\t", "\\t"],
    ["\n", "\\n"],
    ["\f", "\\f"],
    ["\r", "\\r"],
    ["'", "\\'"],
    ['"', '\\"'],
    ["\\", "\\\\"]
]);
/**
 * Escape any character into its literal JavaScript string.
 *
 * @param  {string} char
 * @return {string}
 */
function escapeChar(char) {
    return (META_CHARS.get(char) ||
        `\\u${`0000${char.charCodeAt(0).toString(16)}`.slice(-4)}`);
}
/**
 * Quote a string.
 */
function quoteString(str) {
    return `'${str.replace(ESCAPABLE, escapeChar)}'`;
}
exports.quoteString = quoteString;
/**
 * JavaScript reserved keywords.
 */
const RESERVED_WORDS = new Set(("break else new var case finally return void catch for switch while " +
    "continue function this with default if throw delete in try " +
    "do instanceof typeof abstract enum int short boolean export " +
    "interface static byte extends long super char final native synchronized " +
    "class float package throws const goto private transient debugger " +
    "implements protected volatile double import public let yield").split(" "));
/**
 * Test for valid JavaScript identifier.
 */
exports.IS_VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
/**
 * Check if a variable name is valid.
 */
function isValidVariableName(name) {
    return (typeof name === "string" &&
        !RESERVED_WORDS.has(name) &&
        exports.IS_VALID_IDENTIFIER.test(name));
}
exports.isValidVariableName = isValidVariableName;
/**
 * Quote JavaScript key access.
 */
function quoteKey(key, next) {
    return isValidVariableName(key) ? key : next(key);
}
exports.quoteKey = quoteKey;
/**
 * Serialize the path to a string.
 */
function stringifyPath(path, next) {
    let result = "";
    for (const key of path) {
        if (isValidVariableName(key)) {
            result += `.${key}`;
        }
        else {
            result += `[${next(key)}]`;
        }
    }
    return result;
}
exports.stringifyPath = stringifyPath;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quote_1 = require("./quote");
const object_1 = require("./object");
const function_1 = require("./function");
/**
 * Stringify primitive values.
 */
const PRIMITIVE_TYPES = {
    string: quote_1.quoteString,
    number: (value) => (Object.is(value, -0) ? "-0" : String(value)),
    boolean: String,
    symbol: (value, space, next) => {
        const key = Symbol.keyFor(value);
        if (key !== undefined)
            return `Symbol.for(${next(key)})`;
        // ES2018 `Symbol.description`.
        return `Symbol(${next(value.description)})`;
    },
    bigint: (value, space, next) => {
        return `BigInt(${next(String(value))})`;
    },
    undefined: String,
    object: object_1.objectToString,
    function: function_1.functionToString
};
/**
 * Stringify a value recursively.
 */
exports.toString = (value, space, next, key) => {
    if (value === null)
        return "null";
    return PRIMITIVE_TYPES[typeof value](value, space, next, key);
};

},{"./function":9,"./object":11,"./quote":12}],14:[function(require,module,exports){
(function (global){
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.6.4";
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa && typeof global.btoa == 'function'
        ? function(b){ return global.btoa(b) } : function(b) {
        if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        return btoa(utob(String(u)));
    };
    var mkUriSafe = function (b64) {
        return b64.replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encode = function(u, urisafe) {
        return urisafe ? mkUriSafe(_encode(u)) : _encode(u);
    };
    var encodeURI = function(u) { return encode(u, true) };
    var fromUint8Array;
    if (global.Uint8Array) fromUint8Array = function(a, urisafe) {
        // return btoa(fromCharCode.apply(null, a));
        var b64 = '';
        for (var i = 0, l = a.length; i < l; i += 3) {
            var a0 = a[i], a1 = a[i+1], a2 = a[i+2];
            var ord = a0 << 16 | a1 << 8 | a2;
            b64 +=    b64chars.charAt( ord >>> 18)
                +     b64chars.charAt((ord >>> 12) & 63)
                + ( typeof a1 != 'undefined'
                    ? b64chars.charAt((ord >>>  6) & 63) : '=')
                + ( typeof a2 != 'undefined'
                    ? b64chars.charAt( ord         & 63) : '=');
        }
        return urisafe ? mkUriSafe(b64) : b64;
    };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob && typeof global.atob == 'function'
        ? function(a){ return global.atob(a) } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = function(a) { return btou(_atob(a)) };
    var _fromURI = function(a) {
        return String(a).replace(/[-_]/g, function(m0) {
            return m0 == '-' ? '+' : '/'
        }).replace(/[^A-Za-z0-9\+\/]/g, '');
    };
    var decode = function(a){
        return _decode(_fromURI(a));
    };
    var toUint8Array;
    if (global.Uint8Array) toUint8Array = function(a) {
        return Uint8Array.from(atob(_fromURI(a)), function(c) {
            return c.charCodeAt(0);
        });
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);