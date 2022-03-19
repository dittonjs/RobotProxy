import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Button } from '../common/button';
import { Api } from '../../utils/use_api';

export const Ping = () => {
  const [updates, setUpdates] = useState([]);
  const updatesRef = useRef([]);
  const [testMessage, setTestMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // instantiates a socket object and initiates the connection...
    // you probably want to make sure you are only doing this in one component at a time.
    const socket = io();
    setSocket(socket);

    // adds an event listener to the connection event
    socket.on('connect', () => {
      setSocket(socket);
    });

    // adds event listener to the disconnection event
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    // recieved a pong event from the server
    socket.on('unity-update', (data) => {
      updatesRef.current.push(data);
      setUpdates([...updatesRef.current]);
      console.log(updatesRef.current);
      console.log('Recieved data', data);
    });

    // IMPORTANT! Unregister from all events when the component unmounts and disconnect.
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('unity-message');
      socket.disconnect();
      updatesRef.current = [];
    };
  }, []);

  const sendMessage = () => {
    socket.emit('unity-update', testMessage);
  };

  const sendPostAndSeeWhatHappens = () => {
    const api = new Api();
    api.post('/unity-update', { data: testMessage });
  };

  return (
    <>
      <section>
        <div>
          <input className="border-2" value={testMessage} onChange={(e) => setTestMessage(e.target.value)}></input>
          <Button onClick={sendMessage}>Send</Button>
          <Button onClick={sendPostAndSeeWhatHappens}>Try POST</Button>
        </div>
        <div>
          {updates.map((update) => (
            <div key={update}>{update}</div>
          ))}
        </div>
      </section>
    </>
  );
};
