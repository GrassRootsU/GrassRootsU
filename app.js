var createError = require('http-errors');
var express = require('express');
const fileUpload = require('express-fileupload');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/public',  express.static(path.join(__dirname, '/public')));

/**
 * Default EJS variables
 */
app.use(expressLayouts);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

/**
 * ---------- ERROR HANDLING ----------
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * ---------- ROUTES ----------
 */
function addRoutesR(_root = './routes', _path = '') {
  fs.readdirSync(
      `${_root}/${_path}`,
      err => console.log(err)
  ).forEach(dir => {
      if (!dir.includes('.'))
          return addRoutesR(_root, `${_path}/${dir}`);
      else if (dir.endsWith('.js') && !dir.startsWith('-')) {
          with ({ route: dir.replace('.js', '') }) {
              if (route === 'index') {
                  app.use(_path, require(`${_root}${_path}/${dir}`));
                  console.log('Added route', _path ? _path : '/', `${_root}${_path}/${dir}`);
              } else {
                  app.use(`${_path}/${route}`, require(`${_root}${_path}/${dir}`));
                  console.log('Added route', `${_path}/${route}`, `${_root}${_path}/${dir}`);
              }
          }
      }
  });
}
addRoutesR('./routes');

module.exports = app;
