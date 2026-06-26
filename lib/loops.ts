const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_BASE = 'https://app.loops.so/api/v1';

async function loopsPost(path: string, body: Record<string, unknown>) {
  if (!LOOPS_API_KEY) return;
  try {
    await fetch(`${LOOPS_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOOPS_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error('Loops error:', e);
  }
}

export async function sendRegistrationConfirmation(email: string, firstName: string) {
  await loopsPost('/events/send', { email, eventName: 'buyer_registered', firstName });
}

export async function sendMatchAlert(params: {
  email: string;
  firstName: string;
  role: 'buyer' | 'seller';
  location: string;
  dashboardUrl: string;
}) {
  await loopsPost('/events/send', {
    email: params.email,
    eventName: params.role === 'buyer' ? 'buyer_match_found' : 'seller_match_found',
    firstName: params.firstName,
    location: params.location,
    dashboardUrl: params.dashboardUrl,
  });
}

export async function sendSellerRegistrationConfirmation(email: string, firstName: string, address: string) {
  await loopsPost('/events/send', { email, eventName: 'seller_registered', firstName, address });
}

export async function sendApproachConfirmation(email: string, firstName: string, address: string) {
  await loopsPost('/events/send', { email, eventName: 'approach_confirmed', firstName, address });
}

export async function sendOwnerResponseAlert(email: string, firstName: string, address: string, response: string) {
  await loopsPost('/events/send', { email, eventName: 'owner_responded', firstName, address, ownerResponse: response });
}

export async function sendBroadcastConfirmation(email: string, firstName: string, address: string, buyerCount: number) {
  await loopsPost('/events/send', { email, eventName: 'broadcast_sent', firstName, address, buyerCount });
}

export async function createOrUpdateContact(email: string, firstName: string, lastName?: string) {
  await loopsPost('/contacts/create', {
    email,
    firstName,
    lastName: lastName ?? '',
    source: 'earlyeggs',
  });
}
