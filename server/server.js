import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration,  OpenAIApi } from 'openai';


dotenv.config();


const configuration = new Configuration({
    apiKey : process.env.OPENAI_API_KEY,  //getting the api key 
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors()) //for cross origin requests
app.use(express.json()) //passing json from front-end to the back-end


// dummy route
app.get('/', async (req, res) => {
 
    res.status(200).send({
        msg: 'Hello from ASK AI',
    })

})

//getting data from the body 
app.post('/', async (req, res) => {

try {
    const prompt = req.body.prompt; //getting data from body
    const response = await openai.createCompletion({
     model:"text-davinci-003",
     prompt:`${prompt}`,
     temperature : 0,
     max_tokens: 2000,
     top_p: 1,
     frequency_penalty: 0.5,  //more likely to give different responses for the same qstn instead of repeating the same sentence
     presence_penalty: 0, 
    });

    res.status(200).send({
        bot : response.data.choices[0].text
    });
}catch(error){
  console.log(error)
  res.status(500).send(error || 'Something went wrong')
}

})

app.listen(5000, ()=> console.log("Server running on http://localhost:5000"));