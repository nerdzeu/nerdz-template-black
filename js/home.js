$(document).ready(function() {
    var plist = $("#postlist");
    var loading = N.getLangData().LOADING;
    var lang = null;
    var voteOrder = null;
    var myLang = $("#stdfrm select[name=lang]").val();
    var load = false;
    $(".rightarrow-home").click(function(e) {
        e.preventDefault();
        if (!$(this).hasClass("toggled")) {
            $(this).addClass("toggled");
            $(this).css("transform", "rotate(45deg)");
        } else {
            $(this).removeClass("toggled");
            $(this).css("transform", "");
        }
        $(this).parent().next(".hidden").toggle();
    });
    plist.html("<h1>" + loading + "...</h1>");
    var onRemoveHiddenPost = function() {
        var me = $(this), target = me.data("target"), lv = localStorage.getItem("hid").split("|"), serialized = "";
        $("#" + target).slideToggle(function() {
            $(this).find(".img_frame > img").each(function() {
                $(this).css("margin-top", (117 - $(this).height()) / 2);
            });
        });
        me.parent().remove();
        for (var zxcvbn in lv) {
            if (lv[zxcvbn] != target) {
                serialized += lv[zxcvbn] + "|";
            }
        }
        if (serialized !== "") {
            localStorage.setItem("hid", serialized.slice(0, -1));
        } else {
            localStorage.removeItem("hid");
            $("#hp-cnt").remove();
            $("#hp-title").remove();
        }
    };
    var hideHidden = function() {
        var hidden = localStorage.getItem("hid");
        if (hidden !== null) {
            var pids = hidden.split("|").sort().reverse(), len = pids.length;
            while (len--) {
                var post = plist.find("#" + pids[len]);
                if (post.length) {
                    post.hide();
                    var pLink = window[pids[len].replace(/post/, "lnk")];
                    pids[len] = $(document.createElement("li")).append($(document.createElement("a")).attr("href", pLink).text(decodeURIComponent(pLink.substr(1)))).append($(document.createElement("a")).data("target", pids[len]).css("float", "right").html("X").click(onRemoveHiddenPost));
                } else {
                    pids.splice(len, 1);
                }
            }
            if (pids.length) {
                if (!$("#hp-cnt").length) {
                    $(document.createElement("div")).addClass("title").click(function() {
                        $("#hp-cnt").slideToggle();
                    }).html(N.getStaticData().lang.HIDDEN_POSTS).attr("id", "hp-title").appendTo("#right_col");
                    $(document.createElement("div")).hide().addClass("box").attr("id", "hp-cnt").append($(document.createElement("ul")).html(pids)).appendTo("#right_col");
                } else {
                    $("#hp-cnt ul").html(pids);
                }
            }
        }
        $("#postlist ").find(".news a:nth-last-child(3)").each(function() {
            if ($.inArray($(this).html(), N.idiots) > -1) {
                $(this).parent().parent().hide();
            }
        });
        window.fixHeights();
    };
    var handleRefresh = function() {
        load = false;
        if (lang == "usersifollow") {
            $("#stdfrm select[name=lang]").val(myLang);
            $("#fast_nerdz").show();
            N.html.profile.getFollowedHomePostList(0, function(data) {
                plist.html(data);
                plist.data("mode", "followed");
                hideHidden();
                load = true;
            });
        } else {
            if (lang == "vote") {
                $("#fast_nerdz").hide();
                localStorage.setItem("autoorder", voteOrder);
                N.html.profile.getByVoteHomePostList(0, voteOrder, function(data) {
                    plist.html(data);
                    plist.data("mode", "vote");
                    hideHidden();
                    load = true;
                });
            } else {
                $("#fast_nerdz").show();
                if (lang !== null && lang != "*") {
                    $("#stdfrm select[name=lang]").val(lang);
                    $("#stdfrm ul.subnav").show();
                } else {
                    $("#stdfrm select[name=lang]").val(myLang);
                }
                load = false;
                N.html.profile.getByLangHomePostList(0, lang, function(data) {
                    plist.html(data);
                    plist.data("mode", "language");
                    hideHidden();
                    load = true;
                });
            }
        }
    };
    plist.on("click", ".spoiler", function() {
        if ($(this).data("parsed")) {
            return;
        }
        $.each($(this).find("img"), function() {
            m = (117 - $(this).height()) / 2;
            if (m > 1) {
                $(this).css("margin-top", m);
            }
        });
        $(this).data("parsed", "1");
    });
    plist.on("click", ".hide", function() {
        var pid = $(this).data("postid");
        var hidden = localStorage.getItem("hid");
        if (hidden === null) {
            localStorage.setItem("hid", pid);
        } else {
            hidden += "|" + pid;
            localStorage.setItem("hid", hidden);
        }
        var lock = $("#post" + pid).find("img.imgunlocked");
        if (lock.length) {
            lock.eq(0).click();
        }
        $("#" + pid).slideUp(hideHidden);
    });
    $("#profilePostList").on("click", function() {
        plist.html("<h1>" + loading + "...</h1>");
        $("#fast_nerdz").show();
        $(".selectlang").css("color", "");
        localStorage.removeItem("autolang");
        localStorage.removeItem("autoorder");
        load = false;
        N.html.home.getFollowedPostList(0, function(data) {
            plist.html(data);
            plist.data("mode", "std");
            hideHidden();
            load = true;
        });
    });
    $("#projectPostList").on("click", function() {
        plist.html("<h1>" + loading + "...</h1>");
        $("#fast_nerdz").hide();
        $(".projlang").css("color", "");
        load = false;
        N.html.home.getFollowedPostList(0, function(data) {
            plist.html(data);
            plist.data("mode", "std");
            hideHidden();
            load = true;
        });
    });
    $(".selectlang").on("click", function() {
        plist.html("<h1>" + loading + "...</h1>");
        lang = $(this).data("lang");
        if (lang == "vote") {
            voteOrder = $(this).data("order");
        }
        localStorage.setItem("autolang", lang);
        localStorage.removeItem("autoorder");
        $(".selectlang").css("color", "");
        $(this).css("color", "#2370B6");
        handleRefresh();
    });
    $(".projlang").on("click", function() {
        $("#fast_nerdz").hide();
        plist.html("<h1>" + loading + "...</h1>");
        lang = $(this).data("lang");
        $(".projlang").css("color", "");
        $(this).css("color", "#2370B6");
        load = false;
        if (!lang) {
            N.html.project.getFollowedHomePostList(0, function(data) {
                plist.html(data);
                plist.data("mode", "followed");
                hideHidden();
                load = true;
            });
        } else {
            if (lang == "vote") {
                $("#fast_nerdz").hide();
                voteOrder = $(this).data("order");
                N.html.project.getByVoteHomePostList(0, voteOrder, function(data) {
                    plist.html(data);
                    plist.data("mode", "vote");
                    hideHidden();
                    load = true;
                });
            } else {
                N.html.project.getByLangHomePostList(0, lang, function(data) {
                    plist.html(data);
                    plist.data("mode", "language");
                    hideHidden();
                    load = true;
                });
            }
        }
    });
    $("#stdfrm").on("submit", function(e) {
        e.preventDefault();
        $(this).find("ul.subnav").hide();
        $("#pmessage").html(loading + "...");
        var news = $("#sendnews");
        N.json.profile.newPost({
            message: $("#frmtxt").val(),
            to: 0,
            news: news.length && news.is(":checked") ? "1" : "0",
            language: $(this).find('[name="lang"]').val()
        }, function(data) {
            if (data.status == "ok") {
                $("#frmtxt").val("");
                handleRefresh();
            }
            $("#pmessage").html(data.message);
            setTimeout(function() {
                $("#pmessage").html("");
            }, 5e3);
        });
    });

    var el;
    if (localStorage.getItem("autolang")) {
        if (localStorage.getItem("autoorder")) {
            el = $("#nerdzvote").find("[data-order='" + localStorage.getItem("autoorder") + "']");
        } else {
            $("#nerdzselect").click();
            el = $("#nerdzlist").find("ul").find("[data-lang='" + localStorage.getItem("autolang") + "']");
        }
    } else {
        // Load posts from everyone on default
        el = $("#nerdzlist").find("ul").find("[data-lang='*']");
    }
    el.click();
    el.css("color", "#2370B6");

    var tmpDivId = "scrtxt";
    var manageScrollResponse = function(data) {
        $("#" + tmpDivId).remove();
        if (data.length > 0) {
            plist.append(data);
            hideHidden();
            load = true;
        }
    };

    // Lazy load avatars
    $("#rightmenu img.gravatar-home").unveil(200, null, "#rightmenu");

    $(window).scroll(function() {
        if ($(this).scrollTop() + 200 >= $(document).height() - $(this).height()) {
            var num = 10;
            var $post = plist.find("div[id^='post']").last();
            var hpid = $post.data("hpid"),
            mode = plist.data("mode"),
            type = $post.data('type'),
            append = '<h3 id="' + tmpDivId + '">' + loading + "...</h3>";

            if (load && !$("#" + tmpDivId).length) {
                plist.append(append);
            }
            if (load) {
                load = false;
                if (mode == "std") {
                    N.html.home.getFollowedPostListBeforeHpid(num, hpid, type, manageScrollResponse);
                } else {
                    if (mode == "language") {
                        N.html[type].getByLangHomePostListBeforeHpid(num, lang, hpid, manageScrollResponse);
                    } else {
                        if (mode == "vote") {
                            N.html[type].getByVoteHomePostListBeforeHpid(num, voteOrder, hpid, manageScrollResponse);
                        }
                    }
                }
            }
        }
    });
});
