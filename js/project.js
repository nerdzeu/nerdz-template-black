$( document ).ready( function ( ) {
    $( "#stdfrm" ).on( 'submit', function ( e ) {
        e.preventDefault( );
        $( "#pmessage" ).html( N.getLangData( ).LOADING + '...' );
        var news = $( "#sendnews" );
        var issue = $( "#sendissue" );
        N.json.project.newPost( {
            message: $( "#frmtxt" ).val( ),
            to: $( this ).data( 'to' ),
            news: news.length && news.is( ':checked' ) ? '1' : '0',
            issue: issue.length && issue.is( ':checked' ) ? '1' : '0',
            language: $( this ).find( '[name="lang"]' ).val( )
        }, function ( data ) {
            if ( data.status == 'ok' ) {
                $( "#showpostlist" ).click( );
                $( "#frmtxt" ).val( '' );
            }
            $( "#pmessage" ).html( data.message );
            setTimeout( function ( ) {
                $( "#pmessage" ).html( '' );
            }, 5000 );
        } );
    } );
} );
