$(document).ready(function() {
    var tz = jstz.determine();
    console.log(tz.name());
    var select = $("#regfrm select[name=timezone]"), opt = select.find("option[value='"+tz.name()+"']");
    console.log(select, opt);
    if(opt.length) {
        select.val(tz.name());
    }
});
