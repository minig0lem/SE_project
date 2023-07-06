'use strict';
module.exports = (sequelize, DataTypes) => {
  const QnAs = sequelize.define('QnAs', {
    QnA_id: {
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
    subject_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'subject_id'
      }
    },
    QnA_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    QnA_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDeleted: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
    }
  });
  QnAs.associate = function(models) {
    QnAs.belongsTo(models.students, {
      foreignKey: 'student_id',
      targetKey: 'student_id'
    });

    QnAs.belongsTo(models.subjects, {
      foreignKey: 'subject_id',
      targetKey: 'subject_id'
    });
    // associations can be defined here
  };
  return QnAs;
};