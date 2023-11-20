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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})

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

        const created_user = await db_users.createUser({
            username: username,
            email: email,
            password: hashedPassword
        })

        if (created_user) {
            res.status(201).send(JSON.stringify({
                message: "Entry created successfully",
                action: "success",
                success: true,
                info: {username: username, email: email}
            }))
        } else {
            res.status(400).send(JSON.stringify({
                message: "Error inserting user to the database",
                action: "error",
                success: false,
                info: {username: username, email: email}
            }))
        }
    })
});

app.post("/api/ISA/login", async (req, res) => {
    let body = ""
        
    req.on('data', function(chunk) {
        if (chunk != null) {
            body += chunk
        }
    })

    req.on("end", async () => {
        let data = JSON.parse(body)
        
        let username = data.username
        let password = data.password

        const grabbed_user = await db_users.getUser({
            username: username
        })

        if (grabbed_user) {
            if (grabbed_user.length == 1) {
                if (bcrypt.compareSync(password, grabbed_user[0].password)) {
                    res.status(200).send(JSON.stringify({
                        message: "Found user, logging in",
                        action: "success",
                        success: true,
                        info: grabbed_user
                    }))
                } else {
                    console.log("wrong password")
                    res.status(401).send(JSON.stringify({
                        message: "Incorrect password", 
                        action: "invalid", 
                        success: false
                    }))
                }
            } else {
                res.status(401).send(JSON.stringify({
                    message: "Invalid number of users found",
                    action: "invalid",
                    success: false,
                    info: grabbed_user
                }))
            }
        } else {
            res.status(401).send(JSON.stringify({
                message: "No user matches info sent",
                action: "missing",
                success: false,
                info: grabbed_user
            }))
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
