$(document).ready(function() {
    $("#resfrm").submit(function(e) {
        $("#error").html(N.getLangData().LOADING);
        e.preventDefault();
        N.json.resetPassword($(this).serialize(), function(d) {
            $("#error").html(d.message);
            N.reloadCaptcha();
            if (d.status == "ok") {
                $("#mait").val("");
            }
        });
    });
    $("#restokfrm").submit(function(e) {
        e.preventDefault();
        if ($("#password").val() != $("#password-check").val()) {
            alert(N.getLangData().PASSWORDS_DO_NOT_MATCH);
            return;
        } else {
            N.json.resetPassword($(this).serialize(), function(d) {
                $("#error").html(d.message);
                if (d.status == "ok") {
                    document.location.reload();
                }
            });
        }
    });
});