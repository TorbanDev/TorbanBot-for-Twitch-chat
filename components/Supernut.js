const obs = require("obs-websocket-js");
const nut = () => {
  const startNut = {
    item: "Supernut",
    visible: true,
  };
  const startAudio = {
    item: "Gasm",
    visible: true,
  };
  const endAudio = {
    item: "Gasm",
    visible: false,
  };
  const endNut = {
    item: "Supernut",
    visible: false,
  };
  const wait = {
    sleepMillis: 3000,
  };
  const request = [startNut, startAudio, wait, endNut];
  obs
    .send("ExecuteBatch", request)
    .then((data) => {
      console.log(data.results);
    })
    .catch((err) => console.log(err));
  // Commands to invoke:
  // ExecuteBatch - https://github.com/obsproject/obs-websocket/blob/4.9.1/docs/generated/protocol.md#executebatch
  // Takes an array of requsts
  // 1. Probably set source settings on the image source to make it enabled https://github.com/obsproject/obs-websocket/blob/4.9.1/docs/generated/protocol.md#setsourcesettings
  // 2. Play a sound clip
  // 3. Either sleep until the sound clip is done or exit after the sound clip is done
  // 4. set source settings to turn image off.
  // 5. This can be modified to be a general purpose play gif probably... You could set the source to the filename provided in args. determine which file in an switch statement given inputs from bot or web request or whatever.
};
/*const setSceneItemProperties = (input) => {
  return obs
    .send("SetSceneItemProperties", {
      item: "Supernut",
      visible: false,
    })
    .then(() => {
      console.log("DONE");
    })
    .catch((err) => console.log(err));
};*/
