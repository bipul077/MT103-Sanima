module.exports = (sequelize, DataTypes) => {
    const FileUpload = sequelize.define(
      "fileupload",
      {
        // Model attributes are defined here
        swift_file: {
          type: DataTypes.STRING,
        },
        staff_id: {
          type: DataTypes.INTEGER,
        },  
        branch_id: {
          type: DataTypes.INTEGER,
        },
        department_id:{
          type: DataTypes.INTEGER,
        },
        name:{
          type: DataTypes.STRING,
        },
        conclusion:{
          type: DataTypes.STRING,
        },
        swift_file_name:{
          type: DataTypes.STRING,
        }
      },
      {
      }
    );
    return FileUpload;
  };
  