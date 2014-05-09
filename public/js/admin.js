$('#login').click(function() {
  $.get('/api/admin/login', {
    username: $('#username').val(),
    password: $('#password').val()
  }, function(data) {
    $.get('/api/admin/getPhotos', function(data) {
      $('#content').html(JSON.stringify(data, null ,4));
    });
    $('#login-container').css('display', 'none');
    $('#logout-container').css('display', 'block');
  })
  .fail(function() {
    alert('login failed :(');
  });
});

$('#logout').click(function(data) {
  $.get('/api/admin/logout', function() {
    $('#login-container').css('display', 'block');
    $('#logout-container').css('display', 'none');
    $('#content').html('');
  })
  .fail(function() {
    alert('logout failed :(');
  });
});