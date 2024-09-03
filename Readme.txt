So this is my first backend coding project.
following are the steps i completed to make this project.

libraries used: [express, mongoose, express-validator, bcrypt, jsonwebtoken]

1. First of all i installed express library
2. then i connected my express app to MongoDB using mongoose library
3. then i created my models schemas (basically data structures to store data in db) for users and notes.
4. then i made basic routes for user creation , authentication and notes.
5. In user creation route I used express-validator library to validate the entered data values. i.e: name must be atleast 3 charcaters, password must be atleast 8 characters.
6. then i also added validation to email that if any user with that email exists already then show error otherwise create user with given email name and password
7. mongoose helped me to connect with MongoDB and create schemas and send json data to DB collections
8. after that i used a bcrypt library which helped me to add salt to my passwords and encrypt those passwords into hash code so that my users passwords are not saved as plain text but in an encrypted form and additional salt.
(Salt means additional gibberish added to the password to increase security and make decryption near impossible)
(bcrypt library adds salt (additional gibberish) to the passwords and runs a one-way function to encrypt the salt added passwords, so that they can't be decrypted even if a hacker gets access to the DB passwords(hashed format), because he can't decrypt it because the bcrypt runs one-way encryption function which can't be reversed.)
9. then i used another library called jsonwebtoken which creates a token for each user when they login to check their credentials each time they access some protected route. i.e: if someone refreshes the notes page that token key verifies if that user is logged in with correct credentials and thus provides him data of his own and not someone elses.
(this token key is in encrypted form and has a secret-signature which cannot to altered to access someone else's data)
10. then i created another route for user authentication (login session) to check if provided email and password matches the data base or not?