[span_3](start_span)require(‘dotenv’).config();[span_3](end_span)
[span_4](start_span)const express = require(‘express’);[span_4](end_span)
[span_5](start_span)const mongoose = require(‘mongoose’);[span_5](end_span)
[span_6](start_span)const cors = require(‘cors’);[span_6](end_span)
[span_7](start_span)const authRoutes = require(‘./routes/auth’);[span_7](end_span)
[span_8](start_span)const imageRoutes = require(‘./routes/images’);[span_8](end_span)
[span_9](start_span)const adminRoutes = require(‘./routes/admin’);[span_9](end_span)
[span_10](start_span)const app = express();[span_10](end_span)

// Middleware
[span_11](start_span)app.use(cors());[span_11](end_span)
[span_12](start_span)app.use(express.json());[span_12](end_span)

// Database
[span_13](start_span)mongoose.connect(process.env.MONGODB_URI)[span_13](end_span)
  [span_14](start_span).then(() => console.log(‘MongoDB connected’))[span_14](end_span)
  [span_15](start_span).catch(err => console.error(err));[span_15](end_span)

// Routes
[span_16](start_span)app.use(‘/api/auth’, authRoutes);[span_16](end_span)
[span_17](start_span)app.use(‘/api/images’, imageRoutes);[span_17](end_span)
[span_18](start_span)app.use(‘/api/admin’, adminRoutes);[span_18](end_span)

Const PORT = process.env.PORT || [span_19](start_span)5000;[span_19](end_span)
[span_20](start_span)app.listen(PORT, () => console.log(`Server running on port ${PORT}`));[span_20](end_span)

