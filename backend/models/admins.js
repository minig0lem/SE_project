'use strict';
module.exports = (sequelize, DataTypes) => {
  const admins = sequelize.define('admins', {
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    pw: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
  }, {
    timestamps: false
  });
  admins.associate = function(models) {
    // associations can be defined here
  };
  return admins;
};