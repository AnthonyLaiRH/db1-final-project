const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
})

const getProperties = (request, response) => {
    pool.query('SELECT property.* FROM property ORDER BY property.maxPeople', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getPropertiesBelowPrice = (request, response) => {
    const max = parseInt(request.params.max)
    
    pool.query('SELECT users.firstName||\' \'|| users.lastName as HostName,'+
                    'propertyType, roomType, maxpeople, bathroom, bedroom, bedtype, availabilityDate.availableDate,'+
                    'property.houseNumber||\' \'||property.street||\', \'||property.city||\', \'||property.province as address '+
                    'FROM property ' +
                    'INNER JOIN price ON price.propertyId = property.propertyId ' +
                    'INNER JOIN availabilitydate ON property.propertyId = availabilitydate.propertyId '+
                    'INNER JOIN host ON host.hostid = property.hostid ' +
                    'INNER JOIN Users ON host.userId = users.userid ' +
                    'WHERE price.priceAmount <= $1 ' +
                    'ORDER BY price.priceAmount', [max],(error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getPropertiesByAvailability = (request, response) => {
    const date = parseInt(request.params.max)

    pool.query('SELECT users.firstName||\' \'||users.lastName as HostName, propertyType, roomType, maxpeople, ' +
                'bathroom, bedroom, bedtype, ' + 
                'property.houseNumber||\' \'||property.street||\', \'||property.city||\', \'||property.province as address ' + 
                'FROM property '  +
                'INNER JOIN availabilitydate ON property.propertyId = availabilitydate.propertyId ' +
                'INNER JOIN host ON host.hostid = property.hostid ' + 
                'INNER JOIN Users ON host.userId = users.userid ' + 
                'WHERE availabilitydate.availabledate = $1' , [date],(error, results) => {
    if (error) {
        throw error
    }
        response.status(200).json(results.rows)
    })
}

const addProperty = (request, response) => {
    const params = request.body
    console.log(request.body)
  
    var hostId = 1;
    var propertyType = params.propertyType ;
    var roomType = params.roomType;
    var maxPpl = params.maxPpl;
    var numBed = params.numBed;
    var numBath = params.numBath;
    var bedType = params.bedType;
    var houseNumber = params.houseNumber
    var city = params.city;
    var province = params.province;
    var street = params.street;

    var propertyId;

    var text = 'INSERT INTO property (hostId, propertyType, roomType, maxPeople, ' +
                  'bathroom, bedroom, bedtype, housenumber, city, province, street) ' +
                  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                  'RETURNING propertyId;'
    var values = [hostId, propertyType, roomType, maxPpl, numBath, numBed, bedType, houseNumber, city, province, street]

    pool.query(text, values, (error, results) => {
      if (error) {
        throw error
      }
      propertyId = results.rows[0].propertyid;
      insertPriceAndAmenities(propertyId, params.price, params.amenity1, params.amenity2, params.amenity3);
      response.status(201).send(`Added Property`)
    });
  }

  function insertPriceAndAmenities(propertyId, price, amenity1, amenity2, amenity3){
    console.log("hello!")
    console.log(propertyId)
    pool.query('INSERT INTO Price (propertyid, priceamount) ' +
                  'VALUES($1, $2);',
                  [propertyId, price], (error,result) =>{
      if (error) {
        throw error.status
      }
      //response.status(201).send(`Added Price`)                
    });
    
    console.log (amenity1);
    console.log(amenity2);
    console.log (amenity3);
    var text1 = 'INSERT INTO amenities (propertyid, amenityname) VALUES($1, $2);'
    var values1 = [propertyId, amenity1]
    pool.query(text1, values1,(error,result) => {
      if (error) {
        throw error
      }
      //response.status(201).send(`Added Amenity`)                
    });


    var text2 = 'INSERT INTO amenities (propertyid, amenityname) VALUES($1, $2);'
    var values2 = [propertyId, amenity2];
    pool.query(text2, values2, (error,result) =>{
      if (error) {
        throw error
      }
      //response.status(201).send(`Added Amenity`)                
    });

    var text3 = 'INSERT INTO amenities (propertyid, amenityname) VALUES($1, $2);'
    var values3 = [propertyId, amenity3]
    pool.query(text3, values3, (error,result) =>{
      if (error) {
        throw error
      }
      response.status(201).send(`Added Price and Three Amenities`)                
    });
  }

module.exports = {
    getProperties,
    getPropertiesBelowPrice, 
    getPropertiesByAvailability,
    addProperty,
}


/** 
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM authors WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const createUser = (request, response) => {
    const { name, email } = request.body
  
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${result.insertId}`)
    })
  }
  
  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }
  
  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  module.exports = {
    getProperties,
    getPropertiesBelowPrice,
    getPropertiesByAvailability,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }

  //https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
*/  
  
