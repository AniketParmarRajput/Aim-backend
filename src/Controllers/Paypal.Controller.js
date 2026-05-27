import paypal from "@paypal/checkout-server-sdk";
import db from "../../Config/db.js";




// PAYPAL ENVIRONMENT

const environment =
new paypal.core.SandboxEnvironment(

  process.env.PAYPAL_CLIENT_ID,

  process.env.PAYPAL_CLIENT_SECRET

);
console.log("++++++++++++++++++++++")
console.log(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
console.log("++++++++++++++++++++++")



// PAYPAL CLIENT

const client =
new paypal.core.PayPalHttpClient(environment);





// CREATE ORDER

export const createOrder = async (req, res) => {

  try {

    const { amount, itemName } = req.body;
console.log(req.body)

    const request =
    new paypal.orders.OrdersCreateRequest();

    request.prefer("return=representation");


    request.requestBody({

      intent: "CAPTURE",

      purchase_units: [

        {

          description: itemName,

          amount: {

            currency_code: "USD",

            value: amount.toString(),

          },
        },
      ],
    });


    const order =
    await client.execute(request);


    res.json({

      id: order.result.id,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      message: "Create Order Failed",

    });
  }
};



export const captureOrder = async (req, res) => {

  try {

    const { orderID } = req.body;


    const request =
    new paypal.orders.OrdersCaptureRequest(orderID);

    request.requestBody({});


    const capture =
    await client.execute(request);



    // EXTRACT DATA

    const paymentID =
    capture.result.purchase_units[0]
    .payments.captures[0].id;

    const payerEmail =
    capture.result.payer.email_address;

    const amount =
    capture.result.purchase_units[0]
    .payments.captures[0]
    .amount.value;

    const currency =
    capture.result.purchase_units[0]
    .payments.captures[0]
    .amount.currency_code;

    const status =
    capture.result.status;





    // SAVE SQL DATABASE

    const sql = `

      INSERT INTO payments

      (

        order_id,

        payment_id,

        payer_email,

        amount,

        currency,

        status

      )

      VALUES (?, ?, ?, ?, ?, ?)

    `;


    db.query(

      sql,

      [

        orderID,

        paymentID,

        payerEmail,

        amount,

        currency,

        status,

      ],

      (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({

            message: "Database Error",

          });
        }


        res.json({

          success: true,

          payment: capture.result,

        });
      }
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({

      message: "Capture Failed",

    });
  }
};


 export  default { createOrder, captureOrder };