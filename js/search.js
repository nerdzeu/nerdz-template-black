$(document).ready(function() {
    var load = true;
    var tmpDivId = "scrtxt";
    var qs = $.trim($("#qs").html());
    var plist = $("#postlist");

    if(qs !== '') {
        N.html.search.globalPosts(10, qs, function(d) {
            plist.html(d);
            window.fixHeights();
        });
    } else {
        plist.html(N.getLangData().ERROR);
    }

    // since functions in default.js depends on plist.data('type')
    // but in the search page we got both projects and profiles posts
    // thus we must change the type according to the selected post
    // best hack btw
    plist.on('mouseenter focus', "div[id^='post']", function(e) {
        plist.data('type', /\.(\d+)$/i.test($(this).find('a.post_link').attr('href'))
                ? 'profile'
                : 'project'
             );
    });

    plist.on("mouseleave focusout", "div[id^='post']", function(e) {
            plist.data('type','search');
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
