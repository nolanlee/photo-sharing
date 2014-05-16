!function($) {
  var $loginContainer = $('#loginContainer')
    , $logoutContainer = $('#logoutContainer')
    , $login = $('#login')
    , $logout = $('#logout')
    , $content = $('#content')
    , $username = $('#username')
    , $password = $('#password')
    , $alert = $('#alert');

  var getPhotos = function(sucess, fail) {
    $.get('/api/admin/getPhotos', sucess).fail(fail);
  };

  var contentUIHandler = function(data) {
    var photos = data.photos.sort(function(a, b) {
      return a.freeze ? -1 : 1;
    });

    if(photos && photos.length > 0) {
      var htmlStr = '<table class="table table-responsive"><thead><tr><th>ID</th><th>Status</th><tr>';

      for(var i = 0, l = photos.length; i < l; i++) {
        htmlStr += '<tr><td><a href="' + photos[i].url + '">' + photos[i]._id + '</a></td>';

        if(!photos[i].freeze) {
          htmlStr += '<td><button class="btn btn-primary unfreeze">Unfreeze</button></td>';
        } else {
          htmlStr += '<td><button class="btn btn-warning freeze">Freeze</button></td>';
        }

        htmlStr += '</tr>';
      }

      htmlStr += '</table>';

      $content.html(htmlStr);

      var $unfreeze = $('.unfreeze')
        , $freeze = $('.freeze');

      var unfreezeHandler = function(e) {
        var $target = $(e.target)
          , photoId = $target.parent().prev('td').children('a').html();

        $.ajax({
          type: 'PUT',
          url: '/api/admin/freezePhoto',
          data: JSON.stringify({
            id: photoId
          }),
          contentType: 'application/json',
          success: function() {
            $target.html('Freeze')
              .addClass('freeze btn-warning')
              .removeClass('unfreeze btn-primary')
              .off('click', unfreezeHandler)
              .on('click', freezeHandler);
          }
        });

      };

      var freezeHandler = function(e) {
        var $target = $(e.target)
          , photoId = $target.parent().prev('td').children('a').html();

        $.ajax({
          type: 'PUT',
          url: '/api/admin/unfreezePhoto',
          data: JSON.stringify({
            id: photoId
          }),
          contentType: 'application/json',
          success: function() {
            $target.html('Unfreeze')
              .addClass('unfreeze btn-primary')
              .removeClass('freeze btn-warning')
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
    $alert.removeClass('alert-danger').html('').css('display', 'none');
    contentUIHandler(data);
  };

  var logoutUIHandler = function() {
    $loginContainer.css('display', 'block');
    $logoutContainer.css('display', 'none');
    $alert.removeClass('alert-danger').html('').css('display', 'none');
    $username.val('');
    $password.val('');
    $content.html('');
  };

  var loginHandler = function() {
    $.get('/api/admin/login', {
      username: $username.val(),
      password: $password.val()
    }, function() {
      getPhotos(loginUIHandler);
    })
    .fail(function() {
      $alert.addClass('alert-danger').html('login failed :(').css('display', 'block');
    });
  };

  var logoutHandler = function() {
    $.get('/api/admin/logout', logoutUIHandler)
    .fail(function() {
      $alert.addClass('alert-danger').html('logout failed :(').css('display', 'block');
    });
  };

  var initUIListener = function() {
    $login.click(loginHandler);
    $logout.click(logoutHandler);
  };

  var init =  function() {
    getPhotos(loginUIHandler, logoutUIHandler);

    initUIListener();
  };

  init();
  
}($);