const database = include("database_connection");

async function createUser(postData) {
	let createUserSQL = `
		INSERT INTO users
		(username, password, email, is_admin)
		VALUES
		(:username, :password, :email, 2);
	`;

	let params = {
		username: postData.username,
		email: postData.email,
		password: postData.password,
	};

	try {
		const results = await database.query(createUserSQL, params);

		console.log("Successfully created user");
		console.log(results[0]);
		return true;
	} catch (err) {
		console.log("Error inserting user");
		console.log(err);
		return false;
	}
}

async function getUser(postData) {
	let getUserSQL = `
		SELECT user_id, username, email, hashedPassword
		FROM users
		WHERE email = :email;
	`;

	let params = {
		email: postData.email,
	};

	try {
		const results = await database.query(getUserSQL, params);

		console.log("Successfully found user");
		console.log(results[0]);
		return results[0];
	} catch (err) {
		console.log("Error trying to find user");
		console.log(err);
		return false;
	}
}

module.exports = {
	createUser,
	getUser,
};