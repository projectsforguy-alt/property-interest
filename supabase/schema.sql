-- Intentory — Supabase schema
-- Drop and recreate all tables for a clean Intentory setup.
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with additional fields.
-- Created automatically on signup via trigger.
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  -- buyer profile fields
  buying_position text check (buying_position in (
    'cash_buyer', 'mortgage_agreed', 'property_to_sell', 'first_time_buyer', 'investor_developer', 'other'
  )),
  budget_min integer,
  budget_max integer,
  preferred_property_types text[], -- e.g. ['detached', 'semi_detached', 'flat']
  timeline text check (timeline in ('asap', '3_months', '6_months', '12_months', 'flexible')),
  buyer_notes text,
  -- alert preferences
  alerts_enabled boolean not null default true,
  alert_email boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_id on profiles(id);

-- ============================================================
-- BUYER INTERESTS
-- A buyer can register multiple interests across different locations.
-- ============================================================
create table if not exists buyer_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  interest_type text not null check (interest_type in (
    'specific_property', 'street', 'area', 'land'
  )),

  -- location fields (populated depending on interest_type)
  full_address text,          -- specific_property: full address string
  street_name text,           -- street: street name
  area_name text,             -- area: village, town, district
  postcode text,              -- all types: postcode or postcode district (e.g. SK10, SK10 3AQ)
  map_lat numeric,            -- area/land: map pin lat
  map_lng numeric,            -- area/land: map pin lng
  location_notes text,        -- any additional location context

  -- property preferences for this interest
  property_types text[],      -- ['detached','semi_detached','terraced','flat','bungalow','land']
  min_bedrooms integer,
  max_price integer,          -- pence
  buyer_message text,         -- optional personal message to potential seller

  -- status
  status text not null default 'active' check (status in ('active', 'paused', 'fulfilled', 'removed')),

  -- paid action tracking
  approach_requested boolean not null default false,  -- buyer has paid for owner approach
  approach_paid_at timestamptz,
  approach_status text check (approach_status in (
    'pending', 'letter_sent', 'responded', 'no_response', 'opted_out'
  )),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_buyer_interests_user on buyer_interests(user_id);
create index if not exists idx_buyer_interests_postcode on buyer_interests(postcode);
create index if not exists idx_buyer_interests_status on buyer_interests(status);

-- ============================================================
-- SELLER PROPERTIES
-- A seller can register one or more properties as privately available.
-- ============================================================
create table if not exists seller_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  full_address text not null,
  postcode text not null,
  street_name text,
  area_name text,
  map_lat numeric,
  map_lng numeric,

  property_type text check (property_type in (
    'detached', 'semi_detached', 'terraced', 'flat', 'bungalow', 'land', 'other'
  )),
  bedrooms integer,
  asking_price integer,       -- pence, optional — seller may not want to reveal
  seller_notes text,          -- private notes for buyers once matched

  -- visibility
  status text not null default 'available' check (status in (
    'available', 'under_offer', 'sold', 'withdrawn', 'paused'
  )),

  -- broadcast tracking
  broadcast_paid_at timestamptz,
  broadcast_sent_at timestamptz,
  broadcast_buyer_count integer default 0,

  -- admin
  admin_notes text,
  verified boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_seller_properties_user on seller_properties(user_id);
create index if not exists idx_seller_properties_postcode on seller_properties(postcode);
create index if not exists idx_seller_properties_status on seller_properties(status);

-- ============================================================
-- MATCHES
-- Created when a seller property overlaps with a buyer interest.
-- ============================================================
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  buyer_interest_id uuid not null references buyer_interests(id) on delete cascade,
  seller_property_id uuid not null references seller_properties(id) on delete cascade,
  buyer_user_id uuid not null references auth.users(id),
  seller_user_id uuid not null references auth.users(id),

  match_type text not null check (match_type in (
    'exact_address', 'street', 'postcode', 'area'
  )),

  status text not null default 'pending' check (status in (
    'pending',        -- match exists, no action yet
    'notified',       -- both parties have been alerted
    'active',         -- conversation opened
    'completed',      -- sale agreed / progressed outside platform
    'declined',       -- one party declined
    'expired'
  )),

  buyer_notified_at timestamptz,
  seller_notified_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(buyer_interest_id, seller_property_id)
);

