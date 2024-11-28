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

describe('User metadata endpoints', () => {
    let token = "";
    let avatarId = '';
    // basically what this does is verify if the user has either signed in or signed up then from there he can us other functionalities
    beforeAll( async () => {
        const username = `chi-${Math.random()}`
        const password = '123456';

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type:"admin"
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        token = response.data.token
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            'name': 'Samy'
        })

        avatarId = avatarResponse.data.avatarId;
    })

    test('User cannot update their metadata with a wrong avatar id', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: '12121212'
        }, {
            headers: {
                'authorization': `Bearer ${token}` 
            }
        } )
        expect(response.statusCode).toBe(400)
    })

    test('User can update their metadata with the right avatar Id', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            headers: {
                'authorization': `Bearer ${token}` 
            }
        })
        expect(response.statusCode).toBe(200)
    })

    test('User is not able to update their metadata if the Auth header is not present', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        })
        expect(response.statusCode).toBe(403)
    })

})

describe("User avatar information", () => {
    let avatarId;
    let token;
    let userId;
    beforeAll( async () => {
        const username = `chi-${Math.random()}`
        const password = '123456';

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type:"admin"
        })

        userId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        token = response.data.token
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            'name': 'Samy'
        })

        avatarId = avatarResponse.data.avatarId;
    })

    test('Get back avatar information for a user', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)

        expect(response.data.avatars.length).toBe(1);
    })
})