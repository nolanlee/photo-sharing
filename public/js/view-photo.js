!function($) {

  var $photo = $('#photo'),
    $description = $('#description'),
    parameters = location.search.substr(1),
    photoId = parameters.substring(parameters.indexOf('id=') + 3);

  $.get('api/photo/' + photoId, function(data) {
    $photo.attr('src', data.url);
    $description.html(data.details.description);
    initMap(data.details.location.latitude, data.details.location.longitude);
  });

  var initDeleteDialog = function() {
    var $deleteBtn = $('#delete-btn'),
      $cancelBtn = $('#cancel-btn'),
      $passcode = $('#passcode'),
      $deleteDialog = $('#deleteDialog');

    $deleteBtn.click(function() {
      $.ajax({
        type: 'PUT',
        data: JSON.stringify({
          id: photoId,
          passcode: $passcode.val()
        }),
        contentType: 'application/json',
        url: 'api/photo/delete/' + photoId,
        success: function() {
          alert('delete success');
          window.location.href = window.location.origin;
        },
        error: function() {
          alert('delete failed');
        }
      });
    });
  };

  var initComplaint = function() {
    var $complaint = $('#complaint');

    $complaint.click(function() {
      $.ajax({
        type: 'PUT',
        data: JSON.stringify({
          id: photoId
        }),
        contentType: 'application/json',
        url: 'api/photo/complain/' + photoId,
        success: function() {
          alert('complain success');
        },
        error: function() {
          alert('complain failed');
        }
      });
    });
  };

  initComplaint();

  var initMap = function(latitude, longitude) {
    if(latitude !== 0 || longitude !== 0) {
      var $mapCanvas = $('#map-canvas');

      var marker = new google.maps.Marker({
          position:  new google.maps.LatLng(31.209668, 121.595222)
      });

      $mapCanvas.height(300);

      var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 15,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map($mapCanvas[0], mapOptions);

      marker.setMap(map);
    }
  };

  initDeleteDialog();

  // SOHU Chang Yan
  var showComment = function() {
    var appid = 'cyr9e2pRf',
    conf = 'prod_02b37847bda87d90570abc684f5bd343';
    var doc = document,
      s = doc.createElement('script'),
      h = doc.getElementsByTagName('head')[0] || doc.head || doc.documentElement;
    s.type = 'text/javascript';
    s.charset = 'utf-8';
    s.src = 'http://assets.changyan.sohu.com/upload/changyan.js?conf=' + conf + '&appid=' + appid;
    h.insertBefore(s, h.firstChild);
    window.SCS_NO_IFRAME = true;
  };

  showComment();

}($);