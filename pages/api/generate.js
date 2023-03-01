var sql = require('msnodesqlv8');
import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const dbConfiguration = {
  server: "DESKTOP-6T987U5//SQLEXPRESS",
  database: 'CustomerDB',
  driver: 'msnodesqlv8',
  options:{
    trustedConnection:true
  }
}

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const query = req.body.query || '';
  if (query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please add a valid requirement!",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generatePrompt(query),
      temperature: 0.2,
      max_tokens:250,
    });
    var resquery = completion.data.choices[0].text;
    var connectionstring = 'Server=DESKTOP-6T987U5;Database=CustomerDB;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}';
    var response = sql.query(connectionstring, resquery, (err, rows)=>{
      if(err){
        console.error(err);
      } 
      console.log(resquery);
      console.log(rows);
      res.status(200).json({query:resquery.trim(), data:rows});
    });    
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(query) {

  return `We have a customer database in MS SQL SERVER 15.0 with tables customers orders and products.
  customers table has columns: customer_id(Primary Key), FirstName(varchar), LastName(varchar), Email(varchar)
  products table has columns: Product_Id(Primary Key), name(varchar, not null), price(int, not null), quantity(int, not null), costprice(int, default=0)
  orders table has columns: order_id(primary key), product_id(foreign key references products using product_id), customer_id(foreign key references customers using customer_id), quantity(int), order_date(date)
  Suggest a MSSQL query for the operation: ${query}
  `;
}
