import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'
const SWAKK_WHATSAPP = Deno.env.get('SWAKK_WHATSAPP') || 'whatsapp:+971568788736'

async function sendWhatsApp(to: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: TWILIO_WHATSAPP_FROM,
      To: to,
      Body: body,
    })
  })
  return res.json()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { type, booking } = await req.json()

    if (type === 'new_booking') {
      // Notify Swakk
      await sendWhatsApp(SWAKK_WHATSAPP,
        `✂️ *New Booking*\n\n👤 ${booking.clientName}\n💈 ${booking.service}\n📅 ${booking.date} at ${booking.time}\n📍 ${booking.location || 'No location set'}\n💰 AED ${booking.price}\n\nRef: ${booking.bookingRef}`
      )

      // Confirm to client if they have a phone number
      if (booking.clientPhone) {
        await sendWhatsApp(`whatsapp:${booking.clientPhone}`,
          `Hey ${booking.clientName.split(' ')[0]}! ✂️\n\nYour booking with Swakk Mobile Barbering is confirmed.\n\n📅 *${booking.date} at ${booking.time}*\n💈 ${booking.service}\n💰 AED ${booking.price}\n\nYour ref: *${booking.bookingRef}*\n\n_Cancellations within 24 hours may incur a 50% fee._\n\nSee you soon 👊`
        )
      }
    }

    if (type === 'reminder') {
      if (booking.clientPhone) {
        await sendWhatsApp(`whatsapp:${booking.clientPhone}`,
          `Hey ${booking.clientName.split(' ')[0]}! 👋\n\nJust a reminder — your haircut with Swakk is *tomorrow at ${booking.time}*.\n\n📍 We come to you, so make sure someone's home.\n\nNeed to cancel? Reply here or cancel via your booking ref: *${booking.bookingRef}*\n\n_24hr cancellation policy applies._`
        )
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
})
