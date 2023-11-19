require("./utils");
require("dotenv").config();

const express = require('express');
const bcrypt = require("bcrypt");
const saltRounds = 12;

const db_users = include("database/users");
const db_utils = include("database/db_utils");
const success = db_utils.printMySQLVersion();

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/api/ISA/createuser', async (req,res)=> { // Post Signup
    let body = ""
        
    req.on('data', function(chunk) {
        if (chunk != null) {
            body += chunk
        }
    })

    req.on("end", async () => {
        let data = JSON.parse(body)
        
        let username = data.username
        let email = data.email

        let password = data.password
        let hashedPassword = bcrypt.hashSync(password, saltRounds);

        const created_user = db_users.createUser({
            username: username,
            email: email,
            password: hashedPassword
        })

        if (created_user) {
            console.log(created_user)
            res.status(201)
        } else {
            res.status(400).send(JSON.stringify(created_user))
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
