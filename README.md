# E-Gate for IITGN

## Description
E-Gate for IITGN is a project aimed at streamlining the gate entry system of IIT Gandhinagar by replacing manual processes with a digital solution. This project was initially conceived during Hackrush 24', IITGN's yearly hackathon held on 12th and 13th March 2024, addressing the following problem statement:

> "Our institute's current gate entry system relies heavily on manual verification processes, creating inefficiencies and security vulnerabilities. Every resident of IITGN must present their ID card upon entry, while outsiders visiting the college are required to exit their vehicles and register their entry manually. This system not only causes delays but also lacks adequate security measures, as it is prone to human error and unauthorized access. Similar to the Mess QR code system, we could implement something to resolve this problem."

My friend Nilay Verma and I, Mohit Panchal, participated in the hackathon and secured the 3rd position. The lack of prizes for 3rd place motivated us to revamp the entire project during the summer vacations, leading to the current iteration.

## Solution Proposed / Working of the System

### Resident's View
All admin-managed users can log in to their account and generate a permanent QR code that holds a reference to their information in the database. The information stored includes identification code, name, IITGN email, phone number, address, etc.

The current system requires residents to fill out a Google form either while entering or exiting the campus, which asks for redundant information like name, IITGN email, phone number, address, etc. This causes inconvenience to the resident and takes up to 2-3 minutes to fill out the form, often resulting in the resident skipping the form. Residents who travel in the campus bus almost all the time skip the form as it is too redundant.

Since our system has a QR code that, upon scanning, logs the resident, it leverages the time to seconds, making it easier for the resident.

### Visitor's View
Visitors can register once, and their account stays forever. When they want to visit the campus, they have to fill out a short form with fields such as reason, concerned with, tenure, and vehicle number. Once the visitor fills out this short form, they are given a QR code that can be scanned and possibly gain entry to the campus.

When the visitor is exiting the campus, they simply have to scan the same QR code again, which will complete their entry and make the QR code invalid, meaning if they want to enter again, they'll have to fill out the form again and get a new QR code. If it happens that the visitor has not exited the campus when the tenure has expired, their log is highlighted in red on the security's side.

The current system does all this manually, which takes around 5-7 minutes just to get a visitor inside the campus. During high traffic, this can cause delivery delays and potential waste of time. Also, if a visitor stays inside beyond the restricted time, there is no way to know by the current system, which can be a severe vulnerability. Our system focuses on efficiency and security.

### Security's View
Firstly, the security has to log in using their identification code and the gate they are serving. This will make it so that when you see the final database, you can see which visitor and resident were admitted by which security personnel, so if something shady is caused by the visitor or the resident, the security personnel who admitted them can be held accountable.

Security personnel have access to the scanner, which allows scanning the QR codes and verifying the user based on the information they filled in. The security personnel either allow or disallow the user to enter the campus. The system also logs if the user is not permitted by the security personnel to know who all tried to enter the campus.

The security personnel can also see the previous logs of all users who entered the campus shown on a table, which also shows the visitors who are still in campus even though their tenure has expired. This system not only reduces the physical hardwork that the security has to do while manually writing the logs but also promotes security.

## File Structure
E-gate_Redone/\
├── controllers/\
├── models/\
├── public/\
├── routes/\
├── seeds/\
├── utils/\
├── views/\
├── index.js\
├── package.json\
├── package-lock.json\
└── README.md\

## Technologies Used
### Major Technologies
- Express
- Node.js
- MongoDB
- Bootstrap

### Npm Libraries
- bcrypt
- axios
- connect-flash
- connect-mongo
- cookie-parser
- dotenv
- ejs
- ejs-mate
- express-mongo-sanitize
- express-session
- helmet
- joi
- method-override
- moment
- passport
- passport-local
- passport-local-mongoose
- path
- qrcode
- sanitize-html

## API Endpoints
### Residents (prefixed with /residents)
- `GET /login` - Render login form.
- `POST /login` - Validate and login resident.
- `GET /:id/profile` - Show resident's profile.
- `POST /:id/profile` - Generate QR Code for resident.
- `GET /logout` - Logout resident.

### Visitors (prefixed with /visitors)
- `GET /signup` - Render signup form.
- `POST /signup` - Validate and sign up visitor.
- `GET /login` - Render login form.
- `POST /login` - Validate and login visitor.
- `GET /:id/profile` - Show visitor's profile.
- `POST /:id/profile` - Generate QR Code for visitor.
- `GET /logout` - Logout visitor.

### Security (prefixed with /security)
- `GET /login` - Render login form.
- `POST /login` - Validate and login security personnel.
- `GET /scanner` - Show QR Code scanner.
- `GET /` - Show security home page.
- `GET /logout` - Logout security personnel.
- `GET /verify/:id` - Show user verification page.
- `POST /verify/visitor` - Verify visitor.
- `POST /verify/resident` - Verify resident.
- `GET /database` - Show database home page.
- `GET /database/resident` - Show resident database.
- `GET /database/visitor` - Show visitor database.

## Security Measures
- **XSS Prevention:** Using `sanitize-html` and `helmet`.
- **NoSQL Injection Prevention:** Using `express-mongo-sanitize`.
- **Private Database Access:** Restricted to whitelisted IP addresses.
- **Verified Form:** All the major forms on the website are client side and server side validated using libraries such as bootstrap and Joi.
- **Password Hashing:** Using `bcrypt` to hash passwords.
- **Validations:** Validations are done on the server side using `Joi` and `MongoDB` such as matching emails, vehicle numbers, etc. 
- **Robust Error Handing:** No stack trace are shown on the website, and all errors are handled gracefully.

## Authentication
- **Local Express Authentication:** Implemented using username and password for visitors, and identification code and password for residents and security personnel.
- **Admin-Managed Users:** Residents and security personnel are added by the admin for security purposes.

## Authorization
- **Restricted Access:** Only logged-in users can access their profiles and QR codes. Unauthorized access results in an "Unauthorized Access" page, implemented using `express-session`.

## Future Aspects
- **Authentication Improvement:** Implementing Google OAuth2.0 with Passport.
- **Separate Database for Staff:** Including janitors, construction workers, hostel-keepers, etc., for attendance tracking.
- **Visitor Verification**: Implement a "My-Gate" application kind of system in which the resident whose details are filled in the "concerned with" field is prompted to either allow or disallow the visitor for further security.
- **Rate Limiting:** Consider implementing rate limiting to prevent brute force attacks on your login endpoints.
- **Dockerization:** Consider dockerizing your application. This can make it easier to manage dependencies and deploy your application in different environments.

## Screenshots

## Deployment
The current version of the website is deployed [here](https://e-gate-wuju.onrender.com).

## Local Setup Instructions
1. Ensure MongoDB and Node.js are installed.
2. Clone the repository:
   ```bash
   git clone https://github.com/rayvego/E-Gate_Redone.git
   cd projectname
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a .env file in the root directory and add the following credentials:
   ```bash
   MONGODB_URI=...
   SESSION_SECRET=...
   ```
5. Comment out the 45th line in index.js to run the app on localhost.
6. Start the server:
   ```bash
   node index.js
   ```
7. Open the browser and navigate to `http://localhost:3000`.
