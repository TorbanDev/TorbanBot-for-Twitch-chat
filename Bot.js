require("dotenv").config();
console.log("PORT is " + process.env.PORT);
const OBSWebSocket = require("obs-websocket-js");

const { initialize } = require("twitch-chatbot-boilerplate");

const commandBuilder = require("./CommandBuilder.js");
const Queue = require("./Queue.js");

const ADDRESS = process.env.OBS_WEBSOCKET_ADDRESS;
const PASSWORD = process.env.OBS_WEBSOCKET_PASSWORD;

let commands = [];

let requireCooldown = true;
let cooldown = 60;
let cooldownList = {};

const setCooldown = (command) => {
  const time = Math.floor(Date.now() / 1000);
  cooldownList[command] = time + cooldown;
};
const onCooldown = (command) => {
  if (cooldownList[command] === undefined) return false;
  const time = Math.floor(Date.now() / 1000);
  return cooldownList[command] >= time;
};
const getCooldown = (command) => {
  const time = Math.floor(Date.now() / 1000);
  return cooldownList[command] - time;
};

const CommandQueue = new Queue.Queue();

const main = async () => {
  const { client } = await initialize();
  // Build the commands
  commandBuilder.BuildCommands().then((data) => {
    commands = data;
  });
  // This is the example on the tmi.js website
  client.on("message", (channel, userstate, message, self) => {
    if (self) return;

    if (message[0] !== "!") return;
    const command = message.toLowerCase().split("!")[1];
    const isMod = userstate.mod;
    const isBroadcaster = userstate.username === channel.split("#")[1];
    const isAdmin = isMod || isBroadcaster;

    if (command === "hello") {
      client.say(channel, `@${userstate.username}, heya!`);
    }
    if (command.startsWith("cd")) {
      if (!isAdmin) return;
      const timer = message.split(" ")[1];
      cooldown = parseInt(timer);
      if (timer === "0") {
        requireCooldown = false;
      } else {
        requireCooldown = true;
      }
    }
    const foundCommand = commands.find((item) => item.commandName === command);
    if (foundCommand) {
      if (isAdmin) {
        AddToQueue(foundCommand, true);
        return;
      } else if (requireCooldown && onCooldown(foundCommand.commandName)) {
        const cooldownTime = getCooldown(foundCommand.commandName);
        switch (foundCommand.commandName) {
          case "nut":
            client.say(
              channel,
              `@${userstate.username}, Hold on I'm recharging for ${cooldownTime} seconds`
            );
            break;
          default:
            client.say(
              channel,
              `@${userstate.username}, ${foundCommand.commandName} is on cooldown for ${cooldownTime} seconds`
            );
            break;
        }
      } else {
        AddToQueue(foundCommand, false);
      }
    }
  });
};

const AddToQueue = (command, sendWithPriority) => {
  if (sendWithPriority) {
    PlayCommand(command, true);
    return;
  }
  if (CommandQueue.isEmpty()) {
    PlayCommand(command);
    CommandQueue.enqueue(command);
  } else {
    CommandQueue.enqueue(command);
  }
};

const PlayNext = () => {
  if (CommandQueue.isEmpty()) {
    return;
  }
  const command = CommandQueue.front();
  PlayCommand(command);
};

main().catch((e) => {
  console.error(e);
});

const input = process.argv[2];

const obs = new OBSWebSocket();
const init = async () => {
  obs
    .connect({ address: ADDRESS, password: PASSWORD })
    .then(() => {
      console.log("Successfully connected");
      return obs.send("GetCurrentScene");
    })
    .then((data) => {
      let MemeImage = null;
      let MemeMedia = null;
      const name = data.name;
      data.sources.forEach((source) => {
        const name = source.name;
        if (name === "MemeMedia") MemeMedia = source;
        if (name === "MemeImage") MemeImage = source;
      });
      if (MemeImage === null) {
        CreateImageSource(name);
      }
      if (MemeMedia === null) {
        CreateMediaSource(name);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const CreateImageSource = async (currentScene) => {
  await obs
    .send("CreateSource", {
      sourceName: "MemeImage",
      sourceKind: "image_source",
      sceneName: currentScene,
      setVisible: false,
    })
    .catch((err) => {
      console.log(err);
    });
};

const CreateMediaSource = async (currentScene) => {
  return obs
    .send("CreateSource", {
      sourceName: "MemeMedia",
      sourceKind: "ffmpeg_source",
      sceneName: currentScene,
      setVisible: false,
    })
    .then((data) => {
      return obs.send("SetAudioMonitorType", {
        sourceName: "MemeMedia",
        monitorType: "monitorAndOutput",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
const PlayCommand = async (command, sendWithPriority) => {
  if (command.obsBatch === null) {
    command.BuildBatch();
  }
  if (sendWithPriority) {
    await SendBatchWithPriority(command.obsBatch);
    return;
  }
  setCooldown(command.commandName);
  await SendBatch(command.obsBatch);
};

const changeScene = (sceneName) => {
  obs
    .send("SetCurrentScene", {
      "scene-name": sceneName,
    })
    .catch((err) => {
      console.log(err);
    });
  return true;
};

const WaitBetweenBatch = {
  "request-type": "Sleep",
  sleepMillis: 500,
};

const SendBatch = async (batch) => {
  obs
    .send("ExecuteBatch", { requests: batch })
    .then((data) => {
      // console.log(data.results);
      console.log("NEXT QUEUE");
      const removed = CommandQueue.dequeue();
      PauseBetweenCommands();
    })
    .catch((err) => console.log(err));
};
const SendBatchWithPriority = async (batch) => {
  obs
    .send("ExecuteBatch", { requests: batch })
    .then((data) => {})
    .catch((err) => console.log(err));
};
const PauseBetweenCommands = async () => {
  obs
    .send("ExecuteBatch", { requests: [WaitBetweenBatch] })
    .then((data) => {
      PlayNext();
    })
    .catch((err) => console.log(err));
};

init();
