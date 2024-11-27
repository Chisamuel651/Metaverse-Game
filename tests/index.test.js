const { default: axios } = require("axios");

function sum(a,b){
    return a + b;
}

const BACKEND_URL = 'http://localhost:3000'

// describe blocks
describe("Authentication", () => {
    test('User is able to SignUp judt once', async () => {
        const username = 'chi' + Math.random();
        const password = '12345678';

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type:"admin"
        })
        
        expect(response.statusCode).toBe(200)

        const updateResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type:"admin"
        })
        
        expect(updateResponse.statusCode).toBe(400)
    });

    test('sign up request fails if the user is empty', async () => {
        const username = 'chi' + Math.random();
        const password = '1234555'

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password,
            type:"admin"
        })
        
        expect(response.statusCode).toBe(400)
    })

    test('Signin succeeds if the username and password are correct', async() => {
        const username = `chi-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(200)
        expect(response.data.token).toBeDefined()
        
    })

    test('Signin fails if the username and password are incorrect', async() => {
        const username = `chi-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongUsername",
            password
        })

        expect(response.status).toBe(403)
    })
})




