const { product, user } = require("../../models");



exports.getProduct = async (req, res) => {
    try {
        const dataAll = await product.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        let FILE_PATH = 'http://localhost:5000/uploads/'
        data = JSON.parse(JSON.stringify(dataAll))

        data = data.map((item) => {
            return {
                ...item,
                image: FILE_PATH + item.image
            }
        })


        res.send({
            status: "success...",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};


// exports.addProduct = async (req, res) => {
//     try {
//         const data = {
//             name: req.body.name,
//             desc: req.body.desc,
//             price: req.body.price,
//             image: req.file.filename,
//             qty: req.body.qty,
//             idUser: req.user.id,
//         };

//         let newProduct = await product.create(data);


//         let productData = await product.findOne({
//             where: {
//                 id: newProduct.id,
//             },
//             include: [
//                 {
//                     model: user,
//                     as: 'user',
//                     attributes: {
//                         exclude: ['createdAt', 'updatedAt', 'password'],
//                     },
//                 },
//             ],
//             attributes: {
//                 exclude: ['createdAt', 'updatedAt', 'idUser'],
//             },
//         });
//         productData = JSON.parse(JSON.stringify(productData));

//         res.send({
//             status: 'success...',
//             data: {
//                 ...productData,
//                 image: 'http://localhost:5000/uploads/' + productData.image
//             },
//         });
//     } catch (error) {


//         res.status(500).send({
//             status: 'failed',
//             message: error.message,
//         });
//     }
// };
exports.addProduct = async (req, res) => {
    try {


        const data = {
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            image: req.file.filename,
            qty: req.body.qty,
            idUser: req.user.id,
        };

        let newProduct = await product.create(data);

        let productData = await product.findOne({
            where: {
                id: newProduct.id,
            },
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idUser'],
            },
        });
        productData = JSON.parse(JSON.stringify(productData));

        res.send({
            status: 'success...',
            data: {
                ...productData,
                image: process.env.PATH_FILE + productData.image,
            },
        });
    } catch (error) {


        res.status(500).send({
            status: 'failed',
            message: error.message,
        });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const { id } = req.params;
        let dataAll = await product.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idUser'],
            },
        });

        let FILE_PATH = 'http://localhost:5000/uploads/'
        data = JSON.parse(JSON.stringify(dataAll))

        data = {
            ...data,
            image: FILE_PATH + data.image

        }


        res.send({
            status: 'success...',
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: 'failed',
            message: 'Server Error',
        });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const dataAll = {
            name: req?.body?.name,
            desc: req?.body.desc,
            price: req?.body?.price,
            image: req.file.filename,
            qty: req?.body?.qty,
            idUser: req?.user?.id,
        };


        await product.update(dataAll, {
            where: {
                id,
            },
        });

        res.send({
            status: 'success',
            data: {
                id,
                dataAll,
                image: req?.file?.filename,

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


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        await product.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            message: `Delete user id: ${id} finished`
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}
