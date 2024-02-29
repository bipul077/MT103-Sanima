module.exports = (sequelize, DataTypes) => {
    const NostroSwift = sequelize.define(
      "NostroSwift",
      {
        // Model attributes are defined here
        Currency: {
          type: DataTypes.STRING,
        },
        ACCOUNT_NO: {
          type: DataTypes.STRING,
        },
        Nostro_SWIFT:{
          type: DataTypes.STRING,        
        },
        BANK_NAME: {
          type: DataTypes.STRING,
        }
      },
      {
        timestamps: false,
      }
    );
    return NostroSwift;
  };