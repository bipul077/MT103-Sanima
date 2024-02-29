module.exports = (sequelize, DataTypes) => {
  const SwiftMsg = sequelize.define(
    "SwiftMsg",
    {
      // Model attributes are defined here
      Title: {
        type: DataTypes.STRING,
      },
      Ttref: {
        type: DataTypes.STRING,
      },
      Tran_ID:{
        type: DataTypes.STRING,
      },
      Refstatus:{
        type: DataTypes.STRING,
      },
      Ticket_No: {
        type: DataTypes.STRING,
      },
      Amount: {
        type: DataTypes.STRING,
      },
      Request_By: {
        type: DataTypes.STRING,
      },
      Request_By_Id: {
        type: DataTypes.INTEGER,
      },
      Assigned_to: {
        type: DataTypes.STRING,
      },
      Remarks: {
        type: DataTypes.STRING,
      },
      Comments: {
        type: DataTypes.TEXT,
      },
      Swift_Msg: {
        type: DataTypes.TEXT,
      },
      Approved_Swift_Msg: {
        type: DataTypes.TEXT,
      },
      Status: {
        type: DataTypes.INTEGER,
      },
      TT_app_url: {
        type: DataTypes.STRING,
      },
      Performa_url: {
        type: DataTypes.STRING,
      },
      is_forwarded_to_swift: {
        type: DataTypes.STRING,
      },
      Swift_remark: {
        type: DataTypes.STRING,
      },
      is_reverted: {
        type: DataTypes.STRING,
      },
      swift_request_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'SwiftMsg', // We need to choose the model name what we write in inside while defining above ""
      paranoid: true,
      deletedAt: 'soft_delete'
    }
  );
  return SwiftMsg;
};
