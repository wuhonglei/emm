module.exports = function (query, body) {
    return {
        msg: 'This is a json file, you can use Mockjs or other package to generate data.',
        msg2: 'We can get the query and body from arguments!',
        query,
        body
    };
};