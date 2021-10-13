let jwt = require('jsonwebtoken');

/**
 * Check token is Valid or Not
 * 
 */
let checkToken = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if(!token)
      res.json({'error': 'Please add the token'});

  token = token.startsWith('Bearer ') ? token.slice(7, token.length) : token ;     // Remove Bearer from string

  try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      res.locals.userData = decoded.userData;
      next();
  } catch(ex){
      return res.json({ error: 'invalid_token', message: 'Token is not valid' });
  }
}

module.exports = {
  checkToken: checkToken
}
