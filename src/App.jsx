import { useState } from 'react'
import './App.css'

function App() {
  // 1. Initialize state with your data
  const [links, setLinks] = useState([
    { id: 1, link: "PRIMERO", likes: 1 },
    { id: 2, link: "SEGUNDO", likes: 4 },
    { id: 3, link: "TERCERO", likes: 6 }
  ]);

  // 2. The update function
  const handleVote = (id, change) => {
    setLinks(prevLinks => 
      prevLinks.map(item => 
        item.id === id 
          ? { ...item, likes: item.likes + change } 
          : item
      )
    );
  };

  // 3. Sort the data (Highest likes first)
  const sortedLinks = [...links].sort((a, b) => b.likes - a.likes);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ranked Links</h2>
      <ul style={{ listStyle: 'none' }}>
        {sortedLinks.map((item) => (
          <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
            <span>{item.link} — <strong>{item.likes} likes</strong></span>
            <div style={{ margin: '5px 0' }}>
              <button onClick={() => handleVote(item.id, 1)}>Like</button>
              <button onClick={() => handleVote(item.id, -1)}>Dislike</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App
