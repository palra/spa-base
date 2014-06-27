module.exports = (req, res, count) ->
	byPage = req.param('byPage') or 10
	page = req.param('page') or 1
	nbPages = Math.ceil count / byPage
	if(page > nbPages)
		page = 1;
	offset = (page - 1) * byPage
	limit =  byPage

	res.db =
		count: count
		nbPages: nbPages
		byPage: byPage
		page: page
		offset: offset
		limit: limit

	return