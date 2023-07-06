'use strict';
module.exports = (sequelize, DataTypes) => {
  const notices = sequelize.define('notices', {
    notice_id: {
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
    notice_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notice_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notice_file: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
          model: 'files',
          key: 'file_id'
      }
    },
    notice_views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
    isDeleted: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
    }
  });
  notices.associate = function(models) {
    notices.belongsTo(models.professors, {
      foreignKey: 'professor_id',
      targetKey: 'professor_id'
    });

    notices.belongsTo(models.subjects, {
      foreignKey: 'subject_id',
      targetKey: 'subject_id'
    });
    
    notices.belongsTo(models.files, {
      foreignKey: 'notice_file',
      targetKey: 'file_id'
    });
    
    // associations can be defined here
  };
  return notices;
};