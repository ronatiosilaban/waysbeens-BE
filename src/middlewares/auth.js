// const jwt = require("jsonwebtoken");

// exports.auth = (req, res, next) => {
//     const authHeader = req.header("Authorization");
//     const token = authHeader && authHeader.split(" ")[1];
//     // check if user send token via Authorization header or not
//     if (!token) {
//         // rejected request and send response access denied
//         return res.status(401).send({ message: "Access denied!" });
//     }

//     try {
//         const verified = jwt.verify(token, process.env.TOKEN_KEY); //verified token
//         req.user = verified;
//         next(); // if token valid go to the next request
//     } catch (error) {
//         // if token not valid send response invalid token
//         res.status(400).send({ message: "Invalid token" });
//     }
// };
const jwt = require("jsonwebtoken")

exports.auth = (req, res, next) => {

    const authHeader = req.header("Authorization")

    const token = authHeader && authHeader.split(' ')[1]
    console.log(token);

    if (!token) {
        return res.status(401).send({
            message: "Access Denied!"
        })
    }




    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
        console.log(process.env.TOKEN_KEY);

        req.user = verified
        next()
    } catch (error) {
        res.status(400).send({ message: "Invalid Token" })
    }
};
