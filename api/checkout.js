export default async function handler(req, res) {

  // ✅ CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ HANDLE PREFLIGHT (VERY IMPORTANT)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ❌ ONLY ALLOW POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    const validAmounts = [8500, 14500];

    if (!validAmounts.includes(Number(amount))) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const response = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Number(amount),
        currency: "NGN",
        reference: "ref_" + Date.now(),
        customer: {
          email: "test@email.com",
          name: "Customer"
        },
        redirect_url: "https://t.me/Celesteofficialcoach/?text=I'm%20ready%20to%20know%20more%20about%20CELESTE%20and%20Purchase%20coupon%20code%20for%20Registration"
      })
    });

    const data = await response.json();

    // ❗ CHECK IF KORAPAY FAILED
    if (!data || data.status !== true) {
      return res.status(400).json({
        error: "Korapay failed",
        details: data
      });
    }

    // ✅ RETURN CLEAN RESPONSE
    return res.status(200).json({
      data: {
        checkout_url: data.data.checkout_url
      }
    });

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
