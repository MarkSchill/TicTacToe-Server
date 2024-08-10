
// Middleware to prevent unauthorized access to routes
function requireLogin(req, res, next) {
	if (req.session.registered) {
		next();
	} else {
		res.status(401).json({ errors: ['You are not authorized.'] });
	}
}

module.exports = { requireLogin };