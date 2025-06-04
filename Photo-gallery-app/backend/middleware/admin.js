Module.exports = (req, res, next) => {
    If (!req.user || !req.user.isAdmin) {
        Return res.status(403).json({ error: ‘Admin access required’ });
    }
    Next();
};

