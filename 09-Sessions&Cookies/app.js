const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const adminRoutes = require('./routes/admin.routes');
const shopRoutes = require('./routes/shop.routes');

const app = express();
mongoose.set('strictQuery', false);
dotenv.config();
const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('63e5829718731e218ccf65c7')
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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
