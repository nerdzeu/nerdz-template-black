$(document).ready(function() {
    var loading = N.getLangData().LOADING;

    $("#stdfrm").on('submit',function(event) {
        event.preventDefault();
         $("#pmessage").html(loading+'...');
         var news  = $("#sendnews");
         var issue = $("#sendissue");

         if(news.length) {
             news = news.is(':checked') ? '1' : '0';
         }
         else {
             news = '0';
         }

         if(issue.length) {
             issue = issue.is(':checked') ? '1' : '0';
         }
         else {
             issue = '0';
         }

         N.json.project.newPost({
             message: $("#frmtxt").val(),
             to: $(this).data('to'),
             news: news,
             issue: issue },
         function(data) {
            if(data.status == 'ok') {
                $("#showpostlist").click();
                $("#frmtxt").val('');
            }
            
            $("#pmessage").html(data.message);

            setTimeout(function() {
                        $("#pmessage").html('');
                        },5000);
        });
    });

    $("#follow").click(function() {
        var me = $(this);
        me.html('...');
        N.json.project.follow({id: $(this).data('id')},function(d) {
            me.html(d.message);
            me.off('click');
        });
    });

    $("#unfollow").click(function() {
        var me = $(this);
        me.html('...');
        N.json.project.unfollow({id: $(this).data('id')},function(d) {
            me.html(d.message);
            me.off('click');
        });
    });
});
