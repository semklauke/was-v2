# `/api/walker` Endpoint

## Walker Object
JSON Object/Database entry that describes a walker. Refered in this document as *Walker*
```typescript 
interface Walker {
  rec_id?: number,
  class: string,
  distance_m: number,
  lastname: string,
  firstname: string,
  participates: number (0,1,2)
}
```

## Donation Object
JSON Object/Database entry that describes a donation related to a walker. Refered in this document as *Donation*
```typescript 
interface Donation {
  rec_id?: number,
  walker_id: number,
  donation_each_km: number,
  donation_amout_recived: number,
  needs_donation_receipt: number (0,1),
  donation_recived: number (0,1),
  zipcode?: number,
  city?: string,
  adrdess?: string,
  firstname: string,
  lastname: string
}
```

## GET `/api/walker/`
Get all Walker objects in the database
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
Create new Walker object in the database
### Request
* Content-Type: `application/json`
* Body:
```typescript
{
  walker: Walker,
  force_duplicate?: boolean,
  donations?: Donation[]
  
}
```
`force_duplicate` and `donations` are optinal
* `force_duplicate` needs to be `true` if you want to create a new walker in the database that has the exact same first and lastname as a walker that is already in the database
* if you directly want to create donations associated with this walker, you can add them to the `donations` array. You can always add/alter donations to the walker via the `/api/donation/` API Endpoint 
### Response
#### On success
* Content-Type: `application/json`
* Code: `200 OK`
* Body:
```typescript
{
  success: "Walker added",
  rec_id: <id of just create walker>
}
```
#### On Error
##### Duplicate Walker
If you try to create a walker and the exact combination of lastname and firstname is already in the database, you need to set `force_duplicate` to true. Otherwise this error occurs:
* Content-Type: `application/json`
* Code: `409 Conflict`
* Body:
```typescript
{
  error: "duplicate Walker detected. Please confirm.",
  errorid: 104,
  dupliacte: true
}
```
##### Other Error
* Content-Type: `application/json`
* Codes: `400 Bad Request` 


## GET `/api/walker/<walker_id>`
Get Walker Object with id `walker_id`
### Request
* (optinal): `/api/walker/<walker_id>?donations=true`  
If true, this request not only responds with the walker object but also with all the donations associated with this walker
### Response
#### On Success
* Content-Type: `application/json`
* Code: `200 OK`
* Body:
```typescript
{
  success: "Success",
  walker: Walker,
  donations?: Donations[]
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `404 Not Found` / `400 Bad Request` 


## PUT `/api/walker/<walker_id>`
Update Walker Object with id `walker_id`
### Request
* Content-Type: `application/json`
* Body:
```typescript
{
  walker: Walker,
  donations?: Donation[]
  
}
```
* (optinal): `/api/walker/<walker_id>?donations=true`  
If true, this request not only updates the walker object but also the donations associated with this walker that are specified in the `donations` parameter in the request json body.  
The donations **MUST CONTAIN** `rec_id`
### Response
#### On Success
* Content-Type: `application/json`
* Code: `201 CREATED`
* Body:
```typescript
{
  success: "Walker updated",
  rec_id: <id of just updated walker>
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `404 Not Found` / `400 Bad Request` 


## DELETE `/api/walker/<walker_id>`
Delete Walker Object with id `walker_id`
### Request
* (optinal): `/api/walker/<walker_id>?donations=true`  
If true, this request not only deletes the walker object but also the donations associated with this walker  
### Response
#### On Success
* Content-Type: `application/json`
* Code: `200 OK`
* Body:
```typescript
{
  success: "Walker deleted",
  rec_id: <id of just deleted walker>
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `404 Not Found`



































