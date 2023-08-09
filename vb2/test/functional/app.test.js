const dotenv = require("dotenv");
dotenv.config();

const loadExpress = require ("../../loaders/express.js");
const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION_TEST;
const DB_CONNECTION_OPTIONS = JSON.parse(process.env.DATABASE_CONNECTION_OPTIONS);
const CORS_OPTIONS = JSON.parse(process.env.CORS_OPTIONS);
const connectMongoose = require("../../loaders/database");

const {MongoClient} = require("mongodb");
const request = require("supertest");
const mongoose = require("mongoose");

let client = null;
let app = null;
const validUnusedIds = [
    ["0000004ccf8208cd47d51e62"],
   
];
const validRootId = [
    ["61a76d61394acba6dbfa0d82"]
    
];

const {users, usersIncludingPasswords, tasks} = require("./data");

beforeAll(async () => {
    await connectMongoose(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS);
    app = loadExpress(CORS_OPTIONS);

    client = new MongoClient(DATABASE_CONNECTION);
    await client.connect();
})

afterAll(async () => {
    await mongoose.connection.close();
    await client.close();
})


beforeEach(async () => {
    const database = client.db();
    await database.collection("users").drop();
    await database.collection("tasks").drop();
    await database.collection("users").insertMany(users);
    await database.collection("tasks").insertMany(tasks);
});

describe("app", () => {
   
    describe("get /user/users ", () => {

        it("should return message 403 if correct :id is provided but no token",
        async () => {
            let id = String(users[0]._id);
            await request(app)
                .get(`/user/users`)
                .expect(403);
        });

        it("should return 200 if an user has an admin role",
        async () => {
            const username = usersIncludingPasswords[2].username;
            const password = usersIncludingPasswords[2].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .get(`/user/users`)
                .set("Cookie", [`token=${token}`])
                .expect(200);
        });
        it("should return 401 if user doesn't have an admin role",
        async () => {
            const username = usersIncludingPasswords[1].username;
            const password = usersIncludingPasswords[1].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .get(`/user/users`)
                .set("Cookie", [`token=${token}`])
                .expect(401);

        });

    });
    describe("get /user/tasks", () => {
        it("should return statuscode 403 if username and password are not provided",
        async () => {
            await request(app)
                .get("/user/tasks")
                .expect(403)
        });

        it("should return 401 if user doesn't have an admin rol",
        async () => {
            const username = usersIncludingPasswords[0].username;
            const password = usersIncludingPasswords[0].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .get(`/user/tasks`)
                .set("Cookie", [`token=${token}`])
                .expect(401);
        });

        it("should return 200 if user has an admin rol",
        async () => {
            const username = usersIncludingPasswords[2].username;
            const password = usersIncludingPasswords[2].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .get(`/user/tasks`)
                .set("Cookie", [`token=${token}`])
                .expect(200);
        });
    });

 
    describe("post /user/allow ", () => {

        it("should return message 403 if correct :id is provided but no token",
        async () => {
            let id = String(users[0]._id);
            await request(app)
                .post(`/user/allow`)
                .expect(403);
        });
        it("should return message 401 if user is doesn't have an admin rol",
        async () => {
            const username = usersIncludingPasswords[0].username;
            const password = usersIncludingPasswords[0].password;
            const taskId = tasks[1]._id;
            const userId = users[0]._id;
            const response  = await request(app)
            .post("/user/login")
            .send({ username, password })
            .expect(200);
        const cookie = response.headers['set-cookie'].pop().split(';')[0];
        expect(cookie).toMatch(/^token=/);
        const token = cookie.substring(6);
        const id = String(users[1]._id);
        await request(app)
            .post(`/user/allow`)
            .set("Cookie", [`token=${token}`])
            .send({taskId, userId })
            .expect(401);
           
        });
        it("should return error if user has an admin rol but without userId ",
        async () => {
            const username = usersIncludingPasswords[2].username;
            const password = usersIncludingPasswords[2].password;
            const taskId = tasks[1]._id;
          

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .post(`/user/allow`)
                .set("Cookie", [`token=${token}`])
                .send({taskId})
                .expect(400);
        });
        it("should return error if user has an admin rol but without userId ",
        async () => {
            const username = usersIncludingPasswords[2].username;
            const password = usersIncludingPasswords[2].password;
          

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .post(`/user/allow`)
                .set("Cookie", [`token=${token}`])
                .send()
                .expect(400);
        });
        it("should return error if user has an admin rol but without taskId ",
        async () => {
            const username = usersIncludingPasswords[2].username;
            const password = usersIncludingPasswords[2].password;
           
            const userId = users[0]._id;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .post(`/user/allow`)
                .set("Cookie", [`token=${token}`])
                .send({userId})
                .expect(400);
        });
        it("should return 200 if user has an admin rol",
        async () => {
            const username = usersIncludingPasswords[2].username;
            const password = usersIncludingPasswords[2].password;
            const taskId = tasks[1]._id;
            const userId = users[0]._id;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .post(`/user/allow`)
                .set("Cookie", [`token=${token}`])
                .send({taskId, userId})
                .expect(201);
        });
    });
    describe("post /user/login", () => {

        it("should return statuscode 401 if username and password are not provided",
        async () => {
            await request(app)
                .post("/user/login")
                .expect(401)
        });

        it("should return statuscode 401 if wrong password is provided",
        async () => {
            const username = usersIncludingPasswords[0].username;
            await request(app)
                .post("/user/login")
                .send({ username, password:"wrongpassword1" })
                .expect(401);
        });

        it("should return message 200 if username and password are correct",
        async () => {
            const username = usersIncludingPasswords[0].username;
            const password = usersIncludingPasswords[0].password;
            await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
        });

        it("should contain user and token if username and password are correct",
        async () => {
            const username = usersIncludingPasswords[0].username;
            const password = usersIncludingPasswords[0].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const user = response.body.user;
            expect(user).toBeDefined();
            expect(token).toBeDefined();
            expect(user.username).toEqual(username);
        });
    });

    describe("get /user/:id/task ", () => {

        it("should return message 403 if correct :id is provided but no token",
        async () => {
            let id = String(users[0]._id);
            await request(app)
                .get(`/user/${id}/task`)
                .expect(403);
        });

        it("should return message 401 if a user tries to access another user's tasks",
        async () => {
            const username = usersIncludingPasswords[0].username;
            const password = usersIncludingPasswords[0].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substring(6);
            const id = String(users[1]._id);
            await request(app)
                .get(`/user/${id}/task`)
                .set("Cookie", [`token=${token}`])
                .expect(401);
        });

        it("should return message 200 if correct :id and correct token is provided",
        async () => {
            const username = usersIncludingPasswords[0].username;
            const password = usersIncludingPasswords[0].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const user = response.body.user;
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substr(6);
            const id = String(user._id);
            await request(app)
                .get(`/user/${id}/task`)
                .set("Cookie", [`token=${token}`])
                .expect(200);
        });
        it("should return message 200 if correct :id and correct token is provided but has an admin role",
        async () => {
            const username = usersIncludingPasswords[2].username;
            const password = usersIncludingPasswords[2].password;

            const response  = await request(app)
                .post("/user/login")
                .send({ username, password })
                .expect(200);
            const user = response.body.user;
            const cookie = response.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).toMatch(/^token=/);
            const token = cookie.substr(6);
            const id = String(users[0]._id);
            await request(app)
                .get(`/user/${id}/task`)
                .set("Cookie", [`token=${token}`])
                .expect(200);
        });

    });
})


