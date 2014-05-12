!function($) {
  var $loginContainer = $('#login-container')
    , $logoutContainer = $('#logout-container')
    , $login = $('#login')
    , $logout = $('#logout')
    , $content = $('#content')
    , $username = $('#username')
    , $password = $('#password');

  var getPhotos = function(sucess, fail) {
    $.get('/api/admin/getPhotos', sucess).fail(fail);
  };

  var contentUIHandler = function(data) {
    var photos = data.photos;

    if(photos && photos.length > 0) {
      var htmlStr = '<div>';

      for(var i = 0, l = photos.length; i < l; i++) {
        htmlStr += '<div><span> ID: </span><a href="' + photos[i].url + '">' + photos[i]._id + '</a>';

        if(photos[i].freeze) {
          htmlStr += '<button class="unfreeze">Unfreeze</button>';
        } else {
          htmlStr += '<button class="freeze">Freeze</button>';
        }

        htmlStr += '</div>';
      }

      htmlStr += '</div>';

      $content.html(htmlStr);

      var $unfreeze = $('.unfreeze')
        , $freeze = $('.freeze');

      var unfreezeHandler = function(e) {
        var $target = $(e.target)
          , photoId = $target.prev('a').html();

        $.ajax({
          type: 'PUT',
          url: '/api/admin/unfreezePhoto',
          data: JSON.stringify({
            id: photoId
          }),
          contentType: 'application/json',
          success: function() {
            $target.html('Freeze')
              .addClass('freeze')
              .removeClass('unfreeze')
              .off('click', unfreezeHandler)
              .on('click', freezeHandler);
          }
        });

      };

      var freezeHandler = function(e) {
        var $target = $(e.target)
          , photoId = $target.prev('a').html();

        $.ajax({
          type: 'PUT',
          url: '/api/admin/freezePhoto',
          data: JSON.stringify({
            id: photoId
          }),
          contentType: 'application/json',
          success: function() {
            $target.html('Unfreeze')
              .addClass('unfreeze')
              .removeClass('freeze')
              .off('click', freezeHandler)
              .on('click', unfreezeHandler);;
          }
        });
      };

      $unfreeze.on('click', unfreezeHandler);
      $freeze.on('click', freezeHandler);

    }
  };

  var loginUIHandler = function(data) {
    $loginContainer.css('display', 'none');
    $logoutContainer.css('display', 'block');
    contentUIHandler(data);
  };

  var logoutUIHandler = function() {
    $loginContainer.css('display', 'block');
    $logoutContainer.css('display', 'none');
    $content.html('');
  };

  var initUIListener = function() {
    $login.click(function() {
      $.get('/api/admin/login', {
        username: $username.val(),
        password: $password.val()
      }, function() {
        getPhotos(loginUIHandler);
      })
      .fail(function() {
        alert('login failed :(');
      });
    });

    $logout.click(function(data) {
      $.get('/api/admin/logout', logoutUIHandler)
      .fail(function() {
        alert('logout failed :(');
      });
    });
  };

  var init =  function() {
    getPhotos(loginUIHandler, logoutUIHandler);

    initUIListener();
  };

  init();
  
}($);