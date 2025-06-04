[span_109](start_span)const jwt = require(‘jsonwebtoken’);[span_109](end_span)

[span_110](start_span)module.exports = async (req, res, next) => {[span_110](end_span)
  Try {
    [span_111](start_span)const token = req.header(‘Authorization’)?.replace(‘Bearer ‘, ‘’);[span_111](end_span)
    [span_112](start_span)if (!token) throw new Error(‘No token provided’);[span_112](end_span)
    [span_113](start_span)const decoded = jwt.verify(token, process.env.JWT_SECRET);[span_113](end_span)
    Req.user = decoded; // Corrected Req.user to req.user
    Next(); // Corrected Next() to next()
  [span_114](start_span)} catch (err) {[span_114](end_span)
    [span_115](start_span)res.status(401).json({ error: ‘Authentication failed’ });[span_115](end_span)
  }
};

