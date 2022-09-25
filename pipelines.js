const pipelines = {
    testPipeline: [
        {
            "$match": {
                "operationType": "insert",
                "fullDocument.address.country": "Australia",
                "fullDocument.address.market": "Sydney"
            }
        }
    ],
    aggregationPipeline: function (country, market, maxNumberToPrint){
        return(
            [
                {
                  '$match': {
                    'bedrooms': 1, 
                    'address.country': country, 
                    'address.market': market, 
                    'address.suburb': {
                      '$exists': 1, 
                      '$ne': ''
                    }, 
                    'room_type': 'Entire home/apt'
                  }
                }, {
                  '$group': {
                    '_id': '$address.suburb', 
                    'averagePrice': {
                      '$avg': '$price'
                    }
                  }
                }, {
                  '$sort': {
                    'averagePrice': 1
                  }
                }, {
                  '$limit': maxNumberToPrint
                }
              ]
        )
    } 
}

module.exports = pipelines