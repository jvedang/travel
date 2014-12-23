
/*
 * GET home page.
 */

exports.index = function(req, res){
	
  res.render('homePage', {categories : null, title: 'Express' });
};