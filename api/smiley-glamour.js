export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const response = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 14000,
        currency: "NGN",
        reference: "celst_" + Date.now(),
        customer: {
          email: "Regular@email.com",
          name: "Smiley"
        },
        redirect_url: "https://t.me/Glamourofficialcoach/?text=I'm%20ready%20to%20know%20more%20about%20GLAMOUR%20and%20Purchase%20coupon%20code%20for%20Registration"
      })
    });

    const data = await response.json();

    if (!data || data.status !== true) {
      return res.status(400).json({
        error: "Korapay failed",
        details: data
      });
    }

    return res.status(200).json({
      checkout_url: data.data.checkout_url
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
