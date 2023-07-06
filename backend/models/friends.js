'use strict';
module.exports = (sequelize, DataTypes) => {
  const friends = sequelize.define('friends', {
    friend_id: {
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
    friend_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'student_id'
        }
    },
    isDeleted: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
    }

  }, {
    timestamps: false
  })
  friends.associate = function(models) {
    friends.belongsTo(models.students, {
      foreignKey: 'student_id',
      targetKey: 'student_id'
    });

    friends.belongsTo(models.students, {
      foreignKey: 'friend_id',
      targetKey: 'student_id'
    });
    // associations can be defined here
  };
  return friends;
};