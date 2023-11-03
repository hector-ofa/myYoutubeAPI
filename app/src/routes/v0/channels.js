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

router.get('/channels', [
    check('part')
        .optional()
        .custom((value) => {
            if (Array.isArray(value)) {
                // Ensure each value in the array is valid
                for (const partValue of value) {
                    if (!['auditDetails', 'brandingSettings', 'contentDetails', 'contentOwnerDetails', 'id', 'localizations', 'snippet', 'statistics', 'status', 'topicDetails'].includes(partValue)) {
                        throw new Error('Part parameter only accepts valid values');
                    }
                }
            } else if (!['auditDetails', 'brandingSettings', 'contentDetails', 'contentOwnerDetails', 'id', 'localizations', 'snippet', 'statistics', 'status', 'topicDetails'].includes(value)) {
                throw new Error('Part parameter only accepts valid values');
            }
            return true;
        }),
    check('forUsername').optional().isString(),
    check('id').optional().isString(),
    check('managedByMe').optional().isBoolean(),
    check('mine').optional().isBoolean(),
    check('hl').optional().isString(),
    check('maxResults').optional().isInt({ min: 1, max: 50 }),
    check('onBehalfOfContentOwner').optional().isString(),
    check('pageToken').optional().isString(),
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // If validation is successful, access the validated parameters like this:
        const { part, forUsername, id, managedByMe, mine, hl, maxResults, onBehalfOfContentOwner, pageToken } = req.query;

        // Parameters for the request
        const params = {
            part,
            forUsername,
            id,
            managedByMe,
            mine,
            hl,
            maxResults,
            onBehalfOfContentOwner,
            pageToken,
        };

        const channels = await new serviceController().getChannels(params);
        return res.status(200).json({result:channels});

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

    module.exports = router;
