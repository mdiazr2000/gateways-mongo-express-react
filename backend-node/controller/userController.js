const User = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Ajv = require("ajv")
const ajv = new Ajv()

const betterAjvErrors = require('better-ajv-errors').default;

const requestCreateUser = {
    type: "object",
    properties: {
        first_name: {type: "string"},
        last_name: {type: "string"},
        email: {type: "string"},
        password: {type: "string"}
    },
    required: ["first_name", "last_name", "email", "password"],
    additionalProperties: false
}

const requestLoginUser = {
    type: "object",
    properties: {
        email: {type: "string"},
        password: {type: "string"}
    },
    required: ["email", "password"],
    additionalProperties: false
}

const registerUser = async (first_name, last_name, email, password) => {

    // Our register logic starts here
    try {

        // Validate user input

        const data = {first_name: first_name,last_name: last_name,  email: email,password: password }
        const validate = ajv.compile(requestCreateUser);
        const valid = ajv.validate(requestCreateUser, data)
        if (!valid) {
            const output = betterAjvErrors(requestCreateUser, data, validate.errors, {format: "js"});
            return {
                status: 400,
                message: "Validation errors",
                errors: output
            }
        }


        if (!(email && password && first_name && last_name)) {
            return {
                status: 400,
                user: null,
                message: "All input is required"
            }
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({email});

        if (oldUser) {
            return {
                status: 409,
                user: oldUser,
                message: "User Already Exist. Please Login"
            }
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });
        
        // Find the user
        const userFound = await User.find({
            email: email.toLowerCase()
        });

        return {
            status: 201,
            user: userFound,
            message: "User registered"
        }

    } catch (err) {
        return {
            status: 500,
            user: null,
            errors: "Error on server"
        }
    }

};

const loginUser = async ( email, password) => {
    // Our login logic starts here
    try {

        // Validate user input

        const data = { email: email,password: password }
        const validate = ajv.compile(requestLoginUser);
        const valid = ajv.validate(requestLoginUser, data)
        if (!valid) {
            const output = betterAjvErrors(requestLoginUser, data, validate.errors, {format: "js"});
            return {
                status: 400,
                message: "Validation errors",
                errors: output
            }
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            let userModify = await User.findOneAndUpdate({email: user.email}, {
                "$set": {
                    "token": token
                }
            }, {
                new: true
            });

            return {
                status: 200,
                token: userModify.token,
                message: "Login succesfully"
            }


        }

        return {
            status: 400,
            token: null,
            message: "Invalid Credentials"
        }

    } catch (err) {
        return {
            status: 500,
            token: null,
            errors: "Error on server"
        }
    }
    // Our register logic ends here
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
