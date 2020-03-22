# `/api/donation` Endpoint

&emsp;[<= Back](../api.md)  
* [GET `/api/donation`](#get-apidonation)
* [GET `/api/donation/<donation_id>`](#get-apidonationdonation_id)
* [PUT `/api/donation/<donation_id>`](#put-apidonationdonation_id)
* [DELETE `/api/donation/<donation_id>`](#delete-apidonationdonation_id)
* [POST `/api/donation`](#post-apidonation)
* [POST `/api/donation/walker/<walker_id>`](#post-apidonationwalkerwalker_id)
* [GET `/api/donation/walker/<walker_id>`](#get-apidonationwalkerwalker_id)
* [DELETE `/api/donation/walker/<walker_id>`](#delete-apidonationwalkerwalker_id)


## Walker Object
JSON Object/Database entry that describes a walker. Refered in this document as *Walker*
```typescript 
interface Walker {
  rec_id?: number,
  class: string,
  distance_m: number,
  lastname: string,
  firstname: string,
  participates: number //(0,1,2)
}
```

## Donation Object
JSON Object/Database entry that describes a donation related to a walker. Refered in this document as *Donation*
```typescript 
interface Donation {
  rec_id?: number,
  walker_id: number,
  donation_each_km: number,
  donation_amount_received: number,
  needs_donation_receipt: number, //(0,1)
  donation_received: number, //(0,1)
  zipcode?: number,
  city?: string,
  adrdess?: string,
  firstname: string,
  lastname: string
}
```



## GET `/api/donation/`
Get all Donation objects in the database
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
  donations: Donation[]
}
```
#### On Error
//TODO

## GET `/api/donation/<donation_id>`
Get Donation Object with id `donation_id`
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
  donation: Donation
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `404 Not Found`

## PUT `/api/donation/<donation_id>`
Update Donation Object with id `donation_id`
### Request
* Content-Type: `application/json`
* Body:
```typescript
{
  donation: Donation,
}
```
### Response
#### On Success
* Content-Type: `application/json`
* Code: `201 CREATED`
* Body:
```typescript
{
  success: "Donation updated",
  rec_id: <id of just updated donation>
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `404 Not Found`


## DELETE `/api/walker/<donation_id>`
Delete Donation Object with id `donation_id`
### Request
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


## POST `/api/donation/`
Create new Donation object in the database
### Request
* Content-Type: `application/json`
* Body:
```typescript
{
  donation: Donation,  
}
```
The Donation object **MUST CONTAIN** a valid `walker_id`
### Response
#### On success
* Content-Type: `application/json`
* Code: `200 OK`
* Body:
```typescript
{
  success: "Donation added",
  rec_id: <id of just create donation>
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `400 Bad Request` /  `404 Not Found`

## POST `/api/donation/walker/<walker_id>`
The same as `POST /api/donation/` but the walker_id is specified in the request parameter `walker_id` not in the json Donation object in the request body.

## GET `/api/donation/walker/<walker_id>`
Get Donations from the walker with id `walker_id`
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
  donations: Donations[]
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `404 Not Found` / `400 Bad Request`

## DELETE `/api/donation/walker/<walker_id>`
Delete Donations from the walker with id `walker_id`
### Request
* No parameters
### Response
#### On Success
* Content-Type: `application/json`
* Code: `200 OK`
* Body:
```typescript
{
  success: "Donations deleted",
  rec_id: <id of deleted donations walker>
}
```
#### On Error
* Content-Type: `application/json`
* Codes: `404 Not Found` / `400 Bad Request` 






























