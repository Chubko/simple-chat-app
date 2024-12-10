class Room {
  constructor(roomId, roomTitle, namespaceId, privatRoom = false) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespaceId = namespaceId;
    this.privatRoom = privatRoom;
    this.history = [];
  }

  addMessage(message) {
    this.history.push(message);
  }

  clearHistoty() {
    this.history = [];
  }
}

module.exports = Room;
