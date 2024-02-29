module.exports = (sequelize, DataTypes) => {
    const Logshead = sequelize.define(
      "Logshead",
      {
        // Model attributes are defined here
        StaffId: {
          type: DataTypes.STRING,
        },
        Name: {
          type: DataTypes.STRING,
        },
        Role: {
          type: DataTypes.STRING,
        },
        Action:{
          type: DataTypes.STRING,
        } 
      },
      {}
    );
    return Logshead;
  };
  