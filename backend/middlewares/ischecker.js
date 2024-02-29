var db = require("../models");
var Tradestaff = db.tradestaff;

const ischecker = async (req, res,next) => {
    try {
      const data = await Tradestaff.findAll({
        where: { StaffId: req.user.StaffId },
      });
      if (data && data.length > 0) {
        if (data[0].dataValues.Role === "Checker") {
           next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      }
      else{
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };

  module.exports = ischecker;
  