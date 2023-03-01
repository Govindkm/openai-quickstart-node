import Table from "./table";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [queryInput, setQueryInput] = useState("");
  const [result, setResult] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [bodyData, setBodyData] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data);

      setHeaderData(Object.keys(data.data[0]));
      setBodyData(data.data);
      console.log(headerData);
      console.log(bodyData);
      setQueryInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>GPT3 SQL Query Tool</title>
        <link rel="icon" href="/sql-server.png" />
      </Head>

      <main className={styles.main}>
        <img src="/sql-server.png" className={styles.icon} />
        <h3>GPT3 SQL Query Tool</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Enter your requirement here!"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
          <input type="submit" value="Fetch Data" />
        </form>
        <div>
          <h2>Database Details</h2>
          <div><h5>Customers:</h5><p>customers table has columns: customer_id(Primary Key), FirstName(varchar), LastName(varchar), Email(varchar)</p></div>
          <div><h5>Products:</h5><p>products table has columns: Product_Id(Primary Key), name(varchar, not null), price(int, not null), quantity(int, not null), costprice(int, default=0)</p></div>
          <div><h5>Orders:</h5><p>orders table has columns: order_id(primary key), product_id(foreign key references products using product_id), customer_id(foreign key references customers using customer_id), quantity(int), order_date(date)</p></div>
        </div>
        <h4>Query Generated: {result && result?.query}</h4>
        {headerData&&bodyData&&<Table theadData={headerData} tbodyData={bodyData}></Table>}
      </main>
    </div>
  );
}
