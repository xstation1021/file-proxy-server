const request = require('request');


module.exports = {
    canAccess: function(req, res, next){
      let config = req.app.get('config');
      let idToken = null;
      if(req.cookies.id_token !== undefined){
        idToken = req.cookies.id_token;
      } else if(req.cookies.idToken !== undefined){
        idToken = req.cookies.idToken;
      }
      console.log(config.apiDomain);
      if(idToken === null){
        res.send('Access denied1');
      } else {
        var options = {
          method: 'post',
          url: config.apiDomain + '/v1/user/fileaccess',
          headers: {'Authorization': 'Bearer ' + idToken},
          json: {
            filePath: 'https://s3.amazonaws.com/files.equitydatascience.com/prod/Portfolio/Portfolio.pdf'
          }
        };

        request(options, function (err, response, body) {
          if (err) {
            res.send('Access denied2');
          } else if(response.statusCode !== 200){
            console.log(config);
            console.log(response.statusCode);
            res.send('Access denied3');
          }
          return next();
        });
      }
    }
}