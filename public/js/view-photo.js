!function($) {

  var $photo = $('#photo')
    , $description = $('#description')
    , pathname = location.pathname
    , photoId = pathname.substring(pathname.lastIndexOf('/') + 1);

  var showToast = function(content) {
    var $toast = $('#toast');

    $toast.html(content || '');
    $toast.css('display', 'block');
        
    setTimeout(function() {
      $toast.fadeOut('slow');
    }, 1500);
  };

  var initDeleteDialog = function() {
    var $deleteLink = $('#deleteLink')
      , $deleteBtn = $('#deleteBtn')
      , $cancelBtn = $('#cancelBtn')
      , $passcode = $('#passcode')
      , $deleteDialog = $('#deleteDialog');

    $deleteLink.on('click', function() {
      $deleteDialog.css('display', 'block');
    });

    $cancelBtn.on('click', function() {
      $deleteDialog.css('display', 'none');
    });

    $deleteBtn.click(function() {
      $.ajax({
        type: 'PUT',
        data: JSON.stringify({
          id: photoId,
          passcode: $passcode.val()
        }),
        contentType: 'application/json',
        url: '/api/photo/delete',
        success: function() {
          window.location.href = window.location.origin;
        },
        error: function(err) {
          showToast(JSON.parse(err.responseText).msg);
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
        url: '/api/photo/complain',
        success: function() {
          showToast('complain success');
        },
        error: function(err) {
          if(err.status === 403) {
            showToast('You have complained it.');
          } else {
            showToast('complain failed');
          }
        }
      });
    });
  };

  var initMap = function(latitude, longitude) {
    if(latitude !== 0 || longitude !== 0) {
      var $mapCanvas = $('#mapCanvas')
        , $mapContainer = $('#mapContainer')
        , $mapLink = $('#mapLink')
        , $closeMap = $('#closeMap');

      $mapLink.css('display', 'inline-block');

      $mapLink.on('click', function() {
        $mapContainer.css('display', 'block');

        if($mapCanvas.height() === 0) {
          var marker = new google.maps.Marker({
              position:  new google.maps.LatLng(latitude, longitude)
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
      }); 

      $closeMap.on('click', function() {
        $mapContainer.css('display', 'none');
      });
    }
  };

  // SOHU Chang Yan
  // var showComment = function() {
  //   var appid = 'cyr9e2pRf',
  //   conf = 'prod_02b37847bda87d90570abc684f5bd343';
  //   var doc = document,
  //     s = doc.createElement('script'),
  //     h = doc.getElementsByTagName('head')[0] || doc.head || doc.documentElement;
  //   s.type = 'text/javascript';
  //   s.charset = 'utf-8';
  //   s.src = 'http://assets.changyan.sohu.com/upload/changyan.js?conf=' + conf + '&appid=' + appid;
  //   h.insertBefore(s, h.firstChild);
  //   window.SCS_NO_IFRAME = true;
  // };

  // Disqus
  var showComment = function() {
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'iphotosharing'; // required: replace example with your forum shortname

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
  };

  var init = function() {
    var $new = $('#new');

    var forwardNewView = function() {
      window.location.href = window.location.origin;
    };

    $('.title').on('click', forwardNewView);
    $new.on('click', forwardNewView);

    $.get('/api/photo/' + photoId, function(data) {
      $photo.attr('src', data.url);
      if(data.details.description && data.details.description.length > 0) {
        $description.html(data.details.description);
      } else {
        $('#descriptionGroup').css('display', 'none');
      }
      initMap(data.details.location.latitude, data.details.location.longitude);
      initComplaint();
      initDeleteDialog();
      showComment();
    })
    .fail(function() {
      $('#complaint').css('display', 'none');
      $('#container').html('<h1 style="text-align: center;">Photo is inexistent :(</h1>');
    });
  }
 
  init();

}($);