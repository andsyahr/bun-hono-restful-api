# User API Spec

## Registrasi User

Endpoint : **POST /api/users**

Request Body :

```json
{
  "username": "andsyahr",
  "password": "password",
  "name": "Andi Muh. Syahrul"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "andsyahr",
    "name": "Andi Muh. Syahrul"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username is required, Password is required, Name is required"
}
```

## Login User

Endpoint : **POST /api/users/login**

Request Body :

```json
{
  "username": "andsyahr",
  "password": "password",
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "andsyahr",
    "name": "Andi Muh. Syahrul",
    "token": "token"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username is required, Password is required"
}
```
## Get User

Endpoint : **GET /api/users/current**

Request Header : 
- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "username": "andsyahr",
    "name": "Andi Muh. Syahrul"
  }
}
```

## Update User

Endpoint : **PATCH /api/users/current**

Request Header : 
- Authorization: token

Request Body :

```json
{
  "name": "Andi Muh. Syahrul",
  "password": "password"
}
```

Response Body (Success) :

```json
{
  "data": {
    "name": "Andi Muh. Syahrul",
    "password": "password"
  }
}
```

## Logout User

Request Header : 
- Authorization: token

Endpoint : **DELETE /api/users/current**

Response Body (Success) :

```json
{
  "data": true
}
```