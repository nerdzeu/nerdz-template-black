$(document).ready(function() {
    var loading = N.getLangData().LOADING;
    N.userTagDisplayTpl = '<li><img alt="${username_n}" class="gravatar-home" src="${gravatarurl_n}&amp;s=32" height="32" width="32"><div class="follow-list-container-home">${username_n}</div></li>';
    N.userTagInsertTpl = "[user]${username_n}[/user]";
    N.projectTagDisplayTpl = '<li><div class="follow-list-container-home">${name_n}</li>';
    N.projectTagInsertTpl = "[user]${username_n}[/user]";
    var bbCodes = {
        list: [ "s", "user", "project", "img", "b", "cur", "small", "big", "del", "u", "gist", "youtube", "yt", "m", "math", "quote", "spoiler", "url", "video", "twitter", "music", "i", {
            name: "url=",
            hasParam: true,
            useQuotes: true,
            paramDesc: "url"
        }, {
            name: "code",
            hasParam: true,
            paramDesc: "lang"
        }, {
            name: "wiki",
            hasParam: true,
            paramDesc: "lang"
        }, {
            name: "quote=",
            hasParam: true
        }, {
            name: "spoiler=",
            hasParam: true,
            paramDesc: "label"
        }, {
            name: "hr",
            isEmpty: true
        } ],
        byName: function(search) {
            if (search === "yt" || search === "youtube") {
                return "video";
            } else {
                if (search == "s") {
                    return "del";
                }
            }
            for (var i = 0; i < this.list.length; i++) {
                if (typeof this.list[i] === "object" && this.list[i].name === search || this.list[i] === search) {
                    return this.list[i];
                }
            }
            return null;
        },
        getNames: function() {
            var ret = [];
            for (var i = 0; i < this.list.length; i++) {
                ret.push(typeof this.list[i] === "object" ? this.list[i].name : this.list[i]);
            }
            return ret;
        }
    };

    $(window).on("beforeunload", function() {
        if (!$("#postlist").length) {
            return;
        }
        var areas = $("textarea");
        for (var ta in areas) {
            var val = $.trim(areas[ta].value) || "";
            if (val !== "") {
                areas[ta].focus();
                return N.getLangData().MESSAGE_NOT_SENT;
            }
        }
    });
    $("iframe").attr("scrolling", "no");
    $("body").append($("<br />"));
    if ($("#left_col").length && window.location.pathname == "/home.php" && typeof Nversion !== "undefined" && Nversion != "null") {
        $("#left_col .title").eq(0).append(" <span class='small' style='font-weight: normal'><a href='https://github.com/nerdzeu/nerdz.eu/commit/" + Nversion + "' target='wowsoversion' style='color: #000 !important'>[" + Nversion + "]</a></span>");
    }
    var append_theme = "", _h = $("head");
    if (localStorage.getItem("has-dark-theme") == "yep") {
        append_theme = "?skin=sons-of-obsidian";
    }
    var prettify = document.createElement("script");
    prettify.type = "text/javascript";
    prettify.src = "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js" + append_theme;
    _h.append(prettify);
    if (append_theme !== "") {
        _h.append('<style type="text/css">.nerdz-code-wrapper { background-color: #000; color: #FFF; }</style>');
    } else {
        _h.append('<style type="text/css">.nerdz-code-wrapper { background-color: #eee; color: #000; }</style>');
    }
    $("#notifycounter").on("click", function(e) {
        e.preventDefault();
        var list = $("#notify_list"), old = $(this).html();
        var nold = parseInt(old);
        if (list.length) {
            if (isNaN(nold) || nold === 0) {
                list.remove();
            } else {
                if (nold > 0) {
                    list.prepend('<div id="pr_lo">' + loading + "</div>");
                    N.html.getNotifications(function(d) {
                        $("#pr_lo").remove();
                        list.prepend(d);
                    });
                }
            }
        } else {
            var l = $(document.createElement("div"));
            l.attr("id", "notify_list");
            l.html(loading);
            $("body").append(l);
            N.html.getNotifications(function(d) {
                l.html(d);
            });
            $("#notify_list").on("click", ".notref", function(e) {
                if (e.ctrlKey) {
                    return;
                }
                e.preventDefault();
                var href = $(this).attr("href");
                if (href == window.location.pathname + window.location.hash) {
                    location.reload();
                } else {
                    location.href = href;
                }
            });
        }
        $(this).html(isNaN(nold) ? old : "0");
    });
    var wrongPages = [ "/bbcode.php", "/terms.php", "/faq.php", "/stats.php", "/rank.php", "/preferences.php", "/information.php", "/preview.php" ];
    if ($.inArray(location.pathname, wrongPages) != -1) {
        $("#footersearch").hide();
    }
    window.getParameterByName = function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    $("#footersearch").on("submit", function(e) {
        e.preventDefault();
        var qs = $.trim($("#footersearch input[name=q]").val());
        if (qs === "") {
            return false;
        }
        qs = encodeURIComponent(qs);
        var type = window.getParameterByName("type");
        if (type === "") {
            type = plist.data("type");
        }
        type = encodeURIComponent(type);
        var loc = window.getParameterByName("location");
        if (loc === "") {
            loc = plist.data("location");
        }
        loc = encodeURIComponent(loc);
        var id = window.getParameterByName("id");
        if (id === "") {
            id = plist.data("id");
        }
        id = encodeURIComponent(id);
        window.location.href = "search.php?q=" + qs + "&type=" + type + "&location=" + loc + "&id=" + id;
    });
    $("#logout").on("click", function(event) {
        event.preventDefault();
        var t = $("#title_right");
        N.json.logout({
            tok: $(this).data("tok")
        }, function(r) {
            var tmp = t.html();
            if (r.status == "ok") {
                t.html(r.message);
                setTimeout(function() {
                    document.location.href = "/";
                }, 1500);
            } else {
                t.html("<h2>" + r.message + "</h2>");
                setTimeout(function() {
                    t.html(tmp);
                }, 1500);
            }
        });
    });
    $("#gotopm").on("click", function(e) {
        e.preventDefault();
        var href = $(this).attr("href");
        if ($("#pmcounter").html() != "0") {
            if (href == window.location.pathname) {
                location.hash = "new";
                location.reload();
            } else {
                location.href = "/pm.php#new";
            }
        } else {
            location.href = href;
        }
    });
    $("#regfrm").on("submit", function(event) {
        event.preventDefault();
        N.json.register($("#regfrm").serialize(), function(obj) {
            if (obj.status == "error") {
                $("#error").html(obj.message.replace(/\n/g, "<br />"));
                $("#cptxt").html("");
                N.reloadCaptcha();
            } else {
                if (obj.status == "ok") {
                    $("#error").hide();
                    $("#done").html(obj.message);
                    setTimeout(function() {
                        window.location.reload();
                    }, 1500);
                }
            }
        });
    });
    $(".preview").on("click", function() {
        var txt = $($(this).data("refto")).val();
        if (undefined !== txt && txt !== "") {
            window.open("/preview.php?message=" + encodeURIComponent(txt + " "));
        }
    });
    window.interactiveStoreName = "autocompletion";
    window.interactiveEmptyStore = {
        users: {},
        projects: {}
    };
    window.interactiveRemoteFilter = function(type) {
        return function(query, callback) {
            if (sessionStorage[interactiveStoreName]) {
                var store = JSON.parse(sessionStorage[interactiveStoreName]);
                if (store[type][query]) {
                    callback(store[type][query]);
                    return;
                }
            } else {
                sessionStorage[interactiveStoreName] = JSON.stringify(interactiveEmptyStore);
            }
            if (query.length < 2) {
                callback(JSON.parse(sessionStorage[interactiveStoreName])[type][query]);
                return;
            }
            $.getJSON("/i/" + type + ".ajax.php", {
                q: query,
                count: 10
            }, function(data) {
                var store = JSON.parse(sessionStorage[interactiveStoreName]);
                store[type][query] = data;
                sessionStorage[interactiveStoreName] = JSON.stringify(store);
                callback(data);
            });
        };
    };
    window.interactiveBeforeInsert = function(type) {
        return function(val, $li) {
            $li.data("final", val).data("index", "[/" + (type == "users" ? "user" : "project") + "]");
            return val;
        };
    };
    window.interactiveSorter = function(query, items, key) {
        return items;
    };
    $("body").on("focus", "textarea", function() {
        var $me = $(this), next_offset = [], old_len = 0, fired = false;
        if ($me.data("ac-enabled")) {
            return;
        }
        $me.data("ac-enabled", true);
        $me.atwho({
            at: "@",
            displayTpl: N.userTagDisplayTpl,
            insertTpl: N.userTagInsertTpl,
            callbacks: {
                sorter: window.interactiveSorter,
                remoteFilter: window.interactiveRemoteFilter("users")
            }
        }).atwho({
            at: "[",
            data: bbCodes.getNames(),
            callbacks: {
                beforeInsert: function(val, $li) {
                    var bbcode = bbCodes.byName($li.data("value")), what, indch;
                    if (typeof bbcode !== "object") {
                        what = "[" + bbcode + "][/" + bbcode + "]";
                        indch = "]";
                    } else {
                        var name = bbcode.name.replace(/=$/, "");
                        what = "[" + name;
                        if (bbcode.hasParam) {
                            what += "=" + (bbcode.useQuotes ? '""' : "");
                            indch = bbcode.useQuotes ? '"' : "=";
                        } else {
                            indch = "]";
                        }
                        what += "]";
                        if (!bbcode.isEmpty) {
                            what += "[/" + name + "]";
                        }
                    }
                    $li.data("index", indch).data("final", what);
                    return what;
                },
                tplEval: function(tpl, map) {
                    var base = "<li data-value='" + map.name + "'>", bbcode = bbCodes.byName(map.name), isObj = typeof bbcode === "object";
                    map.name = map.name.replace(/=$/, "");
                    base += "[" + map.name;
                    if (isObj && bbcode.hasParam) {
                        base += "=" + (bbcode.paramDesc ? bbcode.paramDesc : "...");
                    }
                    base += "]";
                    if (!isObj || !bbcode.isEmpty) {
                        base += "...[/" + map.name + "]";
                    }
                    return base + "</li>";
                },
                highlighter: function(li, query) {
                    if (!query) {
                        return li;
                    }
                    return li.replace(new RegExp(">(.+?)(" + query.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + ")", "gi"), function(s, $1, $2) {
                        if ($1 === "[") {
                            $1 = "";
                            $2 = "[" + $2;
                        }
                        return ">" + $1 + "<strong>" + $2 + "</strong>";
                    });
                },
                matcher: function(flag, subtext) {
                    var match;
                    match = /\[([A-Za-z0-9_+-=\]]*)$/gi.exec(subtext);
                    if (match) {
                        return match[1];
                    }
                    return null;
                }
            }
        }).atwho({
            at: "[user]",
            displayTpl: N.userTagDisplayTpl,
            insertTpl: "[user]${username_n}",
            callbacks: {
                sorter: window.interactiveSorter,
                remoteFilter: window.interactiveRemoteFilter("users"),
                beforeInsert: window.interactiveBeforeInsert("users")
            }
        }).atwho({
            at: "[project]",
            displayTpl: N.projectTagDisplayTpl,
            insertTpl: "[project]${name_n}",
            callbacks: {
                sorter: window.interactiveSorter,
                remoteFilter: window.interactiveRemoteFilter("projects"),
                beforeInsert: window.interactiveBeforeInsert("projects")
            }
        }).on("inserted.atwho", function(e, $li) {
            var str = $li.data("final"), $me = $(this), pos = $me.caret("pos"), v = $me.val(), index;
            $me.val(v.substr(0, pos - 1) + v.substr(pos));
            if (!$li.data("final")) {
                return;
            }
            index = str.indexOf($li.data("index"));
            next_offset = pos - str.length;
            if ($li.data("index") !== "]") {
                next_offset += str.indexOf("]");
            } else {
                next_offset += str.indexOf("]", index + 1);
            }
            old_len = $(this).val().length;
            if (index === -1) {
                return;
            }
            $(this).caret("pos", pos - str.length + index);
            fired = true;
        }).on("keydown", function(e) {
            if (e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13)) {
                $(this).parent().trigger("submit");
            } else {
                if (next_offset !== -1 && e.which === 9 && !fired) {
                    e.preventDefault();
                    $(this).caret("pos", next_offset);
                    next_offset = -1;
                    old_len = 0;
                } else {
                    if (fired) {
                        fired = false;
                    }
                }
            }
        }).on("keyup", function() {
            if (next_offset !== -1) {
                var $me = $(this), curr = $me.val().length, delta = curr - old_len;
                old_len = curr;
                next_offset += delta;
                if ($me.caret("pos") >= next_offset) {
                    next_offset = -1;
                    old_len = 0;
                }
            }
        });
    });
    $("#nerdzcrush-file").on("change", function(e) {
        e.preventDefault();
        var $me = $(this), progress = $("#" + $me.data("progref"));
        progress.show();
        NERDZCrush.upload(document.getElementById("nerdzcrush-file").files[0], function(media) {
            var file = document.getElementById("nerdzcrush-file").files[0];
            if(!file) {
                progress.hide();
                return;
            }
            var ext = file.name.split(".").pop().toLowerCase();
            var tag = "url";
            if (file.type.indexOf("image") > -1) {
                tag = ext != "gif" ? "img" : "video";
            } else if (file.type.indexOf("audio") > -1) {
                tag = "music";
            } else if (file.type.indexOf("video") > -1) {
                tag = "video";
            }

            var $area = $("#" + $me.data("refto"));
            progress.hide();
            var msg = "[" + tag + "]https://media.nerdz.eu/" + media.hash + "." + ext + "[/" + tag + "]";
            var cpos = $area[0].selectionStart, val = $area.val(), intx = val.substring(0, cpos) + msg;
            $area.focus();
            $area.val(intx + val.substring(cpos));
            $area[0].setSelectionRange(intx.length, intx.length);
            $me.val("");
        }, function(e) {
            if (e.lengthComputable) {
                progress.val((e.loaded / e.total) * 100);
            }
        });
    });
    var handleUpload = function(me, e) {
        e.preventDefault();
        var progref = "ref" + Math.round(Math.random() * 100) + "pro";
        var refto = me.parent().parent().find("textarea").attr("id");
        me.find("progress").remove();
        me.append("<progress id='" + progref + "' style='height: 3px; width:100%; display:none' max='100' value='0'></progress>");
        $("#nerdzcrush-file").data("progref", progref).data("refto", refto).click();
    };
    $(".nerdzcrush-upload").on("click", function(e) {
        handleUpload($(this), e);
    });
    var handleFolUn = function(me, d, oldValue) {
        me.html(d.message);
        if (d.status == "ok") {
            me.off("click");
        } else {
            setTimeout(function() {
                me.html(oldValue);
            }, 1500);
        }
    };
    $("#follow, .follow").click(function() {
        var me = $(this), oldValue = me.html();
        me.html("...");
        var type = me.hasClass("project") ? "project" : "profile";
        N.json[type].follow({
            id: $(this).data("id")
        }, function(d) {
            handleFolUn(me, d, oldValue);
        });
    });
    $("#unfollow, .unfollow").click(function() {
        var me = $(this), oldValue = me.html();
        me.html("...");
        var type = me.hasClass("project") ? "project" : "profile";
        N.json[type].unfollow({
            id: $(this).data("id")
        }, function(d) {
            handleFolUn(me, d, oldValue);
        });
    });
    $("ul.topnav li a.rightarrow").on("click", function(e) {
        e.preventDefault();
        $(this).parent().find("ul.subnav").toggle("fast");
    });

    /*Postlist events */
    var plist = $("#postlist");
    function getParentPostType($me) {
        return $me.parentsUntil(plist, 'div[id^="post"]').eq(0).data("type");
    };
    plist.on("click", ".qu_user", function(e) {
        if(e.target.tagName.toLowerCase() !== 'a') {
            e.preventDefault();
            $(this).parent().toggleClass("qu_main-collapse");
        }
    });
    window.fixHeights = function() {
        plist.find(".nerdz_message, .news").each(function() {
            var el = $(this).find("div:first");
            if ((el.height() >= 200 || el.find(".gistLoad").length > 0) && !el.data("parsed")) {
                el.data("real-height", el.height()).addClass("compressed");
                var n = el.next();
                n.prepend('<a class="more">&gt;&gt; ' + N.getLangData().EXPAND + " &lt;&lt;</a>");
            }
            el.attr("data-parsed", "1");
        });
    };
    plist.on("click", ".nerdzcrush-upload", function(e) {
        handleUpload($(this), e);
    });
    plist.on("click", ".more", function() {
        var me = $(this), par = me.parent(), jenk = par.prev();
        if (me.data("busy") == "godyes") {
            return;
        }
        me.data("busy", "godyes");
        jenk.animate({
            maxHeight: jenk.data("real-height")
        }, 500, function() {
            jenk.removeClass("compressed").css("max-height", "none");
            me.slideUp("slow", function() {
                me.remove();
            });
        });
    });
    plist.on("click", "ul.topnav li a.downarrow", function(e) {
        e.preventDefault();
        $(this).parent().find("ul.subnav").toggle("fast");
    });
    plist.on("click", ".yt_frame", function(e) {
        e.preventDefault();
        N.yt($(this), $(this).data("vid"));
    });
    plist.on("click", ".preview", function() {
        var txtarea = $($(this).data("refto"));
        txtarea.val(txtarea.val() + " ");
        var txt = txtarea.val();
        txtarea.val($.trim(txtarea.val()));
        if (undefined !== txt && $.trim(txt) !== "") {
            window.open("/preview.php?message=" + encodeURIComponent(txt));
        }
    });
    plist.on("click", ".delcomment", function() {
        var refto = $("#" + $(this).data("refto"));
        var text = refto.html();
        refto.html('<div style="text-align:center">' + N.getLangData().ARE_YOU_SURE + '<br /><span class="delcommentyes">YES</span>&nbsp;|&nbsp;<span class="delcommentno">NO</span></div>');
        var hcid = $(this).data("hcid");
        refto.on("click", ".delcommentyes", function() {
            N.json[plist.data("type")].delComment({
                hcid: hcid
            }, function(d) {
                if (d.status == "ok") {
                    refto.remove();
                } else {
                    refto.html(d.message);
                }
            });
        });
        refto.on("click", ".delcommentno", function() {
            refto.html(text);
        });
    });
    plist.on("submit", ".frmcomment", function(e) {
        e.preventDefault();
        var last, hcid, hpid = $(this).data("hpid"),
        refto = $("#commentlist" + hpid), error = $(this).find(".error").eq(0),
        pattern = 'div[id^="c"]', comments = refto.find(pattern),
        me = $(this);
        if (comments.length) {
            last = comments.length > 1 ? comments.eq(comments.length - 2) : null;
            hcid = last ? last.data("hcid") : 0;
        }
        error.html(loading);
        N.json[getParentPostType($(this))].addComment({
            hpid: hpid,
            message: $(this).find("textarea").eq(0).val()
        }, function(d) {
            if (d.status == "ok") {
                if (hcid && last) {
                    N.html[getParentPostType(me)].getCommentsAfterHcid({
                        hpid: hpid,
                        hcid: hcid
                    }, function(d) {
                        var form = refto.find("form.frmcomment").eq(0), pushBefore = form.parent(), newComments = $("<div>" + d + "</div>").find(pattern), internalLengthPointer = comments.length, lastComment = comments.last();
                        if (comments.length > 1) {
                            comments.eq(comments.length - 1).remove();
                            internalLengthPointer--;
                        }
                        if (lastComment.data("hcid") == newComments.last().data("hcid")) {
                            lastComment.remove();
                            internalLengthPointer--;
                        }
                        while (internalLengthPointer + newComments.length > ((comments.parent().find(".more_btn").data("morecount") || 0) + 1) * 10) {
                            comments.first().remove();
                            comments = refto.find(pattern);
                            internalLengthPointer--;
                        }
                        pushBefore.before(d);
                        form.find("textarea").val("");
                        error.html("");
                    });
                } else {
                    N.html[getParentPostType(me)].getComments({
                        hpid: hpid,
                        start: 0,
                        num: 10
                    }, function(d) {
                        refto.html(d);
                        error.html("");
                    });
                }
            } else {
                error.html(d.message);
            }
        });
    });
    plist.on("click", ".showcomments", function() {
        var refto = $("#" + $(this).data("refto"));
        if (refto.html() === "") {
            refto.html(loading + "...");

            N.html[getParentPostType($(this))].getComments({
                hpid: $(this).data("hpid"),
                start: 0,
                num: 10
            }, function(res) {
                refto.html(res);
                if (document.location.hash == "#last") {
                    refto.find(".frmcomment textarea[name=message]").focus();
                } else {
                    if (document.location.hash) {
                        if ($(document.location.hash).length) {
                            $(document).scrollTop($(document.location.hash).offset().top);
                        } else {
                            showAllComments($(".all_comments_btn")[0], function() {
                                $(document).scrollTop($(document.location.hash).offset().top);
                            });
                        }
                    }
                }
            });
        } else {
            refto.html("");
        }
    });
    plist.on("click", ".oldrev", function() {
        var me = $(this), refto = $(this).data("refto");
        var revno = parseInt($(this).data("revisions"));
        var func = "getRevision";
        var obj = {
            hpid: $(this).data("hpid"),
            revNo: revno
        };
        var id = "hpid";
        if (me.hasClass("comment")) {
            func = "getCommentRevision";
            obj = {
                hcid: $(this).data("hcid"),
                revNo: revno
            };
            id = "hcid";
        }
        if (!$(this).data("original-rev")) {
            $(this).data("original-rev", revno);
        }
        if (revno > 0) {
            N.json[getParentPostType($(this))][func](obj, function(r) {
                var tagTime = me.parent().parent(), timeVal = null;
                if (id === "hcid") {
                    tagTime = tagTime.find('a[id^="ndc"]');
                } else {
                    tagTime = tagTime.find("time");
                }
                timeVal = tagTime.html();
                tagTime.html(r.date + " " + r.time);
                if (!me.parent().find(".newrev").length) {
                    var s = $(document.createElement("span"));
                    s.attr("class", "newrev" + (id === "hcid" ? " comment" : ""));
                    s.attr("data-refto", refto);
                    s.attr("data-" + id, me.data(id));
                    s.html("&#9654;&nbsp;");
                    me.parent().append(s);
                }
                var div = null, pidTag = null;
                if (id === "hcid") {
                    div = $("#" + refto).find(".nerdz_comments");
                    pidTag = $(document.createElement("span"));
                    pidTag.append(div.find(".delcomment"));
                    pidTag.html(pidTag.html() + "#1");
                    pidTag.css("font-size", "0");
                } else {
                    div = $("#" + refto).find(".nerdz_message div:first");
                    pidTag = $("#" + refto).find(".nerdz_message span:first");
                    if (!div.length) {
                        div = $("#" + refto).find(".news div:first");
                        pidTag = $("#" + refto).find(".news span:first");
                    }
                    pidTag.remove();
                }
                var storeName = getParentPostType($(this)) + "store" + func;
                var elms = {};
                if (!sessionStorage[storeName]) {
                    elms[me.data(id)] = [];
                    elms[me.data(id)][revno] = {};
                    elms[me.data(id)][revno].message = div.html();
                    elms[me.data(id)][revno].time = timeVal;
                    sessionStorage[storeName] = JSON.stringify(elms);
                } else {
                    elms = JSON.parse(sessionStorage[storeName]);
                    if (!elms[me.data(id)]) {
                        elms[me.data(id)] = [];
                    }
                    if (!elms[me.data(id)][revno]) {
                        elms[me.data(id)][revno] = {};
                        elms[me.data(id)][revno].message = div.html();
                        elms[me.data(id)][revno].time = timeVal;
                        sessionStorage[storeName] = JSON.stringify(elms);
                    }
                }
                div.html(r.message);
                if (pidTag.html().search(/^#\d+$/) != -1) {
                    pidTag.html(pidTag.html() + " - rev: " + revno);
                } else {
                    pidTag.html(pidTag.html().replace(/(#.+?):\s*(\d+)/, function($0, $1, $2) {
                        return $1 + ": " + revno;
                    }));
                }
                div.prepend(pidTag);
                var rev = revno - 1;
                me.data("revisions", rev);
                if (rev === 0) {
                    me.hide();
                }
            });
        }
    });
    plist.on("click", ".newrev", function() {
        var me = $(this), refto = $(this).data("refto");
        var func = "getRevision";
        var id = "hpid";
        var tagTime = me.parent().parent().find("time");
        if (me.hasClass("comment")) {
            func = "getCommentRevision";
            id = "hcid";
            tagTime = me.parent().parent().children('a[id^="ndc"]');
        }
        var storeName = getParentPostType($(this)) + "store" + func;
        if (sessionStorage[storeName]) {
            var elms = JSON.parse(sessionStorage[storeName]);
            if (elms[me.data(id)]) {
                if (id === "hcid") {
                    div = $("#" + refto).find(".nerdz_comments");
                    pidTag = $(document.createElement("span"));
                    pidTag.append(div.find(".delcomment"));
                    pidTag.html(pidTag.html() + "#1");
                } else {
                    div = $("#" + refto).find(".nerdz_message div:first");
                    if (!div.length) {
                        div = $("#" + refto).find(".news div:first");
                    }
                    pidTag = div.find("span:first");
                    pidTag.remove();
                }
                elms[me.data(id)] = elms[me.data(id)].filter(function(v) {
                    return v !== null;
                });
                div.html(elms[me.data(id)][0].message);
                tagTime.html(elms[me.data(id)][0].time);
                elms[me.data(id)][0] = null;
                elms[me.data(id)] = elms[me.data(id)].filter(function(v) {
                    return v !== null;
                });
                sessionStorage[storeName] = JSON.stringify(elms);
                var d = me.parent().find(".oldrev");
                var rev = parseInt(d.data("revisions")) + 1;
                d.data("revisions", rev);
                pidTag.html(pidTag.html().replace(/(#.+?):\s*(\d+)/, function($0, $1, $2) {
                    return $1 + ": " + (rev == 1 ? rev + 1 : rev);
                }));
                if (id === "hcid") {
                    pidTag.css("font-size", "0");
                }
                div.prepend(pidTag);
                if (rev >= parseInt(d.data("original-rev"))) {
                    me.remove();
                    pidTag.html(pidTag.html().replace(/(#\d+).*:\s*(\d+)/, function($0, $1, $2) {
                        return $1;
                    }));
                }
                d.show();
            }
        }
    });
    plist.on("click", ".vote", function() {
        var curr = $(this), cont = curr.parent(), tnum = cont.parent().children(".thumbs-counter"), func = "thumbs", obj = {
            hpid: cont.data("refto")
        };
        if (cont.hasClass("comment")) {
            obj = {
                hcid: cont.data("refto")
            };
            func = "cthumbs";
        }
        if (curr.hasClass("voted")) {
            N.json[getParentPostType($(this))][func]($.extend(obj, {
                thumb: 0
            }), function(r) {
                if (r.status === "error") {
                    alert(r.message);
                } else {
                    curr.removeClass("voted");
                    var votes = parseInt(r.message);
                    if (isNaN(votes)) {
                        alert(r.message);
                        return;
                    }
                    tnum.attr("class", "thumbs-counter").text(votes);
                    if (votes !== 0) {
                        tnum.addClass(votes > 0 ? "nerdz_thumbsNumPos" : "nerdz_thumbsNumNeg");
                    }
                    if (votes > 0) {
                        tnum.text("+" + tnum.text());
                    }
                }
            });
        } else {
            N.json[getParentPostType($(this))][func]($.extend(obj, {
                thumb: curr.hasClass("up") ? 1 : -1
            }), function(r) {
                if (r.status === "error") {
                    alert(r.message);
                } else {
                    cont.children(".voted").removeClass("voted");
                    curr.addClass("voted");
                    var votes = parseInt(r.message);
                    if (isNaN(votes)) {
                        alert(r.message);
                        return;
                    }
                    tnum.attr("class", "thumbs-counter").text(votes);
                    if (votes !== 0) {
                        tnum.addClass(votes > 0 ? "nerdz_thumbsNumPos" : "nerdz_thumbsNumNeg");
                    }
                    if (votes > 0) {
                        tnum.text("+" + tnum.text());
                    }
                }
            });
        }
    });
    plist.on("click", ".more_btn", function() {
        var moreBtn = $(this),
        commentList = moreBtn.parents('div[id^="commentlist"]');
        console.log(commentList.parentsUntil(plist, 'div[id^="post"]'));
        hpid = $(commentList.parentsUntil(plist, 'div[id^="post"]')[0]).data("hpid"),
        intCounter = moreBtn.data("morecount") || 0;
        if (moreBtn.data("inprogress") === "1") {
            return;
        }
        moreBtn.data("inprogress", "1").text(loading + "...");
        N.html[getParentPostType($(this))].getComments({
            hpid: hpid,
            start: intCounter + 1,
            num: 10
        }, function(r) {
            moreBtn.data("inprogress", "0").data("morecount", ++intCounter).text(moreBtn.data("localization"));
            var _ref = $("<div>" + r + "</div>");
            moreBtn.parent().after(r);
            if (intCounter == 1) {
                moreBtn.parent().find(".scroll_bottom_hidden").show();
            }
            if ($.trim(r) === "" || _ref.find(".nerdz_from").length < 10 || 10 * (intCounter + 1) == _ref.find(".commentcount:eq(0)").html()) {
                var btnDb = moreBtn.hide().parent();
                btnDb.find(".scroll_bottom_separator").hide();
                btnDb.find(".all_comments_hidden").hide();
            }
        });
    });
    plist.on("click", ".scroll_bottom_btn", function() {
        var cList = $(this).parents().eq(2);
        $("html, body").animate({
            scrollTop: cList.find(".singlecomment:nth-last-child(2)").offset().top
        }, function() {
            cList.find(".frmcomment textarea").focus();
        });
    });
    var showAllComments = function(el, callback) {
        var btn = $(el), btnDb = btn.parent().parent(), moreBtn = btnDb.find(".more_btn"), commentList = btn.parents('div[id^="commentlist"]'), hpid = /^post(\d+)$/.exec(commentList.$(parentsUntil(plist, 'div[id^="post"]')[0]).data("id"))[1];
        if (btn.data("working") === "1" || moreBtn.data("inprogress") === "1") {
            return;
        }
        btn.data("working", "1").text(loading + "...");
        moreBtn.data("inprogress", "1");
        N.html[getParentPostType($(this))].getComments({
            hpid: hpid,
            forceNoForm: true
        }, function(res) {
            btn.data("working", "0").text(btn.data("localization")).parent().hide();
            btnDb.find(".scroll_bottom_hidden").show().find(".scroll_bottom_separator").hide();
            var parsed = $("<div>" + res + "</div>"), push = $("#commentlist" + hpid);
            moreBtn.hide().data("morecount", Math.ceil(parseInt(parsed.find(".commentcount").html()) / 10));
            push.find('div[id^="c"]').remove();
            push.find("form.frmcomment").eq(0).parent().before(res);
            if ($.isFunction(callback)) {
                callback();
            }
        });
    };
    plist.on("click", ".all_comments_btn", function() {
        showAllComments(this);
    });
    plist.on("click", ".qu_ico", function() {
        var area = $("#" + $(this).data("refto")), msg = "[quote=" + $(this).data("hcid") + "|" + $(this).data("type") + "]", cpos = area[0].selectionStart, val = area.val(), intx = val.substring(0, cpos) + msg;
        area.focus();
        area.val(intx + val.substring(cpos));
        area[0].setSelectionRange(intx.length, intx.length);
    });
    plist.on("click", ".delpost", function(e) {
        e.preventDefault();
        var me = $(this), refto = $("#" + me.data("refto")), post = refto.html(), hpid = me.data("hpid");
        var parentPostType = getParentPostType($(this));
        N.json[parentPostType].delPostConfirm({
            hpid: hpid
        }, function(m) {
            if (m.status == "ok") {
                refto.html('<div style="text-align:center">' + m.message + '<br /><span id="delPostOk' + hpid + '" style="cursor:pointer">YES</span>|<span id="delPostNo' + hpid + '" style="cursor:pointer">NO</span></div>');
                refto.on("click", "#delPostOk" + hpid, function() {
                    N.json[parentPostType].delPost({
                        hpid: hpid
                    }, function(j) {
                        if (j.status == "ok") {
                            refto.hide();
                        } else {
                            refto.html(j.message);
                        }
                    });
                });
                refto.on("click", "#delPostNo" + hpid, function() {
                    refto.html(post);
                });
            } else {
                alert(d.message);
            }
        });
    });
    plist.on("click", ".close", function(e) {
        e.preventDefault();
        var refto = $("#" + $(this).data("refto"));
        var hpid = $(this).data("hpid");
        var me = $(this), arrow = me.children();
        me.html("...");
        N.json[getParentPostType(refto)].closePost({
            hpid: hpid
        }, function(m) {
            if (m.status != "ok") {
                alert(m.message);
            } else {
                refto.find("a").css("color", "red");
                me.html(N.getLangData().OPEN);
                me.append(arrow);
                me.attr("class", "open");
            }
        });
    });
    plist.on("click", ".open", function(e) {
        e.preventDefault();
        var refto = $("#" + $(this).data("refto"));
        var hpid = $(this).data("hpid");
        var me = $(this), arrow = me.children();
        me.html("...");
        N.json[getParentPostType(refto)].openPost({
            hpid: hpid
        }, function(m) {
            if (m.status != "ok") {
                alert(m.message);
            } else {
                refto.find("a").css("color", "");
                me.html(N.getLangData().CLOSE);
                me.append(arrow);
                me.attr("class", "close");
            }
        });
    });
    plist.on("click", ".edit", function(e) {
        e.preventDefault();
        var refto = $("#" + $(this).data("refto")), hpid = $(this).data("hpid");
        var getF = "getPost", editF = "editPost";
        var getObj = {
            hpid: hpid
        };
        var editObj = {
            hpid: hpid
        };
        var id = hpid;
        var type = "hpid";
        if ($(this).hasClass("comment")) {
            type = "hcid";
            getF = "getComment";
            editF = "editComment";
            var hcid = $(this).data("hcid");
            getObj = {
                hcid: hcid
            };
            editObj = {
                hcid: hcid
            };
            id = hcid;
        }
        var form = function(fid, id, message, prev, type) {
            return '<form style="margin-bottom:40px" id="' + fid + '" data-' + type + '="' + id + '">' + '<textarea id="' + fid + 'abc" autofocus style="width:99%; height:125px">' + message + "</textarea><br />" + '<input type="submit" value="' + N.getLangData().EDIT + '" style="float: right; margin-top:5px" />' + '<button type="button" style="float:right; margin-top: 5px" class="preview" data-refto="#' + fid + 'abc">' + prev + "</button>" + '<button type="button" style="float:left; margin-top:5px" onclick="window.open(\'/bbcode.php\')">BBCode</button>' + "</form>";
        };

        N.json[getParentPostType($(this))][getF](getObj, function(d) {
            var fid = refto.data("id") + "editform";
            refto.html(form(fid, id, d.message, $(".preview").html(), type));
            var me = $(this);
            $("#" + fid).on("submit", function(e) {
                e.preventDefault();
                var me = $(this);
                N.json[getParentPostType(me)][editF]($.extend(editObj, {
                    message: $(this).children("textarea").val()
                }), function(d) {
                    if (d.status == "ok") {
                        refto.slideToggle("slow");
                        N.html[getParentPostType(me)][getF](getObj, function(o) {
                            refto.html(o);
                            refto.slideToggle("slow");
                            if (typeof N.getLangData().HIDE != "undefined") {
                                $(refto.find("ul.subnav")[0]).append('<li><a class="hide" data-postid="post' + id + '"><span class="rightarrow"></span>' + N.getLangData().HIDE + "</a></li>");
                            }
                        });
                    } else {
                        alert(d.message);
                    }
                });
            });
        });
    });
    plist.on("click", ".imglocked", function() {
        var me = $(this);
        var tog = function(d) {
            if (d.status == "ok") {
                var newsrc = me.attr("src");
                me.attr("class", "imgunlocked");
                me.attr("src", newsrc.replace("/lock.png", "/unlock.png"));
                me.attr("title", d.message);
            } else {
                alert(d.message);
            }
        };
        if (me.data("silent")) {
            N.json[getParentPostType(me)].reNotifyFromUserInPost({
                hpid: me.data("hpid"),
                from: me.data("silent")
            }, function(d) {
                tog(d);
            });
        } else {
            N.json[getParentPostType(me)].reNotifyForThisPost({
                hpid: me.data("hpid")
            }, function(d) {
                tog(d);
            });
        }
    });
    plist.on("click", ".imgunlocked", function() {
        var me = $(this);
        var tog = function(d) {
            if (d.status == "ok") {
                var newsrc = me.attr("src");
                me.attr("class", "imglocked");
                me.attr("src", newsrc.replace("/unlock.png", "/lock.png"));
                me.attr("title", d.message);
            } else {
                alert(d.message);
            }
        };
        if (me.data("silent")) {
            N.json[getParentPostType(me)].noNotifyFromUserInPost({
                hpid: me.data("hpid"),
                from: me.data("silent")
            }, function(d) {
                tog(d);
            });
        } else {
            N.json[getParentPostType(me)].noNotifyForThisPost({
                hpid: me.data("hpid")
            }, function(d) {
                tog(d);
            });
        }
    });
    plist.on("click", ".lurk", function() {
        var me = $(this);
        var tog = function(d) {
            if (d.status == "ok") {
                var newsrc = me.attr("src");
                me.attr("class", "unlurk");
                me.attr("src", newsrc.replace("/lurk.png", "/unlurk.png"));
                me.attr("title", d.message);
            } else {
                alert(d.message);
            }
        };
        N.json[getParentPostType(me)].lurkPost({
            hpid: me.data("hpid")
        }, function(d) {
            tog(d);
        });
    });
    plist.on("click", ".unlurk", function() {
        var me = $(this);
        var tog = function(d) {
            if (d.status == "ok") {
                var newsrc = me.attr("src");
                me.attr("class", "lurk");
                me.attr("src", newsrc.replace("/unlurk.png", "/lurk.png"));
                me.attr("title", d.message);
            } else {
                alert(d.message);
            }
        };
        N.json[getParentPostType(me)].unlurkPost({
            hpid: me.data("hpid")
        }, function(d) {
            tog(d);
        });
    });
    plist.on("click", ".bookmark", function() {
        var me = $(this);
        var tog = function(d) {
            if (d.status == "ok") {
                var newsrc = me.attr("src");
                me.attr("class", "unbookmark");
                me.attr("src", newsrc.replace("/bookmark.png", "/unbookmark.png"));
                me.attr("title", d.message);
            } else {
                alert(d.message);
            }
        };
        N.json[getParentPostType(me)].bookmarkPost({
            hpid: me.data("hpid")
        }, function(d) {
            tog(d);
        });
    });
    plist.on("click", ".unbookmark", function() {
        var me = $(this);
        var tog = function(d) {
            if (d.status == "ok") {
                var newsrc = me.attr("src");
                me.attr("class", "bookmark");
                me.attr("src", newsrc.replace("/unbookmark.png", "/bookmark.png"));
                me.attr("title", d.message);
            } else {
                alert(d.message);
            }
        };
        N.json[getParentPostType(me)].unbookmarkPost({
            hpid: me.data("hpid")
        }, function(d) {
            tog(d);
        });
    });
    plist.on("click", ".nerdz-code-title", function() {
        localStorage.setItem("has-dark-theme", localStorage.getItem("has-dark-theme") == "yep" ? "nope" : "yep");
        document.location.reload();
    });
    plist.on("click", ".nerdz-code-title a", function(e) {
        e.stopPropagation();
    });
    if ($("nav div").length) {
        var code = [ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ], pressed = [];
        window._NERDZ_NICK = $.trim(/,(.+)/.exec($("nav div").text())[1]);
        $(window).keydown(function dEv(e) {
            pressed.push(e.keyCode);
            while (pressed.length > code.length) {
                pressed.shift();
            }
            if (JSON.stringify(code) == JSON.stringify(pressed)) {
                $(window).unbind("keydown", dEv);
                $("body, a, textarea, input, button").css("cursor", 'url("http://www.nerdz.eu/static/images/owned.cur"), auto');
                var fuckNicknames = function() {
                    $(".nerdz_from a").each(function(i, elm) {
                        if ($.inArray($(elm).html(), [ "Vincenzo", "Xenom0rph", "jorgelorenzo97", "PTKDev" ]) === -1) {
                            $(elm).html([ "Vincenzo", "Xenom0rph", "jorgelorenzo97", "PTKDev" ][Math.floor(Math.random() * 5)]);
                        }
                    });
                };
                $(document).ajaxComplete(function(evt, xhr, settings) {
                    if (/\?action=(show|profile)$|read\.html/.test(settings.url)) {
                        fuckNicknames();
                    }
                });
                fuckNicknames();
                $("#title_left a").text("L4M3RZ");
                setTimeout(function() {
                    $("aside").hide();
                    setTimeout(function() {
                        $("article").hide();
                        $("#loadtxt").css("text-align", "center").html("Javascript error: Query #" + parseInt(1 + Math.floor(Math.random() * 1e3)) + " failed.<br><span style='color:#F80012;font-size:20px'>!! JS SQL Injection Detected. Shutting down !!</span>");
                        setTimeout(function() {
                            $("body").load("/bsod.html", function() {
                                document.title = "!! SOMETHING F**KED UP !!";
                                $("*").css("cursor", "none");
                            });
                        }, 5e3);
                    }, 9500);
                }, 10500);
            }
        });
    }
    setInterval(function() {
        var nc = $("#notifycounter"), val = parseInt(nc.html());
        nc.css("background-color", val === 0 || isNaN(val) ? "#FFF" : "#FF0000");
        var pc = $("#pmcounter");
        val = parseInt(pc.html());
        pc.css("background-color", val === 0 || isNaN(val) ? "#AFAFAF" : "#FF0000");
    }, 200);
});
