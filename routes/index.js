var express = require('express');	
var router = express.Router();
var saveInformation = require('../controller/informationStore');
var savePayment = require('../controller/paymentStore');
var savePostQuiz = require('../controller/postquizStore');
var saveHiitNumber = require('../controller/hiitNumberStore');
var entryVerifier = require('../controller/entryVerifier');
var calculatePayment = require('../controller/calculatePayment');
global.pageCount = 0;

numberOfTimes = 0;

router.get('/', function(req, res) {
  	res.render('index', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50
,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});
});


router.post('/entry', function(req, res) {
	var hiit = req.session.hiitNumber;
	if(typeof hiit === 'undefined')
	{
		res.render('information', { title: 'Entry', playerIsPresent : 'you are not known'});	
		return;
	}
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	entryVerifier(req, res, 'information', 'entryGUI', hiit);
});

router.get('/information', function(req, res) {
  	res.render('information', { title: 'Entry', playerIsPresent : ''});
});

router.get('/testing', function(req, res) {
  	res.render('test', { title: 'Test', playerIsPresent : ''});
});

router.post('/postquizsurvey', function(req, res) {
	req.body.playerid = req.session.hiitNumber;
	console.log("session is: " + req.body.playerid);
	savePostQuiz(req);	
	savePayment(req);
	calculatePayment(req, res);
});

router.get('/quiz', function(req, res) {
  res.render('quiz', {title: 'Express', numbero: numberOfTimes });
});

router.post('/question', function(req, res) {
	saveInformation(req);
  	res.render('question', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50
,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});
});

router.post('/tutorial', function(req, res) {
	var hiit = req.session.hiitNumber;
	if(!(typeof hiit === 'undefined'))
	{
		res.render('information', { title: 'Entry', playerIsPresent : 'There seem to be a game on in this browser. If not, try closing the browser'});	
		return;
	}
	// res.render('tutorial', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});		
	saveHiitNumber(req, res, 'information', 'tutor');
});

// second game
router.get('/main', function(req, res) {
  	res.render('indexMain', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50
,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});
});


router.post('/entryMain', function(req, res) {
	var hiit = req.session.hiitNumber;
	if(typeof hiit === 'undefined')
	{
		res.render('informationMain', { title: 'Entry', playerIsPresent : 'you are not known'});	
		return;
	}
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	entryVerifier(req, res, 'informationMain', 'entry', hiit);
});

router.get('/informationMain', function(req, res) {
  	res.render('informationMain', { title: 'Entry', playerIsPresent : ''});
});


router.post('/postquizsurveyMain', function(req, res) {
	req.body.playerid = req.session.hiitNumber;
	console.log("session is: " + req.body.playerid);
	savePostQuiz(req);	
	savePayment(req);
	calculatePayment(req, res)	;
});

router.get('/quiz', function(req, res) {
  res.render('quiz', {title: 'Express', numbero: numberOfTimes });
});

router.post('/question', function(req, res) {
	saveInformation(req);
  	res.render('question', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50
,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});
});

router.post('/tutorialMain', function(req, res) {
	var hiit = req.session.hiitNumber;
	if(!(typeof hiit === 'undefined'))
	{
		res.render('informationMain', { title: 'Entry', playerIsPresent : 'There seem to be a game on in this browser. If not, try closing the browser'});	
		return;
	}
	// res.render('tutorial', { title: 'Entry', minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000});		
	saveHiitNumber(req, res, 'informationMain', 'tutorMain');
});


module.exports = router;