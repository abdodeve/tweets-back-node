/**
 * Show error in json format instead HTML/TEXT
 */
module.exports =    function (err, req, res, next) {
                        console.log(err);
                        res.status(500).json({error: true, "message": err.message, "stack": err.stack});
                    }
