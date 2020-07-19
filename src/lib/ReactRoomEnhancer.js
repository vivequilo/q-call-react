/**
 * It is a class wich allows to easily build a Room instance to use.
 *
 * It is a builder class.
 *
 * @author Augusto Alonso.
 */

import { Room, RoomBuilder } from 'qcall'


export default class ReactRoomEnhancer {
    /**
     * @class
     */
    constructor({ id, deploy = 'default', apiKey = null }) {
        this.builder = new RoomBuilder(id, deploy, apiKey)
        this.room = null
        this.onStreamAdded = () => { }
        // this.onStreamDennied = () => { }
        this.onLocalStream = () => { }
        this.onStreamRemoved = () => { }
    }

    /**
     * Sets the callback when a remote stream is added.
     * @param {onStreamAdded} onStreamAdded The function parameter wich revieves two optional parameters
     * @param {Client} client The client just connceted to the room
     * @param {MediaStream} remoteStream The remote stream added is the second parameter of onStreamAdded
     */
    setOnStreamAdded(onStreamAdded) {
        this.onStreamAdded = (client, remoteStream) => {
            onStreamAdded(client, remoteStream)
            this.builder.onStreamRemoved(client, remoteStream)
        }
        return this
    }

    /**
 * Sets the callback when a remote stream is removed from the call.
 * @param {onStreamAdded} onStreamAdded The function parameter wich revieves one optional parameter
 * @param {String} id The peer id of the caller is a parameter of onStreamRemoved
 */
    setOnStreamRemoved(onStreamRemoved) {
        this.onStreamRemoved = (callerId) => {
            onStreamRemoved(callerId)
            this.builder.onStreamRemoved(callerId)
        }
        return this
    }

    /** Sets the callback when the stream is dennied
 * @param {Function} onLocalStream The function parameter can recieve two optional parameters
 * @param {object} stream MediaStream of  the local caller
 */
    setOnLocalStream(onLocalStream) {
        this.onLocalStream = (stream) => {
            onLocalStream(stream)
            this.builder.onLocalStream(stream)
        }
        return this
    }


    enhanceBuilder() {
        return (fn) => {
            this.builder = fn(this.builder)
            if (!this.builder) {

            }
            return this
        }
    }


    /**
    * Builds the Room instance
    *  @return {Room} Return Room class.
    */
    build() {
        this.room = new Room({
            id: this.builder.id,
            peerId: this.builder.peerId,
            metadata: this.builder.metadata,
            onStreamDennied: this.builder.onStreamDennied,
            withAudio: this.builder.withAudio,
            videoConstraints: this.builder.videoConstraints,
            onStreamAdded: this.onStreamAdded,
            onLocalStream: this.onLocalStream,
            onStreamRemoved: this.onStreamRemoved,
            api: this.builder.createApi()
        })
        return this.room
    }
}