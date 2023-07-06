'use strict';
module.exports = (sequelize, DataTypes) => {
  const files = sequelize.define('files', {
    file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_content: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    file_mimetype: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false
  });
  files.associate = function(models) {
    // associations can be defined here
  };
  return files;
};