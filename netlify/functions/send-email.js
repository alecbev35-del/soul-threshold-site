/* ═══════════════════════════════════════════════════════════════════════
   SOUL THRESHOLD — Send Email via MailerLite
   ───────────────────────────────────────────────────────────────────────
   POST { subject, html, campaignName? }   (requires Netlify Identity login)

   Creates a MailerLite campaign targeting the "Sanctuary Notes" group
   and sends it immediately.
   ═══════════════════════════════════════════════════════════════════════ */

const GROUP_ID   = '185643742004250244';             // Sanctuary Notes
const FROM_EMAIL = 'debi.soulthreshold@gmail.com';
const FROM_NAME  = 'Debi — Soul Threshold';
const ML_BASE    = 'https://connect.mailerlite.com/api';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const { user } = context.clientContext || {};
  if (!user) {
    return json(401, { error: 'Not authorized — please log in.' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return json(500, { error: 'Email service not configured. Add MAILERLITE_API_KEY in Netlify settings.' });
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Invalid JSON body.' }); }

  const { subject, html, campaignName, testEmail } = payload;
  if (!subject || !html) {
    return json(400, { error: 'Subject and body are required.' });
  }

  const today = new Date().toISOString().split('T')[0];
  const name  = campaignName || `${subject} — ${today}`;

  try {
    // ─── 1. Create the campaign ─────────────────────────────────────
    const createRes = await fetch(`${ML_BASE}/campaigns`, {
      method: 'POST',
      headers: mlHeaders(apiKey),
      body: JSON.stringify({
        name,
        language_id: 9,          // English
        type: 'regular',
        emails: [{
          subject,
          from_name: FROM_NAME,
          from: FROM_EMAIL,
          content: html
        }],
        groups: [GROUP_ID]
      })
    });

    if (!createRes.ok) {
      const details = await safeText(createRes);
      return json(502, { error: 'Could not create campaign in MailerLite.', details });
    }

    const created = await createRes.json();
    const campaignId = created?.data?.id;
    if (!campaignId) {
      return json(502, { error: 'Campaign created but no ID returned.', details: created });
    }

    // ─── 2. If test send, deliver to test email only ────────────────
    if (testEmail) {
      const testRes = await fetch(`${ML_BASE}/campaigns/${campaignId}/actions/test`, {
        method: 'POST',
        headers: mlHeaders(apiKey),
        body: JSON.stringify({ emails: [testEmail] })
      });
      if (!testRes.ok) {
        const details = await safeText(testRes);
        return json(502, { error: 'Test send failed.', details, campaignId });
      }
      return json(200, { success: true, mode: 'test', campaignId, campaignName: name, testEmail });
    }

    // ─── 3. Schedule for instant delivery to all subscribers ────────
    const scheduleRes = await fetch(`${ML_BASE}/campaigns/${campaignId}/schedule`, {
      method: 'POST',
      headers: mlHeaders(apiKey),
      body: JSON.stringify({ delivery: 'instant' })
    });

    if (!scheduleRes.ok) {
      const details = await safeText(scheduleRes);
      return json(502, { error: 'Campaign created but send failed.', details, campaignId });
    }

    return json(200, { success: true, mode: 'send', campaignId, campaignName: name });

  } catch (err) {
    return json(500, { error: 'Unexpected error.', details: String(err && err.message || err) });
  }
};

function mlHeaders(apiKey) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

async function safeText(res) {
  try { return await res.text(); } catch { return '<no body>'; }
}
