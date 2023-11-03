const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/service');
const {check, validationResult} = require('express-validator');
const config = require('../../config/config');

async function setErrorMessage(validation){
	let errors = validation.errors;
	let result = [];
	for(let i = 0; i < errors.length; i++){
		result.push(`${errors[i].msg}`);
	}
	return {error:result};
}

router.get('/subscriptions',
    check('part').isString(), // Validate 'part' is a string
    check('chart').isIn(['mostPopular']), // Validate 'chart' matches an allowed value
    check('maxResults').isInt({ min: 1, max: 50 }), // Validate 'maxResults' as an integer between 1 and 50
    check('regionCode').isString(), // Validate 'regionCode' is a string
	async(req, res) => {
		try{
			// Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // If validation is successful, access the validated parameters like this:
            const { key, part, chart, maxResults, regionCode } = req.query;

            // Parameters for the request
            const params = {
                key,
                part,
                chart,
                maxResults,
                regionCode,
            };

            const videos = await new serviceController().getVideos(params);
            console.log('Videos:', videos)
            return res.status(200).json({result:videos});
            
		}catch(err){
			console.log(err);
			return res.status(500).json(err.message);
		}
	});

    module.exports = router;
