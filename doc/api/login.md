# `/login` Endpoint

## GET `/login`
### Request
* No parameters
### Response
* Content-Type: `text/html`
* Code: `200 OK`
* HTML page to put in password and username in order to log in 

## POST `/login`
### Request
* Content-Type: `application/x-www-form-urlencoded`
* query: none
* body:
```typescript 
username: "Hans Peter"
password: <password specified in /src/includes/config.ts>
```
### Resposne
#### On Success
* Redirect `301` to `\`
* sets session id and token to authenticate
#### On Error
* Redirect `301` to  `GET \login`