const isview = async (req, res, next) => {
  try {
    if (req.user.DeptId === "67" || req.user.DeptId === "52" || req.user.DeptId === "8") {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = isview;
