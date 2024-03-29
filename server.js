const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./dist'));

app.get('*', function (req, res, next) {
  try {
    res.sendFile(__dirname + '/dist/index.html', undefined, (err) => {
      next(err.message);
    });
  } catch (err) {
    next('NotFoundFileError');
  }
});

app.listen(PORT, function () {
  console.log(`Listening on port: ${PORT}`);
});
