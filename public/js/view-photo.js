!function($) {

  var $photo = $('#photo'),
    parameters = location.search.substr(1),
    photoId = parameters.substring(parameters.indexOf('id=') + 3);

  $.get('api/photo/' + photoId, function(data) {
    $photo.attr('src', data.url);
  });

  var initDeleteDialog = function() {
    var $deleteBtn = $('#delete-btn'),
      $cancelBtn = $('#cancel-btn'),
      $passcode = $('#passcode'),
      $deleteDialog = $('#deleteDialog');

    $deleteBtn.click(function() {
      var formData = new FormData();

      formData.append('id', photoId);
      formData.append('passcode', $passcode.val());
      formData.append('deleted', true);

      $.ajax({
        type: 'PUT',
        data: formData,
        contentType: false,
        processData: false,
        url: 'api/photo/' + photoId,
        success: function() {
          alert('delete success');
        },
        error: function() {
          alert('delete failed');
        }
      });
    });
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