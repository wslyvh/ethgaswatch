exports.handler = async function(event, context, callback) {

    const response = await fetch(`https://www.gasnow.org/api/v1/gas/price`);
    console.log(response);
    const body = await response.json();

    callback(null, { statusCode: 200, body: body });
}