DROP TABLE IF EXISTS agency CASCADE;
CREATE TABLE agency
(
  agency_id              text UNIQUE NULL,
  agency_name            text NOT NULL,
  agency_url             text NOT NULL,
  agency_timezone        text NOT NULL,
  agency_lang            text NULL,
  agency_phone           text NULL
);

DROP TABLE IF EXISTS stops CASCADE;
CREATE TABLE stops
(
  stop_id                text PRIMARY KEY,
  stop_name              text NULL CHECK (location_type >= 0 AND location_type <= 2 AND stop_name IS NOT NULL OR location_type > 2),
  stop_lat               double precision NULL CHECK (location_type >= 0 AND location_type <= 2 AND stop_name IS NOT NULL OR location_type > 2),
  stop_lon               double precision NULL CHECK (location_type >= 0 AND location_type <= 2 AND stop_name IS NOT NULL OR location_type > 2),
  stop_code              text NULL,
  location_type          integer NULL CHECK (location_type >= 0 AND location_type <= 4),
  location_sub_type      text NULL,
  parent_station         text NULL CHECK (location_type IS NULL OR location_type = 0 OR location_type = 1 AND parent_station IS NULL OR location_type >= 2 AND location_type <= 4 AND parent_station IS NOT NULL),
  wheelchair_boarding    integer NULL CHECK (wheelchair_boarding >= 0 AND wheelchair_boarding <= 2 OR wheelchair_boarding IS NULL)
);

DROP TABLE IF EXISTS routes CASCADE;
CREATE TABLE routes
(
  agency_id              text NULL REFERENCES agency(agency_id) ON DELETE CASCADE ON UPDATE CASCADE,
  route_id               text PRIMARY KEY,
  route_short_name       text NULL,
  route_long_name        text NULL CHECK (route_short_name IS NOT NULL OR route_long_name IS NOT NULL),
  route_type             integer NOT NULL,
  route_desc             text NULL,
  route_color            text NULL CHECK (route_color ~ $$[a-fA-F0-9]{6}$$ OR route_color = ''),
  route_text_color       text NULL CHECK (route_color ~ $$[a-fA-F0-9]{6}$$ OR route_color = ''),
  route_sort_order       integer NULL CHECK (route_sort_order >= 0)
);

DROP TABLE IF EXISTS trips CASCADE;
CREATE TABLE trips
(
  route_id               text NOT NULL REFERENCES routes ON DELETE CASCADE ON UPDATE CASCADE,
  trip_id                text NOT NULL PRIMARY KEY,
  service_id             text NOT NULL,
  trip_headsign          text NULL,
  direction_id           boolean NULL,
  block_id               text NULL,
  shape_id               text NULL,
  wheelchair_accessible  integer NULL CHECK (wheelchair_accessible >= 0 AND wheelchair_accessible <= 2),
  bikes_allowed          integer NULL CHECK (bikes_allowed >= 0 AND bikes_allowed <= 2)
);

DROP TABLE IF EXISTS stop_times CASCADE;
CREATE TABLE stop_times
(
  trip_id                text NOT NULL REFERENCES trips ON DELETE CASCADE ON UPDATE CASCADE,
  stop_id                text NOT NULL REFERENCES stops ON DELETE CASCADE ON UPDATE CASCADE,
  arrival_time           interval NULL,
  departure_time         interval NOT NULL,
  stop_sequence          integer NOT NULL CHECK (stop_sequence >= 0),
  stop_headsign          text NULL,
  pickup_type            integer NOT NULL CHECK (pickup_type >= 0 AND pickup_type <= 3),
  drop_off_type          integer NOT NULL CHECK (drop_off_type >= 0 AND drop_off_type <= 3),
  shape_dist_traveled    double precision NULL CHECK (shape_dist_traveled >= 0.0)
);

DROP TABLE IF EXISTS calendar_dates CASCADE;
CREATE TABLE calendar_dates
(
  service_id             text NOT NULL,
  date                   numeric(8) NOT NULL,
  exception_type         integer NOT NULL CHECK (exception_type >= 1 AND exception_type <= 2)
);

DROP TABLE IF EXISTS shapes CASCADE;
CREATE TABLE shapes
(
  shape_id               text NOT NULL,
  shape_pt_sequence      integer NOT NULL CHECK (shape_pt_sequence >= 0),
  shape_pt_lat           double precision NOT NULL,
  shape_pt_lon           double precision NOT NULL,
  shape_dist_traveled    double precision NULL CHECK (shape_dist_traveled >= 0.0)
);

DROP TABLE IF EXISTS pathways CASCADE;
CREATE TABLE pathways
(
  pathway_id             text PRIMARY KEY,
  pathway_mode           integer NOT NULL CHECK (pathway_mode >= 1 AND pathway_mode <= 7),
  is_bidirectional       boolean NOT NULL,
  from_stop_id           text NOT NULL REFERENCES stops(stop_id) ON DELETE CASCADE ON UPDATE CASCADE,
  to_stop_id             text NOT NULL REFERENCES stops(stop_id) ON DELETE CASCADE ON UPDATE CASCADE,
  traversal_time         integer NULL CHECK (traversal_time >= 0)
);

DROP TABLE IF EXISTS feed_info CASCADE;
CREATE TABLE feed_info
(
  feed_id                text NULL,
  feed_publisher_name    text NOT NULL,
  feed_publisher_url     text NOT NULL,
  feed_lang              text NULL,
  feed_start_date        numeric(8) NULL,
  feed_end_date          numeric(8) NULL,
  feed_version           text NULL
);

\COPY agency FROM 'budapest_gtfs/agency.txt' (FORMAT CSV, HEADER)
\COPY stops FROM 'budapest_gtfs/stops.txt' (FORMAT CSV, HEADER)
\COPY routes FROM 'budapest_gtfs/routes.txt' (FORMAT CSV, HEADER)
\COPY trips FROM 'budapest_gtfs/trips.txt' (FORMAT CSV, HEADER)
\COPY stop_times FROM 'budapest_gtfs/stop_times.txt' (FORMAT CSV, HEADER)
\COPY calendar_dates FROM 'budapest_gtfs/calendar_dates.txt' (FORMAT CSV, HEADER)
\COPY shapes FROM 'budapest_gtfs/shapes.txt' (FORMAT CSV, HEADER)
\COPY pathways FROM 'budapest_gtfs/pathways.txt' (FORMAT CSV, HEADER)
\COPY feed_info FROM 'budapest_gtfs/feed_info.txt' (FORMAT CSV, HEADER)
