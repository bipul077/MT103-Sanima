module.exports = (sequelize, DataTypes) => {
  const MtLogs = sequelize.define(
    "MtLogs",
    {
      Request_By: {
        type: DataTypes.STRING,
      },
      Assigned_to: {
        type: DataTypes.STRING,
      },
      Message:{
        type: DataTypes.STRING,
      },
      Status: {
        type: DataTypes.INTEGER,
      },
    },
    {}
  );

  return MtLogs;
};

