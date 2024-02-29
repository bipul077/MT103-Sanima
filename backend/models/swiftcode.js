module.exports = (sequelize, DataTypes) => {
    const SwiftCode = sequelize.define(
      "SwiftCode",
      {
        // Model attributes are defined here
        BIC: {
          type: DataTypes.STRING,
        },
        InstitutionName:{
          type: DataTypes.STRING,        
        },
        CityName: {
          type: DataTypes.STRING,
        },
        Country:{
            type: DataTypes.STRING,
        },
        BranchInfo:{
            type: DataTypes.STRING,
        }
      },
      {
        timestamps: false,
      }
    );
    return SwiftCode;
  };