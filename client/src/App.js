import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const source = new EventSource('http://localhost:5000/send-notification');
    source.onopen = () => {
      console.log('connection open');
    };
    source.onerror = (err) => {
      console.log('error occured ', err.stack);
      source.close();
    };
    source.onmessage = ({ data }) => {
      const msg = data;
      console.log(msg);
      setMessages((prev) => [...prev, data]);
    };
    return () => {
      source.close();
    };
  }, []);

  return <div className="App">List of messages {messages.length}</div>;
}

export default App;
