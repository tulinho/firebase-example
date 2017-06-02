require("./index.scss");

const USER_NAME_COLORS = ['red-text', 'blue-text', 'pink-text', 'purple-text', 'indigo-text', 'green-text', 'orange-text', 'brown-text'];
const USER_COLOR = USER_NAME_COLORS[Math.floor(Math.random() * 100) % USER_NAME_COLORS.length]; 

$(document).ready(function(){

	let messageTemplate = document.querySelector('#message-template');

	$('#send-button').click(appendMessage);

	function appendMessage(){
		let textMessage = $('#message').val();
		if(!!textMessage){
			writeMessage('Anônimo', textMessage, USER_COLOR);
			$('#message').val('');
		}
	}

	function writeMessage(userName, message, userNameColor){
		messageTemplate.content.querySelector('.name-span').className += (' ' + userNameColor);
		messageTemplate.content.querySelector('.name-highlight').textContent = userName;
		messageTemplate.content.querySelector('.message-span').textContent = message;
		let clone = document.importNode(messageTemplate.content, true);
		document.querySelector('#messages-container').appendChild(clone);
	}

});
