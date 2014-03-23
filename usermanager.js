// client object
function UserManager (options) {
	validNames = options.validNamesArray || [];
};

UserManager.prototype.verifyLogin = function(username)
{
	// ignore case of username - faster than calling toLowerCase() per array string check below
	username = username.toLowerCase();

	// check requested name against valid names
	console.log('validating username: [' + username + ']');

	for ( var i = 0; i < validNames.length; i++) {
		if ( validNames[i] === username ) {
			console.log('valid user name: ' + username);
			return true;
		}
	}

	console.log('invalid user name: ' + username);
	return false;
};

module.exports = UserManager;
