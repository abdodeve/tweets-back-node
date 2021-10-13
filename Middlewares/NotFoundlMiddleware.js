/**
 * Show error in json format instead HTML/TEXT
 */
module.exports =  function(req, res){
        res.status(404).json({ error: 'Not Found'});
}
