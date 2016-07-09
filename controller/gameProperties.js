var gameProperties = {} // type is normal or testing 
gameProperties.gameId = "realGame3";
// gameProperties.gameMatrix = [[-2, 5], [0, 0]];  // payoff showing what user got from himself then game
gameProperties.gameMatrixIsSymmetrical = true;
gameProperties.type = 'PD';
// gameProperties.pdGameMatrix = [['A', 'B', 0, 5], ['B', 'A', 5, 0], ['A', 'A', 3, 3], ['B', 'B', 1, 1]];
// for new game.
gameProperties.pdGameMatrix = [['A', 'A', 3, 3], ['A', 'B', 0, 5], ['B', 'A', 5, 0], ['B', 'B', 1, 1]];
gameProperties.gameTypes  =    [ //'normal']; 
// 'randomRecommenders', 
 // 'realRecommenders'
'oneRealRecommender' 
//,'oneRandomRecommender'
];

module.exports = gameProperties;

// Make the values bolder
// Sync the actions with its row
// Remove the click to accept
// Circle the display on the main page

// Increase the size of the display page