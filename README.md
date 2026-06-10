# MySQL Node CRUD App

A full-stack CRUD application built with Node.js, Express, MySQL and EJS templating.

## Features
- View total user count on home page
- View all users in a table
- Add a new user
- Edit username (password verification required)
- Delete a user (email & password verification required)

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL (mysql2)
- **Templating:** EJS
- **Other:** method-override, dotenv, faker.js

## Setup

1. Clone the repo
```bash
git clone https://github.com/your-username/mysql-node-crud.git
cd mysql-node-crud
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```
DB_PASSWORD=your_mysql_password
```

4. Setup database — run `schema.sql` in MySQL Workbench or CLI
```sql
source schema.sql
```

5. Run the app
```bash
node index.js
```

6. Open in browser
```
http://localhost:8080
```

## Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | / | Show total user count |
| GET | /user | Show all users |
| GET | /user/new | Add user form |
| POST | /user | Insert new user |
| GET | /user/:id/edit | Edit user form |
| PATCH | /user/:id | Update username |
| GET | /user/:id/delete | Delete confirmation form |
| DELETE | /user/:id | Delete user |