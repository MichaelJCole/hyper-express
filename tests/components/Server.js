const { HyperExpress } = require('../configuration.js');
const { log } = require('../scripts/operators.js');

// Create a test HyperExpress instance
const TEST_SERVER = new HyperExpress.Server({
    fast_buffers: true,
    max_body_length: 1000 * 1000 * 7,
});

// Bind error handler for catch-all logging
TEST_SERVER.set_error_handler((request, response, error) => {
    // Handle expected errors with their appropriate callbacks
    if (typeof request.expected_error == 'function') return request.expected_error();

    // Treat as global error and log to console
    log(
        'UNCAUGHT_ERROR_REQUEST',
        `${request.method} | ${request.url}\n ${JSON.stringify(request.headers, null, 2)}`
    );
    console.log(error);
    return response.send('Uncaught Error Occured');
});

// Bind not found handler for unexpected incoming requests
TEST_SERVER.set_not_found_handler((request, response) => {
    log(
        'NOT_FOUND_REQUEST',
        `${request.method} | ${request.url}\n ${JSON.stringify(request.headers, null, 2)}`
    );
    return response.status(404).send('Not Found');
});

module.exports = {
    TEST_SERVER,
};
