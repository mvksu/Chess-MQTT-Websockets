import mqtt from "mqtt/dist/mqtt";
const websocketUrl = "ws://broker.emqx.io:8083/mqtt";
const apiEndpoint = "<API-ENDPOINT>/";

function getClient(errorHandler) {
  const client = mqtt.connect(websocketUrl);
  client.stream.on("error", (err) => {
    console.log(`Connection to ${websocketUrl} failed`);
    client.end();
  });
  return client;
}
function subscribe(client, topic, errorHandler) {
  const callBack = (err, granted) => {
    if (err) {
      console.log("Subscription request failed");
    }
  };
  return client.subscribe(topic, callBack);
}
function onMessage(client) {
  client.on("message", (topic, message, packet) => {
    console.log(topic, message)
  });
}
function unsubscribe(client, topic) {
  client.unsubscribe(apiEndpoint + topic);
}
function closeConnection(client) {
  client.end();
}

const mqttService = {
  getClient,
  subscribe,
  onMessage,
  unsubscribe,
  closeConnection,
};
export default mqttService;