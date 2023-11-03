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

router.get('/videos',
    check('part')
    .optional()
    .custom((value) => {
        if (Array.isArray(value)) {
        // Ensure each value in the array is valid
        for (const partValue of value) {
            if (!['id', 'snippet', 'contentDetails', 'statistics', 'status', 'player'].includes(partValue)) {
            throw new Error('Part parameter only accepts valid values');
            }
        }
        } else if (!['id', 'snippet', 'contentDetails', 'statistics', 'status', 'player'].includes(value)) {
        throw new Error('Part parameter only accepts valid values');
        }
        return true;
    }),
    check('chart')
    .custom((value, { req }) => {
        const { id, myRating } = req.query;

        if (!value && !id && !myRating) {
        throw new Error('At least one of chart, id, or myRating must be present');
        }

        if ((value && (id || myRating)) || (id && (value || myRating)) || (myRating && (value || id))) {
        throw new Error('Only one of chart, id, or myRating can be present');
        }

        return true;
    })
    .optional()
    .isIn(['mostPopular'])
    .withMessage('Chart filter must equal: "mostPopular"'),
        check('maxResults').optional().isInt({ min: 1, max: 50 }), // Validate 'maxResults' as an integer between 1 and 50
        check('regionCode')
    .optional()
    .custom((value, { req }) => {
        const { chart } = req.query;

        if (!chart && value) {
        throw new Error('regionCode can only be used in conjunction with the chart parameter');
        }

        return true;
    })
    .isString(),

    check('videoCategoryId')
    .optional()
    .custom((value, { req }) => {
        const { chart } = req.query;

        if (!chart && value) {
        throw new Error('videoCategoryId can only be used in conjunction with the chart parameter');
        }

        return true;
    })
    .isString(),
    check('id').optional().isString(), // Comma-separated list of video IDs
    check('myRating').optional().isIn(['like', 'dislike', 'none']), // myRating options
    check('onBehalfOfContentOwner').optional().isString(), // onBehalfOfContentOwner content owner ID
    check('maxHeight').optional().isInt({ min: 1 }), // Maximum video height
    check('maxWidth').optional().isInt({ min: 1 }), // Maximum video width
    check('forContentOwner').optional().isBoolean(), // Retrieve videos for content owners
    check('forDeveloper').optional().isBoolean(), // Retrieve videos for developers
    check('forMine').optional().isBoolean(), // Retrieve videos owned by the authenticated user
    check('relatedToVideoId').optional().isString(), // Related to a particular video by ID
     // Radius around the specified location
	async(req, res) => {
		try{
			// Check for validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // If validation is successful, access the validated parameters like this:
            const { key, part, chart, maxResults, regionCode,myRating,maxHeight,maxWidth,onBehalfOfContentOwner,videoCategoryId,} = req.query;

            

            // Parameters for the request
            const params = {
                key,
                part,
                chart,
                myRating,
                maxHeight,
                maxWidth,
                onBehalfOfContentOwner,
                videoCategoryId,
                maxResults,
                regionCode,
            };

            const videos = await new serviceController().getVideos(params);
            return res.status(200).json({result:videos});
            
		}catch(err){
			console.log(err);
			return res.status(500).json(err.message);
		}
	});

    module.exports = router;
