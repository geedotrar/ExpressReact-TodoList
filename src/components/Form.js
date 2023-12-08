import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiDeleteOutline } from "react-icons/ti";
import { FiEdit } from "react-icons/fi";

export default function FormTodo() {
  const [todo, setTodo] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [editTaskId, setEditTaskId] = useState(null);

  const getData = () => {
    fetch("http://localhost:3001/todos")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTodo(data);
      });
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (inputValue.item === "") {
      return;
    }

    const newTask = {
      item: inputValue,
    };

    try {
      const response = await fetch("http://localhost:3001/todos", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await getData();
        setInputValue("");
        toast.success("Task added successfully");
      } else {
        console.error("Error creating item:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating item:", error);
      toast.error("Error creating new Task");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await getData();
        toast.success("Task deleted successfully");
      } else {
        console.error("Error deleting item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting Task");
    }
  };

  const handleEditTask = (id) => {
    setEditTaskId(id);
    const taskToEdit = todo.find((task) => task.id === id);
    setInputValue(taskToEdit.item);
    console.log(taskToEdit.item);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const updatedTask = {
      item: inputValue,
    };
    try {
      const response = await fetch(`http://localhost:3001/todos/${editTaskId}`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const updatedTaskData = await response.json();
      setTodo((prevTasks) => prevTasks.map((task) => (task.id === editTaskId ? { ...task, item: updatedTaskData.item } : task)));
      setInputValue("");
      setEditTaskId(null);
      toast.success("Task updated successfully");
    } catch (error) {
      console.log("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  const handleDeleteAllTask = async () => {
    if (window.confirm("Delete All Task?")) {
      try {
        const response = await fetch(`http://localhost:3001/delete-todos`, {
          method: "DELETE",
        });

        if (response.ok) {
          await getData();
          toast.success("All Task deleted successfully");
        } else {
          console.error("Error deleting item:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Error deleting Task");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div>
        <h1 className="header">Todo List</h1>
        <form className="todo-form">
          <input value={inputValue} onChange={handleChange} className="todo-input" placeholder="Add Task" required />
          <button onClick={editTaskId ? handleUpdateTask : handleCreate} className="todo-button">
            {editTaskId ? "Update" : "Add"}{" "}
          </button>
        </form>

        {todo.map((result) => {
          return (
            <div className="todo-row">
              {result.item}
              <div>
                <FiEdit onClick={() => handleEditTask(result.id)} className="todo-button-update" size={30}></FiEdit>
                <TiDeleteOutline onClick={() => handleDelete(result.id)} className="todo-button-delete" size={40}></TiDeleteOutline>
              </div>
            </div>
          );
        })}

        {todo.length === 0 ? (
          <></>
        ) : (
          <button onClick={() => handleDeleteAllTask()} className="todo-button-deleteAll">
            Delete All Task
          </button>
        )}
        <div id="total-tasks">Total Tasks: {todo.length}</div>
      </div>
    </div>
  );
}
