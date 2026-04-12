export default async function handler(req, res) {
  const response = await fetch("https://api.mevonpay.com/initialize", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_SECRET_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: 12000,
      email: "test@email.com",
      callback_url: "https://your-site.com/success"
    })
  });

  const data = await response.json();

  res.status(200).json({
    checkout_url: data.data.payment_link
  });
}
