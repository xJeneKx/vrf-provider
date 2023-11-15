const { getAuthors, getMessages, getMyAddress } = require('./dbService');
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
	
	const { payment, data } = await getMessages(unit);
	if (!payment || payment < min_payment) {
		return errorResponse(`payment < min_payment: ${payment} < ${min_payment}`);
	}
	
	if (!data) {
		return errorResponse(`Data not found`);
	}
	
	try {
		const d = JSON.parse(data);
		if (!d.id) {
			return errorResponse(`Data error: id not found`);
		}
		
		return {
			id: d.id,
			address: authors[0],
		}
	} catch (e) {
		return errorResponse('data error: ' + e);
	}
}

module.exports = {
	prepareUnit,
}