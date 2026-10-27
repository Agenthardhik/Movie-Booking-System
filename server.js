require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Test database connection
app.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database"
        );

        res.send(
            `BookNbite backend is running! Connected to: ${result.rows[0].database}`
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Database connection failed." });
    }
});

// Get movies from PostgreSQL
app.get("/movies", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM public.movies"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("MOVIES DATABASE ERROR:", error.message);
        res.status(500).json({ error: "Could not load movies." });
    }
});

// Get seats already booked for a particular show
app.get("/booked-seats", async (req, res) => {
    const { movie, theatre, date, time } = req.query;

    if (!movie || !theatre || !date || !time) {
        return res.status(400).json({
            error: "Movie, theatre, date and time are required."
        });
    }

    try {
        const result = await pool.query(
            `SELECT seat_id
             FROM public.booked_seats
             WHERE movie_title = $1
               AND theatre = $2
               AND show_date = $3
               AND show_time = $4`,
            [movie, theatre, date, time]
        );

        res.json({
            bookedSeats: result.rows.map(row => row.seat_id)
        });
    } catch (error) {
        console.error("SEAT LOOKUP ERROR:", error.message);
        res.status(500).json({
            error: "Could not check seat availability."
        });
    }
});

// Save a confirmed booking (one row in ticket_bookings + one row per seat in booked_seats)
app.post("/bookings", async (req, res) => {
    const {
        booking_id,
        customer_name,
        movie_title,
        theatre,
        show_date,
        show_time,
        seats,
        total_amount,
        payment_method
    } = req.body;

    if (
        !/^BNB\d{6}$/.test(booking_id || "") ||
        typeof customer_name !== "string" || !customer_name.trim() ||
        !movie_title ||
        !theatre ||
        !show_date ||
        !show_time ||
        !Array.isArray(seats) ||
        seats.length === 0 ||
        !seats.every(seat =>
            typeof seat === "string" &&
            /^[A-F](10|[1-9])$/.test(seat)
        ) ||
        new Set(seats).size !== seats.length ||
        !Number.isFinite(Number(total_amount)) ||
        Number(total_amount) < 0
    ) {
        return res.status(400).json({
            error: "Valid booking details, seat IDs and amount are required."
        });
    }

    // Only accept dates in YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(show_date)) {
        return res.status(400).json({
            error: "Date must use YYYY-MM-DD format."
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1) the booking itself
        await client.query(
            `INSERT INTO public.ticket_bookings
             (booking_id, customer_name, movie_title, theatre, show_date,
              show_time, seats, seat_count, total_amount, payment_method)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                booking_id,
                customer_name.trim(),
                movie_title,
                theatre,
                show_date,
                show_time,
                seats.join(", "),
                seats.length,
                Number(total_amount),
                payment_method || null
            ]
        );

        // 2) each seat (the unique rule stops double booking)
        for (const seat of seats) {
            await client.query(
                `INSERT INTO public.booked_seats
                 (booking_id, movie_title, theatre, show_date, show_time, seat_id)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [booking_id, movie_title, theatre, show_date, show_time, seat]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            message: "Booking saved successfully.",
            bookingId: booking_id,
            bookedSeats: seats
        });
    } catch (error) {
        await client.query("ROLLBACK");

        if (error.code === "23505") {
            return res.status(409).json({
                error: "One or more seats were just booked by someone else. Please choose different seats."
            });
        }

        console.error("BOOKING ERROR:", error.message);
        res.status(500).json({
            error: "Could not save the booking."
        });
    } finally {
        client.release();
    }
});

// List all bookings (open http://localhost:3000/bookings in the browser to check)
app.get("/bookings", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT booking_id, customer_name, movie_title, theatre,
                    to_char(show_date, 'YYYY-MM-DD') AS show_date,
                    show_time, seats, seat_count, total_amount,
                    payment_method, status, booked_at
             FROM public.ticket_bookings
             ORDER BY booked_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("BOOKINGS LIST ERROR:", error.message);
        res.status(500).json({ error: "Could not load bookings." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});