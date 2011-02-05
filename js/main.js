var ws = null
$(document).ready( function() {
    ws = new WebSocket("ws://localhost:8000");
    ws.onopen = function(evt) {
        console.log('Connected');
        ws.send( JSON.stringify( {command: 'new_member', username: "mike"} ) );
        ws.send( JSON.stringify( {command: 'new_message', message: "Hello!"} ) );
    }
    ws.onmessage = function(args) {
        console.log('got message!', args);
        var data = JSON.parse(args.data);

        if( data.command === 'remove_member' ) {
            disconnectMember( data.member_id );
        }

        if (data.command === 'new_message' ) {
            appendMessage( data.message );
        }

        if (data.command === 'new_member' ){
            appendMember( data.member );
        }

        if (data.command === 'init' ){
            init( data.state );

        }
    }

    $('#new-message').focus( function() {
        console.log('focused!');

        $('#new-message').keypress( function(e) {
            if( e.keyCode == 13 ) {
                console.log('enter pressed!');
                console.log( $('#new-message').val() );

                postMessage( $('#new-message').val() );
                $('#new-message').blur();
            }
        });
    });
    $('#new-message').blur( function() {
        console.log('blured!');

        $('#new-message').unbind( 'keypress' );
    });
});

function appendMessage( message ){
    console.log('new message!!', message);
    $('#messages').append("<div class='message "+ message.color +"'>" + message.message + "</div>");
}

function appendMember( member ){
    console.log('new memeber!', member);
    var memberDiv = "<div id="+member.id+" class='player " + member.color + " " + member.status + "'>" + member.username + "</div>";
    $('#members').append(memberDiv);
}

function postMessage( message ){
    console.log('postMessage called!', message);
    ws.send( JSON.stringify( {command: 'new_message', message: message} ) );
}

function disconnectMember( id ) {
    $("#" + id).removeClass( 'connected' );
    $("#" + id).addClass( 'disconnected' );
}

function init( state ){
    console.log('initilizing!!')

    $.each( state.members , function(id, member) {
        console.log('    initing member', member);
        appendMember( member );
    });
    $.each( state.messages , function(index, message) {
        console.log('    initing message', message);
        appendMessage( message );
    });
}
