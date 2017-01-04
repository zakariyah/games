var mongoose = require('mongoose');
  var postQuizSurveySchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String }
, cummulativeScore: String
, numberOfRounds: String
, accessSkills: String,
enjoy: String,
familiarity: String
, risk: String,
cooperative: String,
forgiving: String,
predictable: String,
vengeful: String,
selfish: String,
cooperative1: String,
forgiving1: String,
predictable1: String,
vengeful1: String,
selfish1: String,
thought: String,
preference: String,
reason1:String,
reason2:String,
peoplebullied:String,
peoplegullible:String,
peopleforgiving:String,
peopleautonomous:String,
peopleselfish:String,
peopledevious:String,
peoplecooperative:String
});

postQuizSurveySchema.statics.createPostQuiz = function(information) {

    var newPostQuizSurvey = new this({
       playerid: information.playerid,
       gameid: information.gameid,
       cummulativeScore: information.cummulativeScore
, numberOfRounds: information.numberOfRounds
, accessSkills: information.accessSkills,
enjoy: information.enjoy,
familiarity: information.familiarity
, risk: information.risk,
cooperative: information.cooperative,
forgiving: information.forgiving,
predictable: information.predictable,
vengeful: information.vengeful,
selfish: information.selfish,
   		 cooperative1: information.cooperative1
, forgiving1: information.forgiving1
, predictable1: information.predictable1,
vengeful1: information.vengeful1,
selfish1: information.selfish1
, thought: information.thought,
preference: information.preference,
reason1:information.reason1,
reason2:information.reason2,
peoplebullied:information.peoplebullied,
peoplegullible:information.peoplegullible,
peopleforgiving:information.peopleforgiving,
peopleautonomous:information.peopleautonomous,
peopleselfish:information.peopleselfish,
peopledevious:information.peopleselfish,
peoplecooperative:information.peoplecooperative
    });

    newPostQuizSurvey.save(function(err) {
        if (err)
            throw new Error('Could not create move');
        // callback(err, g);
    })
}

var postquizsurvey = mongoose.model('postquizsurvey',postQuizSurveySchema);
module.exports = postquizsurvey;
