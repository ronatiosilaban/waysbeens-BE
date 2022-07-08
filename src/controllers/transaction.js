const { user, transaction, product, cart } = require('../../models')
const midtransClient = require("midtrans-client");

exports.getTransactions = async (req, res) => {
    try {

        const dataAll = await transaction.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idBuyer', "idSeller", 'idProduct']
            },
            include: [
                {
                    model: product,
                    as: 'product',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser', 'qty', 'idProduct']
                    }
                },
                {
                    model: user,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status', 'idBuyer', "idSeler", 'idProduct']
                    }
                },
                {
                    model: user,
                    as: 'seller',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status', 'idBuyer', "idSeler", 'idProduct']
                    }
                },
            ]
        })

        let FILE_PATH = 'http://localhost:5000/uploads/'

        res.send({
            status: 'success',
            data: dataAll,
            link: 'http://localhost:5000/uploads/'
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.addTransaction = async (req, res) => {
    try {
        // Prepare transaction data from body here ...
        let data = req.body;
        data = {
            id: parseInt(data.idProduct + Math.random().toString().slice(3, 8)),
            ...data,
            idBuyer: req.user.id,
            status: "pending",
        };
        // console.log('data6', data);

        // Insert transaction data here ...
        const newData = await transaction.create(data);

        // Get buyer data here ...
        const buyerData = await user.findOne({
            where: {
                id: newData.idBuyer,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        // const price = newData.price * newData.amount


        let parameter = {
            transaction_details: {
                order_id: newData.id,
                gross_amount: newData.amount,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                full_name: buyerData?.name,
                email: buyerData?.email,

            },
        };

        const payment = await snap.createTransaction(parameter);
        console.log('pymt', payment);

        res.send({
            status: "pending",
            message: "Pending transaction payment gateway",
            payment,
            newData,
            product: {
                id: data.idProduct,
            },
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const core = new midtransClient.CoreApi();

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY,
});
exports.notification = async (req, res) => {
    try {
        const statusResponse = await core.transaction.notification(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(statusResponse);

        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                // TODO set transaction status on your database to 'challenge'
                // and response with 200 OK
                updateTransaction("pending", orderId);
                res.status(200);
            } else if (fraudStatus == "accept") {
                // TODO set transaction status on your database to 'success'
                // and response with 200 OK
                updateProduct(orderId);
                updateTransaction("success", orderId);
                res.status(200);
            }
        } else if (transactionStatus == "settlement") {
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            updateTransaction("success", orderId);
            res.status(200);
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny" ||
            transactionStatus == "expire"
        ) {
            // TODO set transaction status on your database to 'failure'
            // and response with 200 OK
            updateTransaction("failed", orderId);
            res.status(200);
        } else if (transactionStatus == "pending") {
            // TODO set transaction status on your database to 'pending' / waiting payment
            // and response with 200 OK
            updateTransaction("pending", orderId);
            res.status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};
exports.updateTransactions = async (req, res) => {
    try {


        const dataAll = {
            status: req?.body?.status,
            idSeller: req?.body?.idSeller

        };


        await transaction.update(dataAll, {
            where: {
                idSeller: dataAll.idSeller
            },
        });

        res.send({
            status: 'success',
            data: {
                // idProduct,
                dataAll,


            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: 'failed',
            message: 'Server Error',
        });
    }
};

const updateTransaction = async (status, transactionId) => {
    await transaction.update(
        {
            status,
        },
        {
            where: {
                id: transactionId,
            },
        }
    );
};

// Create function for handle product update stock/qty here ...
const updateProduct = async (orderId) => {
    const transactionData = await transaction.findOne({
        where: {
            id: orderId,
        },
    });
    const productData = await product.findOne({
        where: {
            id: transactionData.idProduct,
        },
    });
    const qty = productData.qty - 1;
    await product.update({ qty }, { where: { id: productData.id } });
};