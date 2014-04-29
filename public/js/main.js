!function($) {

  var $form = $('#photoForm'),
      $choose = $('#choose'),
      $file = $('#file'),
      $preview = $('#preview'),
      $result = $('#result'),
      $description = $('#description'),
      $key = $('#cloud-key'),
      $token = $('#cloud-token'),
      location;

  //******************* EXIF helper **********************
  var gpsFormatter = function(exifCoord, hemi) {
    var degrees = exifCoord.length > 0 ? exifCoord[0].numerator/exifCoord[0].denominator : 0,
        minutes = exifCoord.length > 1 ? exifCoord[0].numerator/exifCoord[0].denominator : 0,
        seconds = exifCoord.length > 2 ? exifCoord[0].numerator/exifCoord[0].denominator : 0,
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
  var loading = function(swiitch) {
    if(swiitch) {

    } else {

    }
  };

  var reader = function (file, callback){ 
    var reader = new FileReader(); 

     reader.readAsDataURL(file);
     reader.onload = function(e) {
      $preview.attr('src', this.result);
    }
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
      fileData.append('photoFile', $file[0].files[0]);
      fileData.append('key', $key.val());
      fileData.append('token', $token.val());

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
              data: detailData,
              success: function(data) {
                $result.attr('src', data.url);                            
              }
            });                            
          }
      });
  };

  var openFileUpload = function() {
    $file.trigger('click');
  };

  var preview = function(e) {
    var appVersion = window.navigator.appVersion;

    if (document.all && +appVersion.substring(appVersion.indexOf("MSIE ") + 5, appVersion.indexOf("; Windows")) < 10) {
      // var reallocalpath = document.selection.createRange().text;

      // $file.select();
      // $preview.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="image",src="' + reallocalpath + '")');
      // $preview.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');

    } else {
      var file = e.target.files[0],
          reader = new FileReader(); 

      // get photo GPS information
      EXIF.getData(file, function() {
        location = getGPSInfo(file);
      });

      reader.readAsDataURL(file);

      reader.onload = function() {
        $preview.attr('src', this.result);
      }
    }
  };

  $file.on('change', preview);
  $choose.on('click', openFileUpload);
  $form.on('submit', submitFile);

}($);