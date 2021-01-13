const peer = new Peer();
let clients = [];

peer.on("connection", function(conn) {
  clients.push(conn);
  conn.on("data", function(data) {
    console.log(data);
    document.getElementById("peer").textContent = JSON.stringify(data);
  });
});

function initHost() {
  peer.on("open", function(id) {
    const clientUrl = location.href.split("#")[0] + "#" + id;
    document.getElementById("url").textContent = clientUrl;
  });

  document.getElementById("host").style.display = "block";
  document.getElementById("play").addEventListener("click", function() {
    clients.forEach(function(client) {
      client.send({
        type: "play",
        payload: { speed: document.getElementById("speed").value }
      });
    });
  });
  document.getElementById("pause").addEventListener("click", function() {
    clients.forEach(function(client) {
      client.send({ type: "pause" });
    });
  });
  document.getElementById("speed").addEventListener("input", function(event) {
    clients.forEach(function(client) {
      client.send({ type: "speed", payload: event.target.value });
    });
  });
}

function initClient(hostId) {
  const conn = peer.connect(hostId);
  // on open will be launch when you successfully connect to PeerServer
  conn.on("open", function() {
    // Sending hello to host
    conn.send({
      type: "hello",
      payload: { client: peer.id, host: hostId, connection: conn.id }
    });
  });
  conn.on("data", function(data) {
    console.log(data);
    switch (data.type) {
      case "play": {
        dotsPlay(data.payload.speed);
        conn.send({
          type: "ack",
          payload: data
        });
        break;
      }
      case "pause": {
        dotsPause();
        conn.send({
          type: "ack",
          payload: data
        });
        break;
      }
      case "speed": {
        dotsSpeed(data.payload);
        conn.send({
          type: "ack",
          payload: data
        });
        break;
      }
      default: {
        conn.send({
          type: "error",
          payload: "unknown type " + data.type
        });
      }
    }
  });
}

// On startup, decide if host or client, depending on url hash
if (location.hash === "#host") {
  initHost();
} else if (location.hash.length > 7) {
  const hostId = location.hash.split("#")[1];
  initClient(hostId);
}
