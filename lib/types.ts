// ============================================================
// Intentory — shared types
// ============================================================

export type InterestType = 'specific_property' | 'street' | 'area' | 'land';
export type BuyingPosition = 'cash_buyer' | 'mortgage_agreed' | 'property_to_sell' | 'first_time_buyer' | 'investor_developer' | 'other';
export type Timeline = 'asap' | '3_months' | '6_months' | '12_months' | 'flexible';
export type PropertyType = 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'bungalow' | 'land' | 'other';
export type InterestStatus = 'active' | 'paused' | 'fulfilled' | 'removed';
export type PropertyStatus = 'available' | 'under_offer' | 'sold' | 'withdrawn' | 'paused';
export type MatchStatus = 'pending' | 'notified' | 'active' | 'completed' | 'declined' | 'expired';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  buying_position: BuyingPosition | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_property_types: PropertyType[] | null;
  timeline: Timeline | null;
  buyer_notes: string | null;
  alerts_enabled: boolean;
  alert_email: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuyerInterest {
  id: string;
  user_id: string;
  interest_type: InterestType;
  full_address: string | null;
  street_name: string | null;
  area_name: string | null;
  postcode: string | null;
  map_lat: number | null;
  map_lng: number | null;
  location_notes: string | null;
  property_types: PropertyType[] | null;
  min_bedrooms: number | null;
  max_price: number | null;
  buyer_message: string | null;
  status: InterestStatus;
  approach_requested: boolean;
  approach_paid_at: string | null;
  approach_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerProperty {
  id: string;
  user_id: string;
  full_address: string;
  postcode: string;
  street_name: string | null;
  area_name: string | null;
  map_lat: number | null;
  map_lng: number | null;
  property_type: PropertyType | null;
  bedrooms: number | null;
  asking_price: number | null;
  seller_notes: string | null;
  status: PropertyStatus;
  broadcast_paid_at: string | null;
  broadcast_sent_at: string | null;
  broadcast_buyer_count: number;
  admin_notes: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  buyer_interest_id: string;
  seller_property_id: string;
  buyer_user_id: string;
  seller_user_id: string;
  match_type: 'exact_address' | 'street' | 'postcode' | 'area';
  status: MatchStatus;
  buyer_notified_at: string | null;
  seller_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

// ============================================================
// Labels
// ============================================================

export const INTEREST_TYPE_LABELS: Record<InterestType, string> = {
  specific_property: 'Specific property',
  street: 'Street',
  area: 'Area or village',
  land: 'Land or plot',
};

export const INTEREST_TYPE_DESCRIPTIONS: Record<InterestType, string> = {
  specific_property: 'I want a specific address',
  street: 'I want any property on a particular street',
  area: 'I want to buy in a village, area or postcode',
  land: 'I\'m looking for land or a development plot',
};

export const BUYING_POSITION_LABELS: Record<BuyingPosition, string> = {
  cash_buyer: 'Cash buyer',
  mortgage_agreed: 'Mortgage agreed in principle',
  property_to_sell: 'Have a property to sell',
  first_time_buyer: 'First-time buyer',
  investor_developer: 'Investor / developer',
  other: 'Other',
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  asap: 'As soon as possible',
  '3_months': 'Within 3 months',
  '6_months': 'Within 6 months',
  '12_months': 'Within 12 months',
  flexible: 'Flexible / no rush',
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  detached: 'Detached',
  semi_detached: 'Semi-detached',
  terraced: 'Terraced',
  flat: 'Flat / apartment',
  bungalow: 'Bungalow',
  land: 'Land / plot',
  other: 'Other',
};

export const INTEREST_STATUS_LABELS: Record<InterestStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  fulfilled: 'Fulfilled',
  removed: 'Removed',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  available: 'Available',
  under_offer: 'Under offer',
  sold: 'Sold',
  withdrawn: 'Withdrawn',
  paused: 'Paused',
};

export const MATCH_TYPE_LABELS: Record<Match['match_type'], string> = {
  exact_address: 'Exact address match',
  street: 'Street match',
  postcode: 'Postcode match',
  area: 'Area match',
};

// ============================================================
// Pricing
// ============================================================

export const PAID_ACTION_PRICES = {
  owner_approach: 2900,       // £29 in pence
  street_outreach: 9900,      // £99
  area_outreach: 19900,       // £199
  seller_broadcast: 4900,     // £49
} as const;

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}

export function formatBudget(pence: number | null): string {
  if (!pence) return 'Not specified';
  const pounds = pence / 100;
  if (pounds >= 1_000_000) return `£${(pounds / 1_000_000).toFixed(1)}m`;
  if (pounds >= 1_000) return `£${Math.round(pounds / 1_000)}k`;
  return `£${pounds.toLocaleString()}`;
}

// ============================================================
// Matching helpers
// ============================================================

/**
 * Normalise a postcode for comparison — strips spaces, uppercases.
 */
export function normalisePostcode(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase();
}

/**
 * Extract the postcode district from a full postcode (e.g. "SK10 3AQ" → "SK10").
 */
export function postcodeDistrict(postcode: string): string {
  return normalisePostcode(postcode).replace(/\d[A-Z]{2}$/, '').trim();
}
