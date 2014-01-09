$(document).ready(function() {
  
  var loading = N.getLangData().LOADING;
  var c = $("#content");
  
  $("#prefbar").click(function(event) {
      c.html(loading);
      N.html.post('/pages/preferences/'+ event.target.id +'.html.php',{},function(data) {
          c.html(data);
      });
  });

  c.on("submit", "#edaccfrm", function(e){
    e.preventDefault();
    var c = $('#res');
    c.html('...');
    N.json.post('/pages/preferences/account.html.json.php',$(this).serialize(), function(data) {
      c.html(data.message);
      if(data.status == 'error')
          N.reloadCaptcha();
    });
  }).on("submit","#edprofrm", function(e){
    e.preventDefault();
    var r = $("#res");
    r.html(loading);
    N.json.post('/pages/preferences/profile.html.json.php',$(this).serialize(), function(data) {
      r.html(data.message);
    });
  }).on("submit","#gufrm",function(e){
    e.preventDefault();
    var check = $("#gufrm input[name=check]:checked").val();
    N.json.post('/pages/preferences/guests.html.json.php?action='+check, { tok: $(this).data('tok') }, function(data) {
      $("#res").html(data.message);
    });
  }).on("click",".manage",function(e){
    e.preventDefault();
    $("#cont").html(loading);
    N.html.post('/pages/preferences/projects.html.html.php',{id: $(this).data('id')},function(data) {
      $("#cont").html(data);
    });
  }).on("submit","#edprojform",function(e){
    e.preventDefault();
    var r = $("#res");
    r.html(loading);
    N.json.post('/pages/preferences/projects.html.html.json.php?action=update',$(this).serialize(), function(data) {
      r.html(data.message);
    });
  }).on("submit","#delprojfrm",function(e){
    e.preventDefault();
    var r = $("#res2");
    r.html(loading);
    N.json.post('/pages/preferences/projects.html.html.json.php?action=del',$(this).serialize(), function(data) {
      r.html(data.message);
      if(data.status == 'ok') {
        setTimeout(function() { location.reload(); },1500);
      }
    });
  }).on("submit","#langfrm",function(e){
    e.preventDefault();
    N.json.post('/pages/preferences/language.html.json.php?action=userlang',$(this).serialize(),function(obj) {
      $("#langfrm input[type=submit]").val(obj.message+'...');
      $("#res").html('...');
      if(obj.status == 'ok')
      {
        setTimeout(function() {
          document.location.reload();
        },1500);
      }
    });
  }).on("submit","#boardfrm",function(e){
    e.preventDefault();
    N.json.post('/pages/preferences/language.html.json.php?action=boardlang',$(this).serialize(),function(obj) {
      $("#boardfrm input[type=submit]").val(obj.message+'...');
      $("#res").html('...');
      if(obj.status == 'ok')
      {
        setTimeout(function() {
          document.location.reload();
        },1500);
      }
    });
  }).on("submit","#delfrm",function(e){
    e.preventDefault();
    N.json.post('/pages/preferences/delete.html.json.php', { captcha: $("#frmdelcpt").val() }, function(data) {
      if(data.status == 'ok')
      {
        setTimeout(function() {
          document.location.reload();
        },500);
      }
      else
      {
        N.reloadCaptcha();
      }
      $("#res").html(data.message);
    });
  }).on("submit","#themesfrm",function(e){
    e.preventDefault();
    N.json.post('/pages/preferences/themes.html.json.php',$(this).serialize(),function(obj) {
      $("#themesfrm input[type=submit]").val(obj.message+'...');
      $("#res").html('...');
      if(obj.status == 'ok')
      {
        setTimeout(function() {
          document.location.reload();
        },1500);
      }
    });
  });

});
