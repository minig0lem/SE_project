'use strict';
module.exports = (sequelize, DataTypes) => {
  const enrollments = sequelize.define('enrollments', {
    enrollment_id: {
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  });
  enrollments.associate = function(models) {
    enrollments.belongsTo(models.students, {
      foreignKey: 'student_id',
      targetKey: 'student_id'
    });

    enrollments.belongsTo(models.subjects, {
      foreignKey: 'subject_id',
      targetKey: 'subject_id'
    });
    // associations can be defined here
  };
  return enrollments;
};