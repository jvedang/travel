var ejs = require("ejs");
var mysql = require('./my_sql');
var home = require('./home');

exports.signUpRedirect = function(req,res) {

	ejs.renderFile('./views/signUp.ejs',function(err, result)
			{
		if (!err) 
		{
			res.end(result);
		}
		else
		{
			res.end('An error occurred');
			console.log(err);
		}
			});
};

exports.pinLocation = function(req,res) {


	var getCountries = "SELECT country_id,country_name,country_date_added FROM traveldb.country;";
	console.log("Query for getCategories :: "+getCountries);

	mysql.fetchData(function(err, results)
			{
		if (err) 
		{
			throw err;
		} 
		else
		{
			if (results.length > 0) 
			{
				for ( var i = 0; i < results.length; i++) 
				{
					console.log(results[i].country_name);
				}

				res.render('pinLocation',{countries : results,status:""});
			}
		}
			}, getCountries);
};

exports.createPin = function(req,res) {

	var TABLE_NAME = "pins";
	var latitude = req.param("latitude");
	var longitude = req.param("longitude");
	var country = req.param("country");
	var address = req.param("address");
	var locationName = req.param("locationName");
	var rating = req.param("rating");
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " @ "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();

	console.log(latitude+","+longitude+","+country+","+address+","+locationName+","+rating);

	var createPinQuery = "insert into "+TABLE_NAME+"(location_name,location_address,location_country,location_latitude,location_longitude,location_rating,location_created_date) " +
	"values" +
	"('"+locationName+"','"+address+"','"+country+"','"+latitude+"','"+longitude+"',"+rating+",'"+datetime+"');";

	console.log("Query is : "+createPinQuery);

	mysql.insertData(function(err,results){
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results.affectedRows > 0)
			{
				var response = {
						status  : 200,
						success : 'Updated Successfully'
				};

				console.log("------------------------");
				console.log("Location Pinned");
				console.log("------------------------");
				
				console.log("------------------------");
				console.log(req);
				console.log(res);
				console.log("------------------------");

				home.getPins(req,res);
				
			}
			else
			{    
				console.log("Location Cannot be Pinned");
				res.render('homePage',{status:"Account Not Created, Please try again"});
			}
		}  
	},createPinQuery);
};

exports.getPins = function(req,res)
{
	var offset = req.param("offset");
	var TABLE_NAME = "pins";
	var getPins = "select location_id,location_name,location_address,location_latitude," +
			"location_longitude,location_rating,location_created_date,location_country from pins limit 10 offset "+offset+";";
	
	console.log("Query for getPins :: "+getPins);
	
	mysql.fetchData(function(err, results)
	{
		if(err) 
		{
			throw err;
		} 
		else
		{
			if (results.length > 0) 
			{
				for ( var i = 0; i < results.length; i++) 
				{
					console.log(results[i].location_name);
				}
				
				var response = {
					    status  : 200,
					    categories : results
					};
			
				console.log(JSON.stringify(response));
				res.send(JSON.stringify(response));
			}
			else
			{
				
			}
		
		}
	}, getPins);
};