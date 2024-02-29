const { Sequelize,DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('MT103', 'test_user', 'sanima@123', {
    host: '192.168.29.7',
    logging: false,
    dialect: 'mssql',
    timezone: '05:45'
    // define:{
    //   timestamps:false
    // } 
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.tradestaff = require('./tradestaff')(sequelize,DataTypes)
  db.logshead = require('./logshead')(sequelize,DataTypes)
  db.mtswift = require('./swiftmsg')(sequelize,DataTypes)
  db.mtlogs = require('./mtlogs')(sequelize,DataTypes)
  db.nostroswift = require('./nostrocode')(sequelize,DataTypes)
  db.swiftcode = require('./swiftcode')(sequelize,DataTypes)
  db.fileupload = require('./fileupload')(sequelize,DataTypes)
  db.swiftlogs = require('./swiftlogs')(sequelize,DataTypes)
 
  
  db.mtswift.hasMany(db.swiftlogs,{
    foreignKey: "outward_request_id",
    as: 'Swiftlog'
  })

  db.swiftlogs.belongsTo(db.mtswift,{
    foreignKey: "outward_request_id",
    as: 'SwiftMsg'
  })

  db.mtlogs.belongsTo(db.mtswift,{
    foreignKey: "outward_request_id",
    as: 'SwiftMsg'
  })

  db.fileupload.belongsTo(db.mtswift,{
    foreignKey: "outward_request_id",
    as: 'SwiftMsg'
  })


  db.sequelize.sync({force:false});
  module.exports = db