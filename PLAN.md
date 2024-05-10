E-Gate Project

Tree Structure:
- models --> all database schema files
- seeds --> initial data filling files
- utils --> mainly error handling
- views --> all dynamic html pages
    - individual folders for each section
    - layouts --> basic page for all websites
    - partials --> things like navbar, footer etc. meant to be on all pages (added to boilerplate)
      index.js
      schemas.js --> server-side validation using Joi



Databases:
Visitors - Will store all entries of visitors
Attributes:
Name
Phone number
Password
Vehicle number
Entry time
Exit time
Tenure
qr_code
Scan count
Gate number (entered while entering QR code scanner portal by security)
*1. Security identification code (entered while entering QR code scanner portal by security)
Reason/Concerned With
Approved / Rejected (security)


Residents - Will store all entries of residents
Attributes:
Name
Password
Email
Identification code
Phone number
qr_code
Entry time
Exit time
Gate number (entered while entering QR code scanner portal by security)
Security identification code (entered while entering QR code scanner portal by security)


Security - Personal Details
Name
Phone number
*1. Identification code
Password


Resident Details:
Name
Phone number
Email ID
Address
Identification Code



Main functionality:


Routes:



Side Quests:
- Statistics


Future Aspects:
Update Resident Details every year
Confirmation with resident entered in concerned with field for visitor