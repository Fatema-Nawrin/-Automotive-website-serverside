const { usersCollection } = require('../config/db');

const verifyAdmin = async (req, res, next) => {
  const requester = req.decoded.email;
  const query = { email: requester };
  const requesterInfo = await usersCollection.findOne(query);
  if (requesterInfo.role === 'admin') {
    next();
  } else {
    return res.status(403).send({ error: 'Forbidden access' });
  }
};

module.exports = verifyAdmin;
