'use strict';
module.exports = (sequelize, DataTypes) => {
  const assign_submit = sequelize.define('assign_submit', {
    submit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'student_id'
      }
    },
    assign_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assign_register',
        key: 'register_id'
      }
    },
    submit_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    submit_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    submit_file: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
          model: 'files',
          key: 'file_id'
      }
    },
    isDeleted: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
    },  
  }, {
    tableName: 'assign_submit'
  });
  assign_submit.associate = function(models) {
    assign_submit.belongsTo(models.students, {
      foreignKey: 'student_id',
      targetKey: 'student_id'
    });

    assign_submit.belongsTo(models.assign_register, {
      foreignKey: 'assign_id',
      targetKey: 'register_id'
    });

    assign_submit.belongsTo(models.files, {
      foreignKey: 'submit_file',
      targetKey: 'file_id'
    });
    // associations can be defined here
  };
  return assign_submit;
};