create index if not exists idx_matches_buyer on matches(buyer_user_id);
create index if not exists idx_matches_seller on matches(seller_user_id);
create index if not exists idx_matches_status on matches(status);

-- ============================================================
-- MESSAGES
-- Simple threaded messaging between a matched buyer and seller.
-- Each thread is tied to a match.
-- ============================================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  sender_id uuid not null references auth.users(id),

  body text not null,
  read_at timestamptz,

  created_at timestamptz not null default now()
);

create index if not exists idx_messages_match on messages(match_id);
create index if not exists idx_messages_sender on messages(sender_id);

-- ============================================================
-- OWNER APPROACHES
-- Tracks paid owner approach requests (buyer pays to contact a specific owner).
-- ============================================================
create table if not exists owner_approaches (
  id uuid primary key default gen_random_uuid(),
  buyer_interest_id uuid not null references buyer_interests(id) on delete cascade,
  buyer_user_id uuid not null references auth.users(id),

  -- payment
  stripe_session_id text,
  stripe_payment_id text,
  payment_status text not null default 'pending' check (payment_status in (
    'pending', 'paid', 'refunded'
  )),
  price_pence integer not null,

  -- letter
  owner_name text,
  owner_address text,
  owner_postcode text,
  response_code text unique,
  verification_code text,
  letter_sent_date date,

  -- response
  owner_response text check (owner_response in (
    'interested', 'higher_price', 'maybe_future',
    'not_interested', 'do_not_contact', 'wrong_property'
  )),
  owner_response_at timestamptz,
  owner_message text,

  -- status
  status text not null default 'pending_payment' check (status in (
    'pending_payment', 'paid', 'owner_identified', 'letter_sent',
    'awaiting_response', 'responded', 'no_response', 'opted_out', 'failed', 'refunded'
  )),
  admin_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_approaches_buyer on owner_approaches(buyer_user_id);
create index if not exists idx_approaches_response_code on owner_approaches(response_code);

-- ============================================================
-- updated_at trigger (shared)
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
  before update on profiles for each row execute function set_updated_at();

drop trigger if exists trg_buyer_interests_updated_at on buyer_interests;
create trigger trg_buyer_interests_updated_at
  before update on buyer_interests for each row execute function set_updated_at();

drop trigger if exists trg_seller_properties_updated_at on seller_properties;
create trigger trg_seller_properties_updated_at
  before update on seller_properties for each row execute function set_updated_at();

drop trigger if exists trg_matches_updated_at on matches;
create trigger trg_matches_updated_at
  before update on matches for each row execute function set_updated_at();

drop trigger if exists trg_approaches_updated_at on owner_approaches;
create trigger trg_approaches_updated_at
  before update on owner_approaches for each row execute function set_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_new_user_profile on auth.users;
create trigger trg_new_user_profile
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles enable row level security;
alter table buyer_interests enable row level security;
alter table seller_properties enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table owner_approaches enable row level security;

-- Profiles: users can read/write their own profile
create policy "profiles_own" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Buyer interests: users manage their own
create policy "buyer_interests_own" on buyer_interests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seller properties: users manage their own
create policy "seller_properties_own" on seller_properties
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Matches: both buyer and seller can read their own matches
create policy "matches_participant" on matches
  for select using (auth.uid() = buyer_user_id or auth.uid() = seller_user_id);

-- Messages: participants in the match can read/write
create policy "messages_participant" on messages
  for all using (
    auth.uid() = sender_id or
    exists (
      select 1 from matches m
      where m.id = messages.match_id
      and (m.buyer_user_id = auth.uid() or m.seller_user_id = auth.uid())
    )
  );

-- Owner approaches: buyers can read their own
create policy "approaches_own" on owner_approaches
  for select using (auth.uid() = buyer_user_id);
