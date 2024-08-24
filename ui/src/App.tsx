import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://www.localhost:3000/api/todoapp/GetNotes"
        );
        setNotes(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  const refreshNotes = async () => {
    try {
      const response = await axios.get(
        "http://www.localhost:3000/api/todoapp/GetNotes"
      );
      setNotes(response.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteClick = async (id: number) => {
    try {
      await axios.delete(
        `http://www.localhost:3000/api/todoapp/DeleteNotes?id=` + id
      );
      refreshNotes();
    } catch (err) {
      setError(true);
    }
  };

  const addClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());


    try {
      await axios.post(
        "http://www.localhost:3000/api/todoapp/AddNotes",
        {
          description: data.newNote,
        }
      );
      refreshNotes();
    } catch (err) {
      setError(true);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="App">
      <h2>Todo App</h2>
      <form onSubmit={addClick}>
        <input name="newNote" />
        &nbsp;
        <button type="submit">Add Notes</button>
      </form>
      {notes &&
        notes?.length > 0 &&
        notes?.map((note: any) => (
          <p key={note.id}>
            <b>* {note.description}</b>&nbsp;
            <button onClick={() => deleteClick(note.id)}>Delete Notes</button>
          </p>
        ))}
    </div>
  );
}

export default App;
