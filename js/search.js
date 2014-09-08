$(document).ready(function() {
    var load = true;
    var tmpDivId = "scrtxt";
    var qs = $("#qs").html();
    var plist = $("#postlist");

    N.html.search.globalPosts(10, qs, function(d) {
        plist.html(d);
        window.fixHeights();
    });

    $(window).scroll(function() {
        if($(this).scrollTop()+200 >= ( $(document).height() - $(this).height() ))
        {
            var num = 10;
            var hpid = plist.find("div[id^='post']").last().data('hpid');
            var append = '<h3 id="'+tmpDivId+'">'+N.getLangData().LOADING+'...</h3>';

            if(load && !$("#"+tmpDivId).length)
            {
                plist.append(append);
            }

            if(load) {
                load = false;
                N.html.search.globalPostsBeforeHpid(num, $("#qs").html(), hpid, function(data) {
                    $("#"+tmpDivId).remove();
                    if(data.length > 0) {
                        plist.append(data);
                        window.fixHeights();
                        load = true;
                    }
                });
            }
        }
    });

});
