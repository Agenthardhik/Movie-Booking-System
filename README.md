# BookNbite – Movie Booking System

A movie ticket booking website. Users pick a movie, seats and snacks, pay, and the booking is saved in a PostgreSQL database.

**Tech used:** HTML, CSS, JavaScript, Node.js (Express), PostgreSQL

## How to run

1. **Create the tables**
   Open pgAdmin → right-click the `movie_booking` database → Query Tool → paste the contents of `bookings_setup.sql` → press F5.

2. **Add your database password**
   Create a file `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=movie_booking
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

3. **Start the backend** (in the folder that has `server.js`)
   ```
   npm install
   node server.js
   ```

4. **Open the website**
   Right-click `index.html` in VS Code → Open with Live Server.

## See the bookings

In pgAdmin: `movie_booking` → Schemas → public → Tables → `ticket_bookings` → right-click → View/Edit Data → All Rows.

Or run this in the Query Tool:
```sql
SELECT * FROM ticket_bookings;
```

## Database tables

- `ticket_bookings`: one row for each booking (booking ID, name, movie, theatre, date, time, seats, amount, status)
- `booked_seats`: one row for each booked seat. The same seat cannot be booked twice for the same show.
