const jwt = require('jsonwebtoken');
require('dotenv').config();

const FetchUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('Authentication-Token');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }

  try {
    // Decode the token to get the expiry time
    const decodedToken = jwt.decode(token, { complete: true });

    // Check if the token is valid
    if (!decodedToken || !decodedToken.payload.exp) {
      return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    // Check if the token is expired
    if (Date.now() >= decodedToken.payload.exp * 1000) {
      return res.status(401).json({ error: "Token expired. Please authenticate again" });
    }

    // Verify the signature of the token
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = data.user;
    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
}

module.exports = FetchUser;
