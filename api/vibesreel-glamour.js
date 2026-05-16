export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    const {
      fullname,
      email,
      phone,
      course,
      amount
    } = req.body;



    // VALIDATION

    if (
      !fullname ||
      !email ||
      !phone ||
      !course ||
      !amount
    ) {

      return res.status(400).json({
        error: "Missing required fields"
      });

    }



    // CUSTOM EMAIL

    const firstName = fullname
  .trim()
  .split(" ")[0];

const cleanName = firstName
  .toLowerCase()
  .replace(/\s+/g, "");

    const cleanCourse = course
      .toLowerCase()
      .replace(/\s+/g, "");

    const customEmail =
      `${cleanName}${cleanCourse}@gmail.com`;



    // UNIQUE REFERENCE

    const reference =
      "vibesreel_" + Date.now();



    // KORAPAY REQUEST

    const response = await fetch(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${process.env.KORAPAY_SECRET_KEY}`,

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          amount: amount,

          currency: "NGN",

          reference: reference,

          customer: {

            email: customEmail,

            name: fullname

          },

          redirect_url:
            "https://t.me/goldsupplyer/?text=Payment%20successful%20,%20Please%20Verify",

          metadata: {

            original_email: email,

            whatsapp: phone,

            course: course

          }

        })

      }
    );



    const data = await response.json();



    if (!data || data.status !== true) {

      return res.status(400).json({

        error: "Korapay failed",

        details: data

      });

    }



    return res.status(200).json({

      checkout_url:
        data.data.checkout_url

    });

  }

  catch (error) {

    return res.status(500).json({

      error: "Server error",

      details: error.message

    });

  }

}
