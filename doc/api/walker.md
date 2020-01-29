# `/api/walker` Endpoint

## Walker Obejct
```typescript 
{
  rec_id: number,
  class: string,
  distance_m: number,
  lastname: string,
  firstname: string,
  participates: number (0,1,2)
}
```

## GET `/api/walker/`
### Request
* No parameters
### Response
#### On Success
* Content-Type: `application/json`
* Code: `200 OK`
* Body:
```typescript
{
  success: "Success",
  walker: Walker[]
}
```
#### On Error
//TODO

## POST `/api/walker/`
### Request
* Content-Type: `application/json`

### Response
* Content-Type: `application/json`
* Code: `200 OK`
* Body:
```typescript
{
  success: "Success",
  walker: Walker[]
}
```

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