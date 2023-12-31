const { getAuthors, isValidPayment, getMyAddress } = require('./dbService');
const { min_payment } = require("../conf");
const { isAA } = require("./ocoreService");


function errorResponse(error) {
	console.log(error)
	return { error };
}

async function prepareUnit(unit) {
	const myAddress = await getMyAddress();
	const authors = await getAuthors(unit);
	
	if (authors.includes(myAddress)) return { change: true };
	
	if (authors.length > 1) {
		return errorResponse('addresses greater than 1');
	}
	
	if (!(await isAA(authors[0]))) {
		return errorResponse('supported only AA');
	}
	
	if (!(await isValidPayment(unit))) {
		return errorResponse('payment not valid');
	}
	
	try {
		return {
			address: authors[0],
		}
	} catch (e) {
		return errorResponse('data error: ' + e);
	}
}

module.exports = {
	prepareUnit,
}