!function($) {

  var $form = $('#photoForm')
    , $photoFieldset = $('.photo-fieldset')
    , $photoResult = $('#photoResult')
    , $choose = $('#choose')
    , $file = $('#file')
    , $preview = $('#preview')
    , $result = $('#result')
    , $description = $('#description')
    , $key = $('#cloudKey')
    , $token = $('#cloudToken')
    , $link = $('#sharingLink')
    , $passcode = $('#passcode')
    , $cancel = $('#cancel')
    , $back = $('#back')
    , $formPopup = $('.photo-form-popup')
    , $loadingContainer = $('#loadingContainer')
    , $toast = $('#toast')
    , location;

  //******************* EXIF helper **********************
  var gpsFormatter = function(exifCoord, hemi) {
    var degrees = (exifCoord && exifCoord.length > 0) ? exifCoord[0].numerator/exifCoord[0].denominator : 0,
        minutes = (exifCoord && exifCoord.length > 1) ? exifCoord[1].numerator/exifCoord[1].denominator : 0,
        seconds = (exifCoord && exifCoord.length > 2 )? exifCoord[2].numerator/exifCoord[2].denominator : 0,
        flip = (hemi == 'W' || hemi == 'S') ? -1 : 1;

    return flip * (degrees + minutes / 60 + seconds / 3600);
  };

  var getGPSInfo = function(image) {
    if(EXIF) {
      var latitude = EXIF.getTag(image, 'GPSLatitude'),
          latitudeRef = EXIF.getTag(image, 'GPSLatitudeRef'),
          longitude = EXIF.getTag(image, 'GPSLongitude'),
          longitudeRef = EXIF.getTag(image, 'GPSLongitudeRef');

      return {
        latitude: gpsFormatter(latitude, latitudeRef),
        longitude: gpsFormatter(longitude, longitudeRef)
      };
    }
  };

  //******************* UI handler *************************
  var showLoading = function(swiitch) {
    if(swiitch) {
      $loadingContainer.css('display', 'block');
    } else {
      $loadingContainer.css('display', 'none');
    }
  };

  var reader = function (file, callback){ 
    var reader = new FileReader(); 

     reader.readAsDataURL(file);
     reader.onload = function(e) {
      $preview.attr('src', this.result);
    }
  };

  var uploadSuccess = function(data) {
    showLoading(false);

    $form.css('display', 'none');
    $photoResult.css('display', 'block');
    $result.attr('src', data.url);
    $link.html(window.location.origin + '/photo/' + data.id);
    $passcode.html(data.passcode);
  };

  var submitFile = function(event) {
      var detailData, fileData;

      event.preventDefault();

      if(typeof FormData === 'undefined') {
          alert('Please update your browser');
          return;
      }

      detailData = new FormData();

      detailData.append('location', JSON.stringify(location));
      detailData.append('key', $key.val());
      detailData.append('description', $description.val());

      fileData = new FormData();
      
      fileData.append('key', $key.val());
      fileData.append('token', $token.val());
      fileData.append('file', $file[0].files[0]);

      showLoading(true);
      //post to cloud
      $.ajax({
        type: 'POST',
        url: 'http://up.qiniu.com/',
        contentType: false,
        processData: false,
        data: fileData,
        success: function(data) {
          // post to server
          $.ajax({
            type: 'POST',
            url: '/api/photo',
            contentType: false,
            processData: false,
            data: detailData,
            success: uploadSuccess
          });   
        }
      });

  };

  var openFileUpload = function() {
    $file.trigger('click');
    $description.val('');
  };

  var closePopup = function() {
    $formPopup.css('display', 'none');
    $photoFieldset.css('display', 'block');
  };

  var fileReadyHandler = function(e) {
    var appVersion = window.navigator.appVersion;

    if (document.all && +appVersion.substring(appVersion.indexOf("MSIE ") + 5, appVersion.indexOf("; Windows")) < 10) {
      // var reallocalpath = document.selection.createRange().text;

      // $file.select();
      // $preview.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="image",src="' + reallocalpath + '")');
      // $preview.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');

    } else {
      var file = e.target.files[0]
        , FILE_SIZE_LIMIT = 8 * 1024 * 1024
        , reader = new FileReader(); 

      if(file.size > FILE_SIZE_LIMIT) {
        $toast.css('display', 'block');
        
        setTimeout(function() {
          $toast.fadeOut('slow');
        }, 1000)

      } else {
        // get photo GPS information
        EXIF.getData(file, function() {
          location = getGPSInfo(file);
        });

        reader.readAsDataURL(file);

        reader.onload = function() {
          $photoFieldset.css('display', 'none');
          $formPopup.css('display', 'block');
          $description.focus();
          $preview.attr('src', this.result);
        }
      }

    }
  };

  var back = function() {
    window.location.href = window.location.origin;
  };

  $file.on('change', fileReadyHandler);
  $choose.on('click', openFileUpload);
  $cancel.on('click', closePopup);
  $back.on('click', back);
  $form.on('submit', submitFile);

}($);