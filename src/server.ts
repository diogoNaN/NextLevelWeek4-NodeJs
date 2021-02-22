import express from 'express';

const app = express();

app.get('/', (req, res) => {
  return res.json({
    message: "Hello NLW4",
  });
});

app.post('/', (req, res) => {
  const { name, age } = req.body;
  return res.json({
    message: `Hello ${name}`,
    data: {
      name,
      age,
    }
  });
});

app.listen(3333, () => {
  console.log("Server is running");
});