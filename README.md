# Let's Form a Team

## An Account Type-Based Authorization/Authentication System using Node JS

### Project Setup:

Setting up the Database first:

```sh
sudo -i -u postgres psql
create database hr_hero_db;
create user super_admin with encrypted password 'superadmin';
grant all privileges on database hr_hero_db to super_admin;
```

Setting up the project:

```sh
git clone https://github.com/thedrowsywinger/lets-form-a-team.git
cd lets-form-a-team
yarn
yarn dev
```

##### Running the seeder API first: (This can be automated)

URL (POST REQUEST): 127.0.0.1:3001/api/core/seeder
This API helps in seeding the initial requirement, which is having specific account types and creating a superadmin.
A super admin should have all power, meaning super admin can create managers and employees

###### Account Types:

Super Admin: 1
Manager: 2
Employee 3

##### Login:

URL: 127.0.0.1:3001/api/core/login/

Sample POST request

```sh
{
    "username": "superAdmin",
    "password": "super_admin1"
}
```

Sample Response:

```sh
{
    "message": "Succesful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwiaWF0IjoxNjYyMDQ0NDk0LCJleHAiOjE2NjIxMzA4OTR9.mFKmXAoViHdZ4M2icaI5Vf8s0NI2djehBJyeHFvZlxc",
    "profile": {
        "id": 1,
        "name": "Super Admin",
        "contactNumber": "01837645524",
        "email": "",
        "createdAt": "2022-08-31T16:25:59.318Z",
        "updatedAt": "2022-08-31T16:25:59.318Z",
        "userId": 1,
        "createdBy": null,
        "updatedBy": null
    }
}
```

This access token must be used in requests that require Authorization. The Authorization header must be set like this: "jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwiaWF0IjoxNjYyMDQ0NDk0LCJleHAiOjE2NjIxMzA4OTR9.mFKmXAoViHdZ4M2icaI5Vf8s0NI2djehBJyeHFvZlxc"

##### Refresh Access Token:

URL: 127.0.0.1:3001/api/core/refresh-token/

Sample POST request

```sh
{
    "accessToken": "jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwiaWF0IjoxNjYyMDQ0NDk0LCJleHAiOjE2NjIxMzA4OTR9.mFKmXAoViHdZ4M2icaI5Vf8s0NI2djehBJyeHFvZlxc"
}
```

Sample Response:

```sh
{
    "status": 200,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwiaWF0IjoxNjYyMDQ0NTEyLCJleHAiOjE2NjIxMzA5MTJ9.-c1WG5qMUo9CJCTgp8sYSctpIe6X9dYrCFHTGg8NPuM",
    "expires": "in 2 days"
}
```

##### Register Manager:

A superAdmin can only add a manager.
URL: 127.0.0.1:3001/api/core/register/user-profile/

Sample POST request

```sh
{
    "username": "manager1",
    "password": "Manager1",
    "name": "John Manager",
    "contactNumber": "01789652243",
    "email": "john@hrhero.com",
    "accountType": 2
}
```

Sample Response:

```sh
{
    "message": "Succesful",
    "data": {
        "id": 1,
        "username": "manager1",
        "name": "John Manager",
        "contactNumber": "01789652243",
        "email": "john@hrhero.com",
        "accountType": "Manager"
    }
}
```

##### Register Employee:

A super admin or a manager can add an employee
URL (POST REQUEST): 127.0.0.1:3001/api/core/register/user-profile/
Sample POST request:

```sh
{
    "username": "harryMaguire",
    "password": "Defender1",
    "name": "Harry Maguire",
    "contactNumber": "01789353343",
    "email": "harry@hrhero.com",
    "accountType": 3
}
```

Sample Response:

```sh
{
    "message": "Succesful",
    "data": {
        "id": 17,
        "username": "harryMaguire",
        "name": "Harry Maguire",
        "contactNumber": "01789353343",
        "email": "harry@hrhero.com",
        "accountType": "Employee"
    }
}
```

##### Login:

Authentication is done based on jwt web token and bcryptjs.
URL (POST REQUEST): 127.0.0.1:3001/api/core/login/
Sample POST request:

```sh
{
    "username": "manager1",
    "password": "Manager1"
}
```

Sample Response:

```sh
{
    "message": "Succesful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwiaWF0IjoxNjYxNjA5MjY1LCJleHAiOjE2NjE2OTU2NjV9.PyKoL6DJyYaNk2q6twAlmivBWzVE8Rbn_2rPKEaClYE",
    "profile": {
        "id": 1,
        "name": "John Manager",
        "contactNumber": "01789652243",
        "email": "john@hrhero.com",
        "createdAt": "2022-08-27T10:01:49.739Z",
        "updatedAt": "2022-08-27T10:01:49.739Z",
        "userId": 1,
        "createdBy": 2,
        "updatedBy": 2
    }
}
```

This access token must be used as "Authorization" Header Key with "jwt" as prefix.
Example:

```sh
Authorization Header: jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIyIiwiaWF0IjoxNjYxNjAwMDYwLCJleHAiOjE2NjE2ODY0NjB9.DautAcR8nOdT8a2Xfm_j45-cf9CzHNuu2tsVssGFY54
```

##### Get All Users:

URL (GET REQUEST): 127.0.0.1:3001/api/core/get-users/
EMPTY GET request:

Sample Response:

```sh
{
    "message": "Succesful",
    "data": [
        {
            "id": 2,
            "name": "Super Admin",
            "contactNumber": "01837645524",
            "email": "",
            "createdAt": "2022-08-27T10:08:57.452Z",
            "updatedAt": "2022-08-27T10:08:57.452Z",
            "userId": 2,
            "createdBy": null,
            "updatedBy": null
        },
        {
            "id": 1,
            "name": "John Manager",
            "contactNumber": "01789652243",
            "email": "john@hrhero.com",
            "createdAt": "2022-08-27T10:01:49.739Z",
            "updatedAt": "2022-08-27T10:01:49.739Z",
            "userId": 1,
            "createdBy": 2,
            "updatedBy": 2
        },
        {
            "id": 16,
            "name": "Scott Mctominay",
            "contactNumber": "01789653343",
            "email": "scott@hrhero.com",
            "createdAt": "2022-08-27T12:20:31.003Z",
            "updatedAt": "2022-08-27T12:20:31.003Z",
            "userId": 24,
            "createdBy": 2,
            "updatedBy": 2
        },
        {
            "id": 17,
            "name": "Harry Maguire",
            "contactNumber": "01789353343",
            "email": "harry@hrhero.com",
            "createdAt": "2022-08-27T12:23:02.423Z",
            "updatedAt": "2022-08-27T12:23:02.423Z",
            "userId": 25,
            "createdBy": 2,
            "updatedBy": 2
        }
    ]
}
```

##### Get User by id:

URL (GET REQUEST): 127.0.0.1:3001/api/core/get-user/?id=1

Sample Response:

```sh
{
    "message": "Succesful",
    "data": {
        "id": 1,
        "name": "John Manager",
        "contactNumber": "01789652243",
        "email": "john@hrhero.com",
        "createdAt": "2022-08-27T10:01:49.739Z",
        "updatedAt": "2022-08-27T10:01:49.739Z",
        "userId": 1,
        "createdBy": 2,
        "updatedBy": 2
    }
}
```
