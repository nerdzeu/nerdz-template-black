$(document).ready(function() {
    var load = true;
    var tmpDivId = "scrtxt";
    var st = $.trim($("#searchterm").html());
    var plist = $("#postlist");
    var num = 10;
    var type = window.getParameterByName("type"), loc = window.getParameterByName("location"), id = window.getParameterByName("id");
    var manageResponse = function(d) {
        plist.html(d);
        window.fixHeights();
        load = true;
    };
    if (st !== "") {
        if (type == "project") {
            if (loc == "home") {
                N.html.search.globalProjectPosts(num, st, manageResponse);
            } else {
                if (loc == "project") {
                    N.html.search.specificProjectPosts(num, st, id, manageResponse);
                }
            }
        } else {
            if (type == "profile") {
                if (loc == "home") {
                    N.html.search.globalProfilePosts(num, st, manageResponse);
                } else {
                    if (loc == "profile") {
                        N.html.search.specificProfilePosts(num, st, id, manageResponse);
                    }
                }
            } else {
                N.html.search.globalPosts(num, st, manageResponse);
            }
        }
    } else {
        plist.html(N.getLangData().ERROR);
    }
    plist.on("mouseenter focus", "div[id^='post']", function(e) {
        plist.data("type", /\.(\d+)$/i.test($(this).find("a.post_link").attr("href")) ? "profile" : "project");
    });
    plist.on("mouseleave focusout", "div[id^='post']", function(e) {
        plist.data("type", "search");
    });
    var manageScrollResponse = function(data) {
        $("#" + tmpDivId).remove();
        if (data.length > 0) {
            plist.append(data);
            window.fixHeights();
            load = true;
        }
    };
    $(window).scroll(function() {
        if ($(this).scrollTop() + 200 >= $(document).height() - $(this).height()) {
            var num = 10;
            var hpid = plist.find("div[id^='post']").last().data("hpid");
            var append = '<h3 id="' + tmpDivId + '">' + N.getLangData().LOADING + "...</h3>";
            if (load && !$("#" + tmpDivId).length) {
                plist.append(append);
            }
            if (load) {
                load = false;
                if (type == "project") {
                    if (loc == "home") {
                        N.html.search.globalProjectPostsBeforeHpid(num, st, hpid, manageScrollResponse);
                    } else {
                        if (loc == "project") {
                            N.html.search.specificProjectPostsBeforeHpid(num, st, id, hpid, manageScrollResponse);
                        }
                    }
                } else {
                    if (type == "profile") {
                        if (loc == "home") {
                            N.html.search.globalProfilePostsBeforeHpid(num, st, hpid, manageScrollResponse);
                        } else {
                            if (loc == "profile") {
                                N.html.search.specificProfilePostsBeforeHpid(num, st, id, hpid, manageScrollResponse);
                            }
                        }
                    } else {
                        N.html.search.globalPostsBeforeHpid(num, st, hpid, manageScrollResponse);
                    }
                }
            }
        }
    });
});
