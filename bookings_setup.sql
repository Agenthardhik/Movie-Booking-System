-- Run this ONCE in pgAdmin: right-click the "movie_booking" database -> Query Tool -> paste -> press F5.
-- It is safe to run more than once.

-- 1) One row per booking (this is the table that lists all bookings)
CREATE TABLE IF NOT EXISTS public.ticket_bookings (
  booking_id     VARCHAR(20)   PRIMARY KEY,           -- e.g. BNB482913
  customer_name  TEXT          NOT NULL,
  movie_title    TEXT          NOT NULL,
  theatre        TEXT          NOT NULL,
  show_date      DATE          NOT NULL,
  show_time      TEXT          NOT NULL,
  seats          TEXT          NOT NULL,              -- e.g. "A1, A2"
  seat_count     INT           NOT NULL CHECK (seat_count > 0),
  total_amount   NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT,
  status         VARCHAR(12)   NOT NULL DEFAULT 'confirmed',
  booked_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- 2) The seats table you already have: make sure it exists ...
CREATE TABLE IF NOT EXISTS public.booked_seats (
  id          SERIAL PRIMARY KEY,
  movie_title TEXT       NOT NULL,
  theatre     TEXT       NOT NULL,
  show_date   DATE       NOT NULL,
  show_time   TEXT       NOT NULL,
  seat_id     VARCHAR(4) NOT NULL
);

-- ... and link each seat to its booking
ALTER TABLE public.booked_seats
  ADD COLUMN IF NOT EXISTS booking_id VARCHAR(20)
  REFERENCES public.ticket_bookings(booking_id) ON DELETE CASCADE;

-- 3) The same seat can never be booked twice for the same show
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_seat_per_show') THEN
    ALTER TABLE public.booked_seats
      ADD CONSTRAINT unique_seat_per_show
      UNIQUE (movie_title, theatre, show_date, show_time, seat_id);
  END IF;
END $$;
