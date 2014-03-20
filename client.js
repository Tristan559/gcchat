// client object
function Client (options) {
	validNames = options.validNamesArray || [];
};

Client.prototype.verifyLogin = function(username)
{
	// ignore case of username - faster than calling toLowerCase() per array string check below
	username = username.toLowerCase();

	// check requested name against valid names
	console.log('validating username: ' + username);

	for ( var i = 0; i < validNames.length; i++) {
		if ( validNames[i].match(username) ) {
			console.log('valid user name: ' + username);
			return true;
		}
	}

	console.log('invalid user name: ' + username);
	return false;
};

module.exports = Client;
