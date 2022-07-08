'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      cart.belongsTo(models.product, {
        as: "product",
        foreignKey: {
          name: "idProduct",
        },
      });
      cart.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  cart.init({
    idProduct: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};