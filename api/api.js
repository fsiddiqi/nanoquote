

/*
 * GET /api/
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.getApi = function(req, res) {
	res.status(200);
	
	var randomNum = faker.random.uuid(); // 
	var curDate = moment().format('YYYY-MM-DD');
	var randomID = faker.random.uuid(); // 
	// set response body and send
	res.json({"ret": randomID});
};

/*
 * POST /api/quotes
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 */
exports.postApiQuotes = function(req, res) {
    state.quotes = state.quotes || [];
    theBody = req.body;
    // Generate a unique quote_id
    //theBody.quote_id = _.uniqueId();
    theBody.quote_id = faker.random.uuid(); // 
    theBody.quote_date = moment().format('YYYY-MM-DD');

    // Generate a fake premium
    theBody.premium = 100 +  Math.floor(Math.round(Math.random() * 26 * 100) / 100);
    
    // set response body and send
    state.quotes.push(theBody);
    return res.json({
        status: "ok",
        state: theBody
    });
};

/*
 * POST /api/quotes/prefill
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 */
exports.postApiPrefillQuotes = function(req, res) {
    state.quotes = state.quotes || [];
    reqBody = req.body;
    numFakes = req.body && req.body.num ? req.body.num : 1;
    theAdded = [];
    
    for(i=0; i<numFakes; i++) {
        theCard = faker.helpers.createCard();
        names = theCard.name.split(" ");
        theBody = {
          "first_name": names[0],
          "last_name": names[1],
          "email": theCard.email,
          "address": theCard.address,
          "job_title": faker.name.jobTitle(),
          "job_area": faker.name.jobArea(),
          "phone": faker.phone.phoneNumber(),
          "coverage": faker.random.number(),
          "effective_date": faker.date.future(), 
          "purpose": faker.random.word(3),
          "quote_id": faker.random.uuid(),
          "quote_date": moment().format('YYYY-MM-DD'),
          "premium": faker.finance.amount()
        };
    
        // set response body and send
        state.quotes.push(theBody);
        theAdded.push(theBody);
    }

    return res.json({
        status: "ok",
        state: theAdded
    });
};

/*
 * GET /api/quotes
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * first_name(type: string) - query parameter - quote category
 */
exports.getApiQuotes = function(req, res) {
    var quote;
    var firstName = req.query.first_name;
    var quoteDate = req.query.quote_date;
    var quoteID = req.query.quote_id;
    if(firstName) {
        quote = _.filter(state.quotes, {
            'first_name': firstName
        });
        //if(quote === undefined){
        //    throw({message: "Can't find " + firstName});
        //}
        quotes = quote;
    }
    else if(quoteDate) {
        quote = _.filter(state.quotes, {
            'quote_date': quoteDate
        });
        //if(quote === undefined){
        //    throw({message: "Can't find " + firstName});
        //}
        quotes = quote;
    }
    else if(quoteID) {
        quotes = _.filter(state.quotes, function(o) { 
            return o.quote_id.endsWith(quoteID); 
        });
    }
    else
    {
        quotes = state.quotes;
        
    }

    // set response body and send
    return res.json({
        status: "ok",
        state: quotes
    });

    //res.json(state.quotes);
};

/*
 * GET /api/quotes/{quote_id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * quote_id(type: integer) - path parameter - ID of quote to fetch
 */
exports.getApiQuotes2 = function(req, res) {
    req.check('quote_id', 'Invalid parameter').notEmpty();
    if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }

    // Find matching quote
    var quoteID = req.params.quote_id;
    var quote = _.find(state.quotes, {
        'quote_id': quoteID
    });
    if(quote === undefined){
        throw({message: "Can't find " + quoteID});
    }

    // set response body and send
    return res.json({
        status: "ok",
        state: quote
    });
};

/*
 * PATCH /api/quotes/{quote_id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * quote_id(type: integer) - path parameter - ID of quote to update
 */
exports.patchApiQuotes = function(req, res) {
	req.check('quote_id', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
    // Find matching quote
    var quoteID = req.params.quote_id;
    var quote = _.find(state.quotes, {'quote_id': quoteID});
    if(quote === undefined){
    	res.json({status: 404});
        //throw({message: "Can't find " + quoteID});
    }
    // update the quote object
    _.merge(quote, req.body);
    //quote = req.body;
	// set response body and send
	// BUGGY - FIX
	res.json({
        status: "ok",
        quote: quote
    });
};

/*
 * DELETE /api/quotes/{quote_id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * quote_id(type: integer) - path parameter - ID of quote to delete
 */
exports.deleteApiQuotes = function(req, res) {
	req.check('quote_id', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}

    // Find matching quote
    var quoteID = req.params.quote_id;
    var quote = _.find(state.quotes, {
        'quote_id': quoteID
    });
    if(quote === undefined){
    	res.json({status: 404});
        //throw({message: "Can't find " + quoteID});
    }
    state.quotes = _.without(state.quotes, quote);
    // set response body and send
	res.json({status: 200});
};
