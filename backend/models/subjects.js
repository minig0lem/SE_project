'use strict';
module.exports = (sequelize, DataTypes) => {
  const subjects = sequelize.define('subjects', {
    subject_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    subject_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_professor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model:'professors',
            key: 'professor_id'
        }
    },
    subject_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_grade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subject_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subject_room: {
        type: DataTypes.STRING,
        allowNull: false
    },
  }, {
    timestamps: false
  });
  subjects.associate = function(models) {
    subjects.belongsToMany(models.students, {
        through: models.enrollments,
        foreignKey: 'subject_id',
        otherKey: 'student_id'
    });

    subjects.belongsTo(models.professors, {
        foreignKey: 'subject_professor',
        targetKey: 'professor_id'
    });
    // associations can be defined here
  };
  return subjects;
};