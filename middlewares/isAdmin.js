require('dotenv').config();

const isAdmin = (req, res, next) => {
    const adminApiKey = req.headers['admin-key'];

    if (adminApiKey && adminApiKey === process.env.ADMIN_API_KEY) {
        next()
    } else {
        return res.status(401).json({ message: 'Unauthorized: Access denied' });
    }
};

module.exports = { isAdmin };