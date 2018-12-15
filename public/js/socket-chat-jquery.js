var params = new URLSearchParams(window.location.search);
var username = params.get('name');
var chat = params.get('chat');

var divUsers = $('#divUsers');
var divForm = $('form#send')
var divTxtMessage = divForm.find('#messageInput');
var divChatbox = $('#divChatbox')

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function renderUsers(users) {
    var html = '<li>' +
    '    <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('chat') + '</span></a>' +
    '</li>';

    for (let index = 0; index < users.length; index++) {
        const element = users[index];

        html += '<li>' +
        '  <a data-id="' + element.id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + element.name + ' <small class="text-success">online</small></span></a>' +
        '</li>';
    }

    divUsers.html(html);
}

function renderMessage(message, mine) {

    var date = new Date(message.date*1000);
    var hour = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';
    if (message.name == 'admin') {
        adminClass = 'danger';
    }

    if (mine) {
        var html = '<li class="animated fadeIn">' +
        '    <div class="chat-img"><img src="assets/images/users/2.jpg" alt="user" /></div>' +
        '    <div class="chat-content">' +
        '        <h5>' + message.name + '</h5>' +
        '        <div class="box bg-light-inverse">' + message.message + '</div>' +
        '    </div>' +
        '    <div class="chat-time">' + hour + '</div>' +
        '</li>';
    } else {
        var html = '<li class="reverse animated fadeIn">' +
        '    <div class="chat-content">';
        if (message.name !== 'admin') {
            html += '        <h5>' + message.name + '</h5>';
        }
        html += '        <div class="box bg-light-'+ adminClass + '">' + message.message + '</div>' +
        '    </div>';
        if (message.name !== 'admin') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-time">' + hour + '</div>' +
        '</li>';
    }

    divChatbox.append(html);
}

// Listeners
divUsers.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id)
    }
});

divForm.on('submit', function(e) {
    var messageText = divTxtMessage.val();

    e.preventDefault();

    if (messageText.trim().length <= 0) {
        return;
    }

    socket.emit('message.chat', {
        name: username,
        message: messageText,
    }, function(resp) {
        divForm.find('#messageInput').val('').focus();
        renderMessage(resp, true);
        scrollBottom()
    });
})

