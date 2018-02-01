const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const fs = require('fs');
const middlewares = require('./middlewares');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const environment = process.env.ENVIRONMENT || 'development';

let config = {};

if(environment === 'development') {
  // For dev
  config = JSON.parse(fs.readFileSync("config.json"));
} else {
  config = {
      apiDomain: process.env.API_DOMAIN,
      aws: {
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
      },
  };
}

const s3 = new AWS.S3({accessKeyId: config.aws.accessKey, secretAccessKey:config.aws.secretKey, region: config.aws.region});
const apiEndpoint = process.env.API_DOMAIN;

app.set('port', port);
app.set('config', config);
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/:env/:folder/:filename', middlewares.canAccess, (req, res) => {
    let params = {
        Bucket: 'files.equitydatascience.com', // your bucket name,
        Key: `${req.params.env}/${req.params.folder}/${req.params.filename}` // path to the object you're looking for
    }

    s3.headObject(params, function(err, data){
        if(err){
            res.send('File not found');
        } else {
            let fileStream = s3.getObject(params).createReadStream();
            fileStream.pipe(res);
        }
    });
});

app.get('/download/:env/:folder/:filename', middlewares.canAccess, (req, res) => {
    let params = {
        Bucket: 'files.equitydatascience.com', // your bucket name,
        Key: `${req.params.env}/${req.params.folder}/${req.params.filename}` // path to the object you're looking for
    }

    s3.getObject(params, function(err, data) {
        if (err === null) {
           res.attachment('Dashboard.pdf'); // file name
           res.send(data.Body);
        } else {
           res.status(500).send(err);
        }
    });
});

app.listen(app.get('port'), () => console.log(`Example app listening on port ${port}!`));