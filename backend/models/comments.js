'use strict';
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    qna_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'QnAs',
        key: 'QnA_id'
      }
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'professors',
            key: 'professor_id'
        }
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'students',
            key: 'student_id'
        }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDeleted: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
    }
  })
  comments.associate = function(models) {
    comments.belongsTo(models.professors, {
      foreignKey: 'professor_id',
      targetKey: 'professor_id'
    });

    comments.belongsTo(models.students, {
      foreignKey: 'student_id',
      targetKey: 'student_id'
    });
    // associations can be defined here
  };
  return comments;
};