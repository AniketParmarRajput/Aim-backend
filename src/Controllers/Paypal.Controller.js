import paypal from "@paypal/checkout-server-sdk";
import db from "../Model/index.js";




// PAYPAL ENVIRONMENT

const environment =
new paypal.core.SandboxEnvironment(

  process.env.PAYPAL_CLIENT_ID,

  process.env.PAYPAL_CLIENT_SECRET

);


// PAYPAL CLIENT

const client =
new paypal.core.PayPalHttpClient(environment);





// CREATE ORDER

export const createOrder = async (req, res) => {

  try {

    const { amount, itemName, quantity  } = req.body;
console.log(req.body)

    const request =
    new paypal.orders.OrdersCreateRequest();

    request.prefer("return=representation");


    request.requestBody({

      intent: "CAPTURE",

      purchase_units: [

        {

          description: itemName,
           custom_id: JSON.stringify({
            quantity,
          }),

          amount: {

            currency_code: "INR",

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

    const { orderID,quantity   } = req.body;


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





    // SAVE TO DATABASE USING SEQUELIZE MODEL

    try {

      await db.PaypalPayment.create({

        orderID: orderID,

        paymentID: paymentID,

        payerEmail: payerEmail,

        amount: amount,

        currency: currency,

        status: status,

        quantity: quantity,

      });

      res.json({

        success: true,

        payment: capture.result,

      });
    } catch (err) {

      console.log(err);

      return res.status(500).json({

        message: "Database Error",

      });
    }

  } catch (err) {

    console.log(err);

    res.status(500).json({

      message: "Capture Failed",

    });
  }
};


 export  default { createOrder, captureOrder };