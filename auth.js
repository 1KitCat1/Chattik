const users = [
    { id: 1, username: 'john', password: 'password1' },
    { id: 2, username: 'jane', password: 'password2' },
    { id: 3, username: 'admin', password: 'admin123' }
  ];
  
  const auth = {
    login(req, res) {
      const { username, password } = req.query;

      if (!username || !password) {
        res.status(400).send('Invalid username or password');
        return;
      }
  
      const user = users.find(u => u.username === username && u.password === password);
  
      if (user) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.status(401).send('Invalid username or password');
      }
    },
  
    logout(req, res) {
      delete req.session.user;
      res.redirect('/');
    }
  };
  
  module.exports = auth;
  