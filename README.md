# QCall React

__Install QCall__
With __npm__   <img src="https://static.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png" width="20"/>
```javascript
 npm install qcall-react
```
With __yarn__ <img src="https://yarnpkg.com/favicon-32x32.png?v=6143f50112ddba9fdb635b0af2f32aff" width="20">
```javascript
 yarn add qcall-react
```

## HOC Component
### Description

The high ordeer component will manage the logic of the clients and the current stream without quitting the builder callbacks to the user of the qcall library by using the room enhacer. It also manages to set the proper before unload callbacks needed to work correcctly in the componenDidMount, and componentWillUnmount.<br>
This library is <b>Strongly</b> recomended to use whe using qcall with react for a proper use.

#### Injected props
Name | Type | Description
--- | --- | ---
roomEnhancer | Function: params (builder) => {} : RoomBuilder | Define a function on how to build the RoomBuilder once that function is defined return the builder passed. Here you build the Room <br>Example:<br/> roomEnhancer(roomBuilder => {<br/>roomBuilder.setMetadata({name: "Testing"})<br/>return roomBuilder<br/>}).build(  ) -- Here you build the room with the enhancer
clients | Array of Clients | You get an array of the clients in the room it updates itself.
localVideoStream | MediaStream | The local stream (without audio) of the user
localAudioStream | MediaStream | The local stream (without video) of the user
localStream | MediaStream | The local stream
 

## Usage
```js
import React, { useState, useEffect } from 'react';
import { Video }, connectToRoom from './qcall-react'
//With connectToRoom function we provide a HOC (High order component)
//We will get injected the room enhancer in the props to build the room
//We will get the clients in the room and it will track the changes all by itself
//We will get the localStream (MediaStream) when its available until then we will get null
//We will get the localVideoStream (MediaStream without audio) when its available until then we will get null
const App = ({ roomEnhancer, clients, localStream, localVideoStream, ...props }) => { 

//Here as we can see we build the room with the room enhancer we define a function where we
//get the builder in scope an return it
//After its defined the builder we build it with the enhancer
  const [room, setRoom] = useState(
    roomEnhancer((roomBuilder) =>
      (
        roomBuilder.setMetadata({ name: "Augusto Alonso" })
          .setOnStreamDennied(() => {
            alert("Por favor otorgue los permisos necesarios")
          })
        .setWithAudio(false)
      )
    ).build()
  )
  
  return (
    <div className="row p-4">
      <div className="col-md-3 col-12">
        <div className="card w-100 text-center">
          {props.pepe}
          <h2 className="card-header card-title">{room.metadata.name}</h2>
          <button onClick={() => {
            connect()
          }}>Conectar</button>
          <button onClick={() => {
            room.toggleMute()
          }}>mic toggle</button>
          <button onClick={() => {
            room.toggleCamera()
          }}>camera toggle</button>
          <Video
            className="w-100 video"
            height={250}
            autoPlay
            controls
            srcObject={localVideoStream}
          >
          </Video>
        </div>
      </div>
      {
        clients.map(client => (<div key={client.id} className="col-md-3 col-12">
          <div className="card w-100 text-center">
            <h2 className="card-header card-title">{client.metadata.name}</h2>
            <Video
              className="w-100 video"
              height={250}
              autoPlay
              controls
              srcObject={client.stream}
            >
            </Video>
          </div>
        </div>))
      }

    </div >
  );

}
//In here we use the connectRoom where the id is the room id
//deploy value
//and the api key
export default connectToRoom({ id: "1", deploy: "default", apiKey: "AcWTcIXA6Z95uYDOLMb9U8uZH5eeSb045FB8fXu5" }, App);
```
### Way to create it in a component
```js
import CompB from './CompB';
import { Video }, connectToRoom from './qcall-react'
cons CompA = (roomId) => {
const NewCompB = connectToRoom({ id: roomId, deploy: "default", apiKey: "AcWTcIXA6Z95uYDOLMb9U8uZH5eeSb045FB8fXu5" }, Video)
return (<NewCompB/>)
}

```

