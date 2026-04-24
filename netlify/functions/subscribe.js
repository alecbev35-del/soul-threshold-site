/* ═══════════════════════════════════════════════════════════════════════
   SOUL THRESHOLD — Subscribe via MailerLite
   ───────────────────────────────────────────────────────────────────────
   POST { email }

   Adds an email to the MailerLite "Sanctuary Notes" group. Public endpoint
   — called from the homepage signup form.
   ═══════════════════════════════════════════════════════════════════════ */

const GROUP_ID = '185643742004250244'; // Sanctuary Notes
const ML_BASE  = 'https://connect.mailerlite.com/api';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return json(500, { error: 'Signup is temporarily unavailable. Please try again later.' });
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Invalid request.' }); }

  const email = String(payload.email || '').trim().toLowerCase();

  // Simple validation — enough to catch obvious junk; MailerLite does the rest.
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Please enter a valid email address.' });
  }

  // Honeypot — if a bot filled the hidden field, pretend success but do nothing.
  if (payload.website) {
    return json(200, { success: true });
  }

  try {
    const res = await fetch(`${ML_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        status: 'active',
        groups: [GROUP_ID]
      })
    });

    if (!res.ok) {
      const details = await res.text().catch(() => '');
      // MailerLite returns 422 for duplicates — treat that as success
      if (res.status === 422 && /already|exists|duplicate/i.test(details)) {
        return json(200, { success: true, note: 'already subscribed' });
      }
      return json(502, { error: 'Could not complete signup. Please try again.', details });
    }

    return json(200, { success: true });

  } catch (err) {
    return json(500, { error: 'Something went wrong. Please try again in a moment.' });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}
