
const users = require('./data.json');
const { User } = require('./user');


function main() {
    const u = Object.keys(users);
    const o = [];

    u.forEach(e => {
        let user = new User(e, users[e]);
        o.push(user);
        user.print();
    });
}

main();