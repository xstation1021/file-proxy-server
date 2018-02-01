const request = require('request');


module.exports = {
    canAccess: function(req, res, next){
      let idToken = null;
      if(req.cookies.id_token !== undefined){
        idToken = req.cookies.id_token;
      } else if(req.cookies.idToken !== undefined){
        idToken = req.cookies.idToken;
      }
      if(idToken === null){
        res.send('Access denied');
      } else {
        var options = {
          method: 'post',
          url: 'http://localhost:8080/v1/user/fileaccess',
          headers: {'Authorization': 'Bearer ' + idToken},
          json: {
            filePath: 'https://s3.amazonaws.com/files.equitydatascience.com/prod/Dashboard/Dashboard.pdf'
          }
        };

        request(options, function (err, response, body) {
          if (err) {
            res.send('Access denied');
          } else if(response.statusCode !== 200){
            res.send('Access denied');
          }
          return next();
        });
      }
    }
}