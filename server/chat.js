var Chat = function() {
    //this.members = {};
    //this.messages = [];
    this.state = this.buildState();
    this.colors = ['gray', 'red', 'blue', 'orange', 'magenta', 'cyan', 'olive', 'brown', 'teal', 'green'];
}

Chat.prototype.buildState = function() {
    var newState = {members: {}, messages: [], member_count: 0};
    return newState;
}

Chat.prototype.addMessage = function(conn, message) {
    var message = {
        user_id: conn.id,
        message: this.replaceUrls(message),
        color: this.getMemberColor( conn.id )
    };

    this.state.messages.push( message );

    return message;
}

Chat.prototype.addMember = function(conn, username, gravatar_hash) {
    var member = this.checkForMember(username);
    if( !member ) {
        this.state.member_count += 1;

        member = {
            id: conn.id,
            username: username, 
            status: 'connected',
            gravatar_hash: gravatar_hash,
            is_new: true,
            color: this.colors.shift()
        };
        this.state.members[conn.id] = member;
    } else {
        var old_id = member.id;

        member.status = 'connected';
        member.id = conn.id;

        this.state.members[old_id] = null;
        this.state.members[conn.id] = member;
    }


    return member;
}

Chat.prototype.getMemberColor = function(id) {
    return this.state.members[id].color;
}

Chat.prototype.getState = function(){
    return this.state;
}

Chat.prototype.replaceUrls = function(message) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return message.replace(exp,"<a target='_blank' href='$1'>$1</a>"); 
}

Chat.prototype.checkForMember = function(username) {
    for( var i in this.state.members ) {
        var member = this.state.members[i];
        if( member && member.username == username ) {
            return member;
        }
    }
    return null;
}

Chat.prototype.oldifyMember = function( id ) {
    this.state.members[id].is_new = false;
}

exports.Chat = Chat;
