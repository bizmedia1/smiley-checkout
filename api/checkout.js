export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
        redirect_url: "https://tr.ee/kf8yz4NjOi"
      })
    });

    const data = await response.json();

    // 🔥 RETURN FULL RESPONSE FOR DEBUG
    return res.status(200).json({
  data: {
    checkout_url: data.data.checkout_url
  }
});
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
