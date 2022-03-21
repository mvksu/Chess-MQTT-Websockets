import mqtt from "mqtt/dist/mqtt";

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: "userLoggedOut",
      payload: `User has logged out`,
      qos: 0,
      retain: false,
    },
  };

const host = "ws://broker.emqx.io:8083/mqtt";
const apiEndpoint = "<API-ENDPOINT>/";


function getClient(errorHandler) {
  const client = mqtt.connect(host, options);
  client.stream.on("error", (err) => {
    errorHandler(`Connection to ${host} failed`);
    client.end();
  });
  client.on('connect', () => {
      console.log('Connected')
  })
  return client;
}

function subscribe(client, topic, errorHandler) {
  const callBack = (err, granted) => {
    if (err) {
      errorHandler("Subscription request failed");
    }
  };
  return client.subscribe(topic, callBack);
}

function onMessage(client, callBack) {
  client.on("message", (topic, message, packet) => {
    callBack(JSON.parse(new TextDecoder("utf-8").decode(message)));
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
