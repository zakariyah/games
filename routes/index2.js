var express = require('express');	
var router = express.Router();
var saveInformation = require('../controller/informationStore');
global.pageCount = 0;

//var io = require('socket.io');
numberOfTimes = 0;
// numberOfTimes  = io.sockets.manager.connected;
/* GET home page. */
router.get('/', function(req, res) {
	// if(req.session.userid == 'ade')
	// {
	// 	res.render('alreadyin');
	// 	return;
	// }
	// req.session.userid = 'ade';
  	res.render('index', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50
,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});
});


router.post('/entry', function(req, res) {
	pageCount ++;
	var hiitNumber = req.body.id;
	saveInformation(req);
//	req.session.userid = req.body.id;
//	var userid = req.session.userid;
	res.render('entry', {title: 'Express', numbero: 'new' });
});

router.get('/information', function(req, res) {
  	res.render('information', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, 
  				currency:'AED', reward : 50, maxbonus :20, playingtimes : 10, 
  				numPlayers : 6, waitingRoomTime : 30000});
});


router.get('/postquizsurvey', function(req, res) {
  res.render('postquizsurvey', {title: 'Express'});
});

router.get('/quiz', function(req, res) {
  res.render('quiz', {title: 'Express', numbero: numberOfTimes });
});

router.post('/question', function(req, res) {
	req.session.userid = req.body.id;
	console.log('user id is ' + req.body.id);
	saveInformation(req);
	// console.log(req.params);
  	res.render('question', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50
,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});
});

module.exports = router;
