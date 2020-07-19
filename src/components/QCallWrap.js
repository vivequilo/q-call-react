import React from 'react';
import ReactRoomEnhancer from '../lib/ReactRoomEnhancer';

export const CLIENT_DISCONNECTED = "CLIENT_DISCONNECTED"
const connectToRoom = ({ id, deploy = 'default', apiKey = null }, Child) => {
    let enhancer = new ReactRoomEnhancer({ id, deploy, apiKey })

    class QCallWrap extends React.Component {

        constructor(props) {
            super(props)
            this.state = {
                localVideoStream: null,
                localAudioStream: null,
                localStream: null,
                enhancer: enhancer,
                clients: []
            }
            enhancer.setOnStreamAdded((client, remoteStream) => this.onStreamAdded(client, remoteStream))
            enhancer.setOnStreamRemoved((id) => this.onStreamRemoved(id))
            enhancer.setOnLocalStream((stream) => this.onLocalStream(stream))

        }
        onStreamRemoved(clientId) {
            this.setState((state, props) => ({
                ...state,
                clients: state.clients.filter(currentClient => {
                    return currentClient.id !== clientId
                })
            }))
        }
        onStreamAdded(client, remoteStream) {
            if (!this.state.clients.some(c => c.id === client.id)) {
                this.setState((state, props) => ({
                    ...state,
                    clients: [...state.clients, client]
                }))
            }
        }
        onLocalStream(stream) {
            let holder = stream.clone()
            if (holder.getAudioTracks().length > 0) {
                holder.getAudioTracks().forEach(track => holder.removeTrack(track))
            }
            let holderAudio = stream.clone()
            if (holderAudio.getVideoTracks().length > 0) {
                holderAudio.getVideoTracks().forEach(track => holderAudio.removeTrack(track))
            }

            this.setState((state, props) => ({
                ...state,
                localVideoStream: holder,
                localAudioStream: holderAudio,
                localStream: stream
            }))
        }

        onUnloadWindow() {
            if (enhancer.room) {
                this.state.clients.forEach(client => {
                    client.call.close()
                    client.connection.send({ type: CLIENT_DISCONNECTED, peerId: enhancer.room.peerId })
                })
                enhancer.room.close()
            }
        }
        componentDidMount() {
            window.addEventListener("beforeunload", () => { this.onUnloadWindow() });
        }

        componentWillUnmount() {
            window.removeEventListener("beforeunload", () => { this.onUnloadWindow() });
        }

        render() {
            return (
                <Child
                    {...this.props}
                    roomEnhancer={this.state.enhancer.enhanceBuilder()}
                    clients={this.state.clients}
                    localStream={this.state.localStream}
                    localAudioStream={this.state.localAudioStream}
                    localVideoStream={this.state.localVideoStream}
                />
            );
        }
    }

    return QCallWrap;
};

export default connectToRoom
