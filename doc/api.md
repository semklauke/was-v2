# REST API Documentation

## Open Endpoints

### - `/login` [[api/login.md](api/login.md)]   
* Frontend and API for login and obtaining the session secret to authorize the secure endpoints  

## API Endpoints (Secured)

### - `/api/walker` [[api/walker.md](api/waker.md)]
### - `/api/donation` [[api/donation.md](api/donation.md)]

## Post Processing/API Endpoints (Secured)

### - `/post/class` [[api/class.md](api/class.md)]
* Informations about what each walker has to pay sorted by class/course

### - `/post/final` [[api/final.md](api/final.md)]
* Informations about what each walker payed sorted by class/course

### - `/post/form` [[api/form.md](api/form.md)]
* Donations recipts sorted by class/course

## Database schema
Best practice is to just work with the REST API provided.
If the API is not sufficing or you want to learn about the internal data structure,
look at the **/migrations** folder. It contains the migartions building the SQLite database in the background.
Or use the very helpful sqlite command line untilies to look into the schema of the database created by the backend 
## Conventions

For `POST`, `PUT`, `DELETE` requests you (should 😅) always get a json response back  
On succes:
```typescript
{
  success: "Success",
  rec_id: <id of the object created/updated/deleted>
}
```  
On Error:
```typescript
{
  error: <error message>,
  errorid: <errorid, see list of errorids>
}
```
`GET` request look simular, but on success they do not contain the *rec_id* property, istead they have a object that contains the data.
The name of the data object depends on the endpoint

## Security

* Https is required, the certificate is self signed
* Authentication with Session IDs, Timeout default 1 day
* Passport.js is used for the implementation