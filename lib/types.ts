// ============================================================
// EarlyEggs — shared types
// ============================================================

export type InterestType = 'specific_property' | 'street' | 'area' | 'land';
export type BuyingPosition = 'cash_buyer' | 'mortgage_agreed' | 'property_to_sell' | 'first_time_buyer' | 'investor_developer' | 'other';
export type Timeline = 'asap' | '3_months' | '6_months' | '12_months' | 'flexible';
export type PropertyType = 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'bungalow' | 'land' | 'other';
export type InterestStatus = 'active' | 'paused' | 'fulfilled' | 'removed';
export type PropertyStatus = 'available' | 'under_offer' | 'sold' | 'withdrawn' | 'paused';
export type MatchStatus = 'pending' | 'notified' | 'active' | 'completed' | 'declined' | 'expired';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type VerificationStatus =
  | 'unverified'
  | 'letter_requested'
  | 'letter_sent'
  | 'awaiting_code'
  | 'verified';

// Four seller response options from the spec
export type OwnerResponse =
  | 'not_interested'     // option 1: 2-year contact block
  | 'not_considering'    // option 2: not currently thinking of selling
  | 'open_to_offer'      // option 3: buyer submits offer figure
  | 'ready_to_connect';  // option 4: referral agreement triggered

export type OutreachType =
  | 'owner_approach'     // £29 single letter
  | 'followup_letter'    // £29 follow-up after no response
  | 'street_outreach'    // £99
  | 'area_outreach';     // £199

export type ApproachStatus =
  | 'pending_payment'
  | 'paid'
  | 'owner_identified'
  | 'letter_sent'
  | 'awaiting_response'
  | 'responded'
  | 'no_response'
  | 'opted_out'
  | 'failed'
  | 'refunded';

export type CampaignStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_progress'
  | 'sent'
  | 'failed'
  | 'refunded';

export type ReferralStatus =
  | 'pending'
  | 'active'
  | 'solicitor_notified'
  | 'completed'
  | 'withdrawn';

// ============================================================
// Table interfaces
// ============================================================

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
  approach_status: ApproachStatus | null;
  last_active_at: string | null;
  expiry_prompted_at: string | null;
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
  // verification
  verified: boolean;
  verification_status: VerificationStatus;
  verification_code: string | null;
  verification_letter_requested_at: string | null;
  verification_letter_sent_at: string | null;
  verification_code_entered_at: string | null;
  approach_via_email: boolean;
  // broadcast
  broadcast_paid_at: string | null;
  broadcast_sent_at: string | null;
  broadcast_expires_at: string | null;
  broadcast_buyer_count: number;
  broadcast_status: 'none' | 'active' | 'expired';
  // admin
  admin_notes: string | null;
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
  exclusivity_expires_at: string | null;
  triggered_by_approach_id: string | null;
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

export interface OwnerApproach {
  id: string;
  buyer_interest_id: string;
  buyer_user_id: string;
  // payment
  stripe_session_id: string | null;
  stripe_payment_id: string | null;
  payment_status: PaymentStatus;
  price_pence: number;
  outreach_type: OutreachType;
  // letter
  owner_name: string | null;
  owner_address: string | null;
  owner_postcode: string | null;
  response_code: string | null;
  verification_code: string | null;
  letter_sent_date: string | null;
  // seller response
  owner_response: OwnerResponse | null;
  owner_response_at: string | null;
  owner_message: string | null;
  // option 3: offer sub-flow
  buyer_offer_pence: number | null;
  buyer_offer_submitted_at: string | null;
  seller_offer_response: 'accepted' | 'declined' | null;
  seller_offer_responded_at: string | null;
  // option 1: contact block
  contact_blocked_until: string | null;
  // follow-up
  followup_letter_paid_at: string | null;
  followup_letter_sent_at: string | null;
  // status
  status: ApproachStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OutreachCampaign {
  id: string;
  buyer_interest_id: string;
  buyer_user_id: string;
  campaign_type: 'street_outreach' | 'area_outreach';
  // payment
  stripe_session_id: string | null;
  stripe_payment_id: string | null;
  payment_status: PaymentStatus;
  price_pence: number;
  // targeting
  target_street: string | null;
  target_area: string | null;
  target_postcode: string | null;
  // delivery
  letters_sent_count: number;
  campaign_sent_at: string | null;
  // status
  status: CampaignStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralAgreement {
  id: string;
  match_id: string;
  owner_approach_id: string | null;
  buyer_user_id: string;
  seller_user_id: string;
  // signing
  signed_by_buyer_at: string | null;
  signed_by_seller_at: string | null;
  // solicitor letter
  solicitor_letter_generated_at: string | null;
  solicitor_letter_sent_at: string | null;
  solicitor_reference: string | null;
  // success fee
  success_fee_pence: number;
  success_fee_paid_at: string | null;
  success_fee_stripe_payment_id: string | null;
  // status
  status: ReferralStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
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

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  unverified: 'Unverified',
  letter_requested: 'Letter requested',
  letter_sent: 'Letter sent',
  awaiting_code: 'Awaiting code',
  verified: 'Verified',
};

export const OWNER_RESPONSE_LABELS: Record<OwnerResponse, string> = {
  not_interested: 'Not interested',
  not_considering: 'Not currently considering selling',
  open_to_offer: 'Open to hearing more',
  ready_to_connect: 'Ready to connect',
};

export const MATCH_TYPE_LABELS: Record<Match['match_type'], string> = {
  exact_address: 'Exact address match',
  street: 'Street match',
  postcode: 'Postcode match',
  area: 'Area match',
};

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  solicitor_notified: 'Solicitor notified',
  completed: 'Completed',
  withdrawn: 'Withdrawn',
};

// ============================================================
// Pricing
// ============================================================

export const PAID_ACTION_PRICES = {
  owner_approach: 2900,       // £29
  followup_letter: 2900,      // £29
  street_outreach: 9900,      // £99
  area_outreach: 19900,       // £199
  seller_broadcast: 4900,     // £49
  success_fee: 49900,         // £499
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

/**
 * Returns true if an owner_approach contact block is still active.
 */
export function isContactBlocked(blockedUntil: string | null): boolean {
  if (!blockedUntil) return false;
  return new Date(blockedUntil) > new Date();
}

/**
 * Returns true if a buyer interest has been inactive for more than 12 months.
 */
export function isInterestExpired(lastActiveAt: string | null): boolean {
  if (!lastActiveAt) return false;
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  return new Date(lastActiveAt) < twelveMonthsAgo;
}

/**
 * Returns true if a match's exclusivity window is still active.
 */
export function isExclusivityActive(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) > new Date();
}
