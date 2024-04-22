import "./App.css";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  // Switch,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuid } from "uuid";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// const label = { inputProps: { "aria-label": "Switch demo" } };

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function App() {
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState("");
  const [todoData, setTodoData] = useState([]);
  const [editTodo, setEditTodo] = useState({});
  const [editTodoId, setEditTodoId] = useState("");

  const handleTodoChange = (event) => {
    setTodo(event.target.value);
  };

  const handleAddTodo = () => {
    const payload = {
      id: uuid(),
      todo: todo,
      status: false,
    };

    axios
      .post("https://json-mock-server-f54i.onrender.com/todos", payload)
      .then((response) => {
        console.log(response, "response");
        getTodos();
      })
      .catch((error) => {
        console.log(error, "error");
      });
    setTodo("");
  };

  const getTodos = () => {
    axios
      .get("https://json-mock-server-f54i.onrender.com/todos")
      .then((response) => {
        setTodoData(response.data);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const deleteTodo = (id) => {
    axios
      .delete(`https://json-mock-server-f54i.onrender.com/todos/${id}`)
      .then(() => {
        console.log("Deleted ID: " + id);
        getTodos();
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const handleEditTodo = (id) => {
    const todo = todoData.find((item) => item.id === id);
    setEditTodo(todo);
    setEditTodoId(id);
    setOpen(true);
  };

  const handleUpdateTodo = () => {
    axios
      .put(
        `https://json-mock-server-f54i.onrender.com/todos/${editTodoId}`,
        editTodo
      )
      .then(() => {
        console.log("Updated ID: " + editTodoId);
        handleClose();
        getTodos();
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const handleClose = () => setOpen(false);

  const handleToggle = (id) => {
    const toggledTodo = todoData.find((todo) => todo.id === id);
    toggledTodo.status = !toggledTodo.status;

    axios.put(
      `https://json-mock-server-f54i.onrender.com/todos/${id}`,
      toggledTodo
    );
    getTodos();
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <Typography mb={3} variant="h2" component="h2">
        My Todo App
      </Typography>
      <Box mb={3}>
        <TextField
          id="outlined-basic"
          size="small"
          label="Add Todo"
          variant="outlined"
          value={todo}
          onChange={handleTodoChange}
        />
        <Button
          sx={{ marginLeft: "15px" }}
          id="todo_btn"
          variant="contained"
          onClick={handleAddTodo}
        >
          Add Todo
        </Button>
      </Box>
      <Box className="todos_box">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Todos</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Edit Todo</StyledTableCell>
                <StyledTableCell align="center">Delete Todo</StyledTableCell>
                <StyledTableCell align="center">Toggle Todo</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todoData[0] &&
                todoData.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">
                      <Typography
                        className={row.status ? "lineTh" : "simple"}
                        component="h2"
                        variant="h6"
                      >
                        {row.todo}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography component="h2" variant="h6">
                        {todo.status ? "Done" : "Pending"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <EditIcon
                        onClick={() => handleEditTodo(row.id)}
                        className="editIcon"
                        fontSize="large"
                        sx={{ color: "darkgreen" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <DeleteIcon
                        className="deleteIcon"
                        onClick={() => deleteTodo(row.id)}
                        fontSize="large"
                        sx={{ color: "red" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {/* <Switch
                        {...label}
                        checked={row.status}
                        onChange={() => handleToggle(row.id)}
                      /> */}
                      <Button
                        onClick={() => handleToggle(row.id)}
                        variant="contained"
                        color="success"
                      >
                        Toggle
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                mb={3}
                variant="h3"
                component="h2"
              >
                Edit Todo
              </Typography>
              <TextField
                id="outlined-basic"
                label="Todo"
                variant="outlined"
                size="small"
                sx={{ marginTop: "15px" }}
                value={editTodo.todo || ""}
                onChange={(e) =>
                  setEditTodo({ ...editTodo, todo: e.target.value })
                }
              />
              <Button
                variant="contained"
                onClick={handleUpdateTodo}
                sx={{ marginTop: "15px", marginLeft: "15px" }}
              >
                Update Todo
              </Button>
            </Box>
          </Modal>
        </div>
      </Box>
    </div>
  );
}

export default App;
