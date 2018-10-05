# node-rest-api

## Configuration
Create a copy of /app/config/development.sample.js and change the following values:
~~~~
// mySQL DB
database : {
    "host": "192.168.33.50",
    "user": "root",
    "password": "root",
    "database": "apidb"
},
allowOrigin: "https://local.restapi.com.br"
~~~~

## Database
Create contact table
~~~~
// mySQL DB
database : {
    "host": "192.168.33.50",
    "user": "root",
    "password": "root",
    "database": "apidb"
},
allowOrigin: "https://local.restapi.com.br"
~~~~

## API References

### LIST contact
/GET /contact/{CONTACT_ID} (optional)

### ADD contact
/POST /contact
~~~~
{
    "email": "teste@gmail.com",
    "phone": "1123456789"
}
~~~~

### UPDATE contact
/PUT /contact/{CONTACT_ID}
~~~~
{
    "email": "teste@gmail.com",
    "phone": "1123456789"
}
~~~~

### DELETE contact
/DELETE /contact/{CONTACT_ID}


## Installation
Just another Node.js app... :)
* npm install
* npm start

## Contributors
* [Takashi Shimabucuro](mailto:takaman@gmail.com)

