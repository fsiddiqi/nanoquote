/*
 * GET /api/
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.getApi = function (req, res) {
    res.status(200);

    // set response body and send
    res.json({});
};

/*
 * POST /api/quotes
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 */
exports.postApiQuotes = function (req, res) {
    state.quotes = state.quotes || [];
    theBody = req.body;
    // Generate a unique quote_id
    theBody.quote_id = _.uniqueId();
    // set response body and send
    state.quotes.push(theBody);
    return res.json({
        status: "ok",
        state: theBody
    });
};

/*
 * GET /api/quotes
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * category(type: string) - query parameter - quote category
 */
exports.getApiQuotes = function (req, res) {
    // set response body and send
    res.json({
        status: "ok",
        quotes: state.quotes
    });
};

/*
 * GET /api/quotes/{quote_id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * quote_id(type: integer) - path parameter - ID of quote to fetch
 */
exports.getApiQuotes2 = function (req, res) {
    req.check('quote_id', 'Invalid parameter').notEmpty();
    if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }

    // Find matching quote
    var quoteID = req.params.quote_id;
    var quote = _.find(state.quotes, {
        'quote_id': quoteID
    });
    if (quote === undefined) {
        throw ({
            message: "Can't find " + quoteID
        });
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
exports.patchApiQuotes = function (req, res) {
    req.check('quote_id', 'Invalid parameter').notEmpty();
    if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }
    // Find matching quote
    var quoteID = req.params.quote_id;
    var quote = _.find(state.quotes, {
        'quote_id': quoteID
    });
    if (quote === undefined) {
        res.json({
            status: 404
        });
        //throw({message: "Can't find " + quoteID});
    }
    quote = req.body;
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
exports.deleteApiQuotes = function (req, res) {
    req.check('quote_id', 'Invalid parameter').notEmpty();
    if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }

    // Find matching quote
    var quoteID = req.params.quote_id;
    var quote = _.find(state.quotes, {
        'quote_id': quoteID
    });
    if (quote === undefined) {
        res.json({
            status: 404
        });
        //throw({message: "Can't find " + quoteID});
    }
    state.quotes = _.without(state.quotes, quote);
    // set response body and send
    res.json({
        status: 200
    });
};
