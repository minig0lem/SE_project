'use strict';
module.exports = (sequelize, DataTypes) => {
  const syllabus = sequelize.define('syllabus', {
    syllabus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    professor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'professors',
        key: 'professor_id'
      }
    },
    subject_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'subject_id'
      }
    },
    syllabus_outline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    syllabus_purpose: {
      type: DataTypes.STRING,
      allowNull: false
    },
    syllabus_details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isDeleted: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
    },  
  }, {
    tableName: 'syllabus'
  });
  syllabus.associate = function(models) {
    syllabus.belongsTo(models.professors, {
      foreignKey: 'professor_id',
      targetKey: 'professor_id'
    });

    syllabus.belongsTo(models.subjects, {
      foreignKey: 'subject_id',
      targetKey: 'subject_id'
    });
    // associations can be defined here
  };
  return syllabus;
};