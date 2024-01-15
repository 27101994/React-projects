import React, { useState, useEffect } from "react";
import { todoRef } from "../firebase"; // Import todoRef from firebase

import { ref, push, onValue, update, remove } from "firebase/database";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDescription, setEditedDescription] = useState(""); // New state for edited description

  useEffect(() => {
    const fetchData = () => {
      const todosRef = ref(todoRef, "todos"); // Use todoRef instead of db
      onValue(todosRef, (firedata) => {
        const data = firedata.val();
        if (data) {
          const todoList = Object.keys(data).map((id) => ({ id, ...data[id] }));
          setTodos(todoList);
        } else {
          setTodos([]);
        }
      });
    };

    fetchData();
  }, []);

  const addTodo = () => {
    if (task.trim() !== "") {
      const newTodoRef = push(ref(todoRef, "todos"), {
        task,
        description,
        completed: false,
      }); // Use todoRef instead of db
      setTodos([
        ...todos,
        { id: newTodoRef.key, task, description, completed: false },
      ]);
      setTask("");
      setDescription("");
    }
  };


  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);

    remove(ref(todoRef, `todos/${id}`)); // Use todoRef instead of db
    setTodos(filteredTodos);
  };

  const startEditingTodo = (id, task, description) => {
    setEditingTodoId(id);
    setEditedTask(task);
    setEditedDescription(description);
  };

  const saveEditedTodo = () => {
    update(ref(todoRef, `todos/${editingTodoId}`), {
      task: editedTask,
      description: editedDescription,
    }); // Use todoRef instead of db
    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodoId
        ? { ...todo, task: editedTask, description: editedDescription }
        : todo
    );
    setTodos(updatedTodos);
    setEditingTodoId(null);
    setEditedTask("");
    setEditedDescription("");
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditedTask("");
    setEditedDescription("");
  };

  return (
    <div>
      <h1>ToDo List</h1>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Task"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button className="btn-primary" onClick={addTodo}>Add</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={todo.id}>
              <td>{index + 1}</td>
              <td>
                {editingTodoId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                    />
                  </>
                ) : (
                  <span>{todo.task}</span>
                )}
              </td>
              <td>
                {editingTodoId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editedDescription}
                      onChange={(e) =>
                        setEditedDescription(e.target.value)
                      }
                    />
                  </>
                ) : (
                  <span>{todo.description}</span>
                )}
              </td>
              <td>
                {editingTodoId === todo.id ? (
                  <>
                    <button
                      onClick={saveEditedTodo}
                      className="btn btn-success"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn btn-secondary ms-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        startEditingTodo(todo.id, todo.task, todo.description)
                      }
                      className="btn btn-warning me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Todo;
