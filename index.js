const { default: axios } = require('axios');

const app = require('express')();
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

app.get('/temperature',async(req, res)=>{
    const city = req.query.city;
    const days = req.query.days;
    const data =await weatherApi(city, days);
    if(!data){
        res.json({
            code: 404,
            message: 'City not found',
            data:''
        });
        return;
    }
    res.json(
       { code :200,
        message: 'Success',
        data: {
            city: data.location.name,
            country: data.location.country,
            region: data.location.region,
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
        }
    }
    )

});

const weatherApi =  async (city, days)=>{
    const options = {
        method: "GET",
        url: process.env.URL,
        params: { q:city, days },
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.HOST,
        },
      };
    
      try {
        const response = await axios.request(options);
        return response.data;
      } catch (error) {
        // console.log(error)
        return null;
      }
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    });
