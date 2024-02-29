module.exports = (sequelize, DataTypes) => {
  const TradeStaff = sequelize.define(
    "Usertype",
    {
      // Model attributes are defined here
      StaffId: {
        type: DataTypes.STRING,
      },
      Name: {
        type: DataTypes.STRING,
      },
      UserName:{
        type: DataTypes.STRING,
      },
      Department_Name: {
        type: DataTypes.STRING,
      },
      Role: {
        type: DataTypes.STRING,
      },
      Created_By:{
        type: DataTypes.STRING,
      },
      Updated_By:{
        type: DataTypes.STRING,
      }
    },
    {}
  );
  return TradeStaff;
};
