const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware

app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM todo ORDER BY id ASC`);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create a todo

app.post("/todos", async (req, res) => {
  try {
    const { item } = req.body;
    const newTodo = await pool.query("INSERT INTO todo (item) VALUES($1) RETURNING *", [item]);

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { item } = req.body;
    await pool.query("UPDATE todo SET item = $1 WHERE id = $2", [item, id]);

    res.send({
      id: id,
      item: item,
    });
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", (req, res) => {
  try {
    const { id } = req.params;
    pool.query("DELETE from todo where id = $1 ", [id]);
    res.send(`id ${id} was delete`);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/delete-todos", (req, res) => {
  const query = "DELETE FROM todo"; // Change 'items' to your table name
  pool
    .query(query)
    .then(() => {
      res.send("All records deleted.");
    })
    .catch((err) => {
      console.error("Error deleting records:", err);
      res.status(500).send("Error deleting records.");
    });
});

app.listen(3001, () => {
  console.log("server has started on port 3001");
});
