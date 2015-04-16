$(document).ready(function() {
    var tz = jstz.determine();
    var select = $("#regfrm select[name=timezone]"), opt = select.find("option[value='" + tz.name() + "']");
    if (opt.length) {
        select.val(tz.name());
    }
});