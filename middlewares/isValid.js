require('dotenv').config();

const isValid = (req, res, next) => {
    const xApiKey = req.headers['api-key'];

    if (xApiKey && xApiKey === process.env.X_API_KEY) {
        next()
    } else {
        return res.status(401).json({ message: 'Unauthorized: Permission denied' });
    }
};

module.exports = { isValid };