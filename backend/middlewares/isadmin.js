const Head = process.env.REACT_APP_HEAD
const isadmin = async (req, res,next) => {
    try {
 
        if (Head.includes(req.user.StaffId)) {
           next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };

  module.exports = isadmin;
  