import UserController from '../controllers/user.controller';
const User = new UserController();

export default function user (router, passport) {

	router.post('/login',
		passport.authenticate('local', {
		}), User.login);

	router.post('/create', User.create);

	router.get('/logout', User.logout);

	return router;

};
