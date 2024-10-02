const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const newsletterRoutes = require('./routes/newsletter');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/newsletter', newsletterRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
