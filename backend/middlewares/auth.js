const axios = require("axios");
const auth = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    // const tokens = req.header('auth-token');
    //console.log(tokens.split(' ')[1]);
    // const token = tokens.split(' ')[1];
    if (token) {
      axios
        .post(
          "https://commonapi.sanimabank.com:8091/api/verify/token",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          //console.log(response.data);
          if (response.data.success === true) {
            req.user = response.data;
            next();
          } else {
            res.status(401).json({ error: "Invalid token" });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(401).json({error: 'Invalid token'});
        });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "User Unauthorized" });
  }
};

module.exports = auth;
