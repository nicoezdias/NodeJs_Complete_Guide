const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');
const adminRoutes = require('./routes/admin.routes');
const shopRoutes = require('./routes/shop.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
const store = new MongoDBStore({
	uri: process.env.DB_URL,
	collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(process.env.DB_URL)
	.then((result) => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: 'Max',
					email: 'max@test.com',
					cart: {
						items: [],
					},
				});
				user.save();
			}
		});
		app.listen(PORT);
	})
	.catch((err) => {
		console.log(err);
	});
