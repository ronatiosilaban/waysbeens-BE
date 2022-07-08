const { array } = require('joi');
const { user, product, cart } = require('../../models')
// const cart = require('../../models/cart')

// exports.addCart = async (req, res) => {
//     try {
// let newData = await cart.findAll({
//     include: {
//         model: user,
//         as: "user",
//         attributes: {
//             exclude: ["createdAt", "updatedAt", "idUser"],
//         },
//     },
//     where: {
//         id: newData.idUser,
//     },
//     attributes: {
//         exclude: ["createdAt", "updatedAt"],
//     },
// });

// // let data = req.body
// data = {
//     ...newData,
//     idUser: req.user.id,
//     idProduct: req.body.id,
//     // qty =1
// }

// if (data) {
//     await cart.update(
//         {
//             qty: cart.qty + 1
//         },
//         {
//             where: { id: data }
//         }
//     );
// } else {
//     await cart.create({
//         idUser: idUser,
//         idProduct: idProduct,
//         qty: 1
//     });
// }
exports.addCart = async (req, res) => {
    try {

        let data = req.body;
        const idUser = req.user.id;


        data = {
            ...data,
            idUser: idUser,
            idProduct: data.idProduct
        };
        // console.log('data', data);
        let dataAll = await cart.findOne({
            where: {
                idUser: data.idUser,
                idProduct: data.idProduct
            }
        });
        if (dataAll) {
            await cart.update(
                {
                    qty: dataAll.qty + 1
                },
                {
                    where: { id: dataAll.id }
                }
            );
            res.send({
                status: 'success',
                data: dataAll
            })
        } else {
            await cart.create({
                idUser: data.idUser,
                idProduct: data.idProduct,
                qty: 1
            })
        }
        res.send({
            status: 'success',
            data: data
        })

        // console.log('dats', dataAll);
    } catch (error) {
        console.log(error);
    }

}

exports.deleteCart = async (req, res) => {
    try {
        const idUser = req.user.id;
        let data = req.body;

        data = {
            ...data,
            idUser: idUser,
            // idProduct: idProduct
        };
        console.log('data', data);
        let dataAll = await cart.findOne({
            where: {
                idUser: idUser,
                // idProduct: idProduct
            }
        });
        if (dataAll) {
            if (dataAll.qty > 1) {
                await cart.update(
                    {
                        qty: dataAll.qty - 1
                    },
                    {
                        where: { id: dataAll.id }
                    }
                );
                // res.send({
                //     status: 'success',
                //     data: dataAll
                // })
            } else {
                await cart.destroy({
                    where: {
                        id: dataAll.id
                    }
                })
            }
            res.send({
                status: 'success',
                message: `Delete cart with id: ${dataAll.id} finished`
            })
        }
        else {
            res.send({
                status: 'Failed',
                message: `data not found`
            })
        }

        // console.log('dats', dataAll);
    } catch (error) {
        console.log(error);
    }

}

exports.updateCart = async (req, res) => {
    try {


        const dataAll = {
            qty: req?.body?.qty,
            idProduct: req?.body?.idProduct

        };


        await cart.update(dataAll, {
            where: {
                idProduct: dataAll.idProduct
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

exports.getCart = async (req, res) => {
    try {
        const idUser = req.user.id;
        // console.log('data', data);
        let dataAll = await cart.findAll({
            where: {
                idUser: idUser
            },
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                {
                    model: product,
                    as: 'product',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idUser'],
            },
        });

        let FILE_PATH = 'http://localhost:5000/uploads/'
        data = JSON.parse(JSON.stringify(dataAll))

        data = data.map((item) => {
            return {
                qty: item.qty,
                data,
                product: {
                    ...item.product,
                    image: FILE_PATH + item.product.image
                }
            }


        }
        )
        if (data) {

            res.send({
                status: 'success',
                data: data
            })
        } else {
            res.send({
                status: 'success',
                message: 'data not found'
            })
        }

        // console.log('dats', dataAll);
    } catch (error) {
        console.log(error);
    }


}


exports.getCount = async (req, res) => {
    try {
        const idUser = req.user.id;
        let dataAll = await cart.findAll({
            where: {
                idUser: idUser
            },
        });

        data = JSON.parse(JSON.stringify(dataAll))


        // data = data.map((item) => {
        //     return {
        //         Count: data.length
        //     }


        // }
        // )
        if (data) {

            res.send({
                status: 'success',
                data: {
                    amount: dataAll.length
                }
            })
        } else {
            res.send({
                status: 'success',
                message: 'data not found'
            })
        }
    } catch (error) {
        console.log(error);
    }


}