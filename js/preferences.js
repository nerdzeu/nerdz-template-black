$(document).ready(function() {
    var loading = N.getLangData().LOADING;
    var c = $("#content");
    $("#prefbar").click(function(event) {
        c.html(loading);
        N.html.post("/pages/preferences/" + event.target.id + ".html.php", {}, function(data) {
            c.html(data);
            $('.selectpicker').selectpicker('refresh');
            console.log(data);
        });
    });
    c.on("submit", "#edaccfrm", function(e) {
        e.preventDefault();
        var c = $("#res");
        c.html("...");
        N.json.post("/pages/preferences/account.html.json.php", $(this).serialize(), function(data) {
            c.html(data.message);
            if (data.status == "error") {
                N.reloadCaptcha();
            }
        });
    }).on("submit", "#edprofrm", function(e) {
        e.preventDefault();
        var r = $("#res");
        r.html(loading);
        N.json.post("/pages/preferences/profile.html.json.php", $(this).serialize(), function(data) {
            r.html(data.message);
        });
        //scroll to top
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }).on("submit", ".myinterests", function(e) {
        e.preventDefault();
        N.json.post("/pages/preferences/interests.json.php?action=del", $(this).serialize(), function(data){});
        $(this).hide("slow");
    }).on("submit", "#addinterest", function(e) {
        e.preventDefault();
        var r = $("#res");
        var interesse = $(this).find('input[name="interest"]').val();
        var tok = $(this).find('input[name="tok"]').val();
        r.html(loading);
        N.json.post("/pages/preferences/interests.json.php?action=add", $(this).serialize(), function(data) {
            if(data.message=='OK'){
                $( '<form id="form'+interesse+'" class="myinterests"><div class="col-xs-10 col-sm-11" style="padding: 0 0 10px 0"><input type="hidden" name="tok" value="'+tok+'" /><input type="text" class="form-control noborderradius" name="interest" value="'+interesse+'" readonly></div><div class="col-xs-1 nopadding"><button type="submit" class="btn btn-danger noborderradius"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></div></form>').insertAfter( "#addinterest" );
                $("#addinterest").find('input[name="interest"]').val("");
            } else {
                r.html(data.message);
            }
            //scroll to top
            $("html, body").animate({ scrollTop: 0 }, "slow");
        });
    })
    .on("submit", "#gufrm", function(e) {
        e.preventDefault();
        var check = $("#gufrm input[name=check]:checked").val();
        N.json.post("/pages/preferences/guests.html.json.php?action=" + check, {
            tok: $(this).data("tok")
        }, function(data) {
            $("#res").html(data.message);
        });
    }).on("click", ".manage", function(e) {
        e.preventDefault();
        $("#cont").html(loading);
        N.html.post("/pages/preferences/projects.html.html.php", {
            id: $(this).data("id")
        }, function(data) {
            $("#cont").html(data);
        });
    }).on("submit", "#edprojform", function(e) {
        e.preventDefault();
        var r = $("#res");
        r.html(loading);
        N.json.post("/pages/preferences/projects.html.html.json.php?action=update", $(this).serialize(), function(data) {
            r.html(data.message);
        });
    }).on("submit", "#delprojfrm", function(e) {
        e.preventDefault();
        var r = $("#res2");
        r.html(loading);
        N.json.post("/pages/preferences/projects.html.html.json.php?action=del", $(this).serialize(), function(data) {
            r.html(data.message);
            if (data.status == "ok") {
                setTimeout(function() {
                    location.reload();
                }, 1500);
            }
        });
    }).on("submit", "#langfrm", function(e) {
        e.preventDefault();
        N.json.post("/pages/preferences/language.html.json.php?action=userlang", $(this).serialize(), function(obj) {
            $("#langfrm input[type=submit]").val(obj.message + "...");
            $("#res").html("...");
            if (obj.status == "ok") {
                setTimeout(function() {
                    document.location.reload();
                }, 1500);
            }
        });
    }).on("submit", "#boardfrm", function(e) {
        e.preventDefault();
        N.json.post("/pages/preferences/language.html.json.php?action=boardlang", $(this).serialize(), function(obj) {
            $("#boardfrm input[type=submit]").val(obj.message + "...");
            $("#res").html("...");
            if (obj.status == "ok") {
                setTimeout(function() {
                    document.location.reload();
                }, 1500);
            }
        });
    }).on("submit", "#delfrm", function(e) {
        e.preventDefault();
        N.json.post("/pages/preferences/delete.html.json.php", {
            captcha: $("#frmdelcpt").val(),
            motivation: $("#motivation").val()
        }, function(data) {
            if (data.status == "ok") {
                setTimeout(function() {
                    document.location.reload();
                }, 500);
            } else {
                N.reloadCaptcha();
            }
            $("#res").html(data.message);
        });
    }).on("submit", "#themesfrm", function(e) {
        e.preventDefault();
        N.json.post("/pages/preferences/themes.html.json.php", $(this).serialize(), function(obj) {
            $("#themesfrm input[type=submit]").val(obj.message + "...");
            $("#res").html("...");
            if (obj.status == "ok") {
                setTimeout(function() {
                    document.location.reload();
                }, 1500);
            }
        });
    });
});
