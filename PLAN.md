### E-Gate Project

#### Tree Structure:
- **models**:
    - All database schema files.
- **seeds**:
    - Initial data filling files.
- **utils**:
    - Mainly for error handling.
- **routes**:
    - 
- **views**:
    - All dynamic HTML pages.
        - Individual folders for each section.
        - **layouts**:
            - Basic page for all websites.
        - **partials**:
            - Elements like navbar, footer, etc. meant to be on all pages (added to boilerplate).
- `index.js`
- `schemas.js`: Server-side validation using Joi.

#### Databases:
**Visitors**:
- Stores all entries of visitors.
- **Attributes**:
    - Name
    - Phone number
    - Password
    - Vehicle number
    - Entry time
    - Exit time
    - Tenure
    - QR code
    - Scan count
    - Gate number (entered while entering QR code scanner portal by security)
    - Security identification code (entered while entering QR code scanner portal by security)
    - Reason/Concerned With
    - Approved / Rejected (security)

**Residents**:
- Stores all entries of residents.
- **Attributes**:
    - Name
    - Password
    - Email
    - Identification code
    - Phone number
    - QR code
    - Entry time
    - Exit time
    - Gate number (entered while entering QR code scanner portal by security)
    - Security identification code (entered while entering QR code scanner portal by security)

**Security - Personal Details**:
- Stores personal details of security personnel.
- **Attributes**:
    - Name
    - Phone number
    - Identification code
    - Password

**Resident Details**:
- Stores details of residents.
- **Attributes**:
    - Name
    - Phone number
    - Email ID
    - Address
    - Identification Code

#### Main functionality:

#### Routes:

#### Side Quests:
- Statistics

#### Future Aspects:
- Update Resident Details every year.
- Confirmation with resident entered in concerned with field for visitor.