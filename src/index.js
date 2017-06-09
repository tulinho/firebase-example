require("./index.scss");

const USER_NAME_COLORS = ['red-text', 'blue-text', 'pink-text', 'purple-text', 'indigo-text', 'green-text', 'orange-text', 'brown-text'];
const USER_COLOR = USER_NAME_COLORS[Math.floor(Math.random() * 100) % USER_NAME_COLORS.length]; 

let config = {
	apiKey: "AIzaSyA-Qa2wkNUcvEoh5D7YcwC-eDwnOEBC2PY",
	authDomain: "mychatapp-7e450.firebaseapp.com",
	databaseURL: "https://mychatapp-7e450.firebaseio.com",
	projectId: "mychatapp-7e450",
	storageBucket: "mychatapp-7e450.appspot.com",
	messagingSenderId: "487649740643"
};

$(document).ready(function(){

	firebase.initializeApp(config);
	let auth = firebase.auth();
	let database = firebase.database();
	let storage = firebase.storage();

	var user = '';

	let messageTemplate = document.querySelector('#message-template');

	$('#send-button').click(appendMessage);

	function appendMessage(){
		let textMessage = $('#message').val();
		if(!!textMessage){
			database.ref('messages').push({
				user: (user.displayName || 'Anônimo'),
				text: textMessage,
				color: USER_COLOR
			});
			$('#message').val('');
		}
	}

	/* Database access */
	database.ref('/messages').on('child_added', onChildAdded);

	function onChildAdded(messageSnapshot){
		let message = messageSnapshot.val();
		writeMessage(message.user, message.text, message.color);
		let height = $('#messages-container')[0].scrollHeight;
		$('#messages-container').scrollTop(height);
	}

	function writeMessage(userName, message, userNameColor){
		messageTemplate.content.querySelector('.name-span').className = ('name-span ' + userNameColor);
		messageTemplate.content.querySelector('.name-highlight').textContent = userName;
		messageTemplate.content.querySelector('.message-span').textContent = message;
		let clone = document.importNode(messageTemplate.content, true);
		document.querySelector('#messages-container').appendChild(clone);
	}


	/* User authentication */
	$('#log-in').click(onLogin);

	function onLogin(){
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('profile');
		provider.addScope('email');
		auth.signInWithPopup(provider).then(onLoginSucceed);
	}

	function onLoginSucceed(result) {
		user = result.user;
	}

	firebase.auth().onAuthStateChanged(onAuthStateChanged);

	function onAuthStateChanged(loggedUser) {
		if(!!loggedUser){
			user = loggedUser;
			$('#log-in').attr('disabled', true);
		}
		else{
			user = '';
			$('#log-in').attr('disabled', false);
		}
	}

});
