const jwt = require('jsonwebtoken');
const secret = '123';

const token = jwt.sign({
    name: 'Hyram'
}, secret, {
    expiresIn: 60
});

console.log(token);

jwt.verify(token, secret, function (err, decoded) {
    if (!err) {
        console.log(decoded);
    }
});