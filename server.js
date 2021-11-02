const app = require('./index');
const PORT = process.env.PORT || 8080;
const MODE = process.env.NODE_ENV || NULL;

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode and listening on port: ${PORT}`);
});