module.exports = (sequelize, DataTypes) => {
    const SwiftLogs = sequelize.define(
      "Swiftlog",
      {
        // Model attributes are defined here
        Message:{
          type: DataTypes.STRING,
        },
        Comment:{
          type: DataTypes.STRING,
        },
        staff_id:{
          type: DataTypes.INTEGER,
        },
        username: {
          type: DataTypes.STRING,
        },
        branch_id:{
          type: DataTypes.INTEGER,        
        },
        branch_name: {
          type: DataTypes.STRING,
        },
        department_id:{
          type: DataTypes.INTEGER,
        },
        department_name:{
          type: DataTypes.STRING,
        },
      },
      {}
    );
    return SwiftLogs;
  };
  