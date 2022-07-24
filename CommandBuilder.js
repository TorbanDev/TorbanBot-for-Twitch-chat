const fs = require("fs");
const path = require("path");
const { default: getAudioDurationInSeconds } = require("get-audio-duration");
const BatchBuilder = require("./BatchBuilder.js");

const imageDir = "./resources/images/";
const audioDir = "./resources/audio/";

const durationList = {};

class Command {
  constructor(
    hasMedia = false,
    hasImage = false,
    commandName = "",
    imagePath = "",
    mediaPath = ""
  ) {
    this.hasImage = hasImage;
    this.hasMedia = hasMedia;
    this.commandName = commandName;
    this.imagePath = imagePath;
    this.mediaPath = mediaPath;
    this.mediaDuration = null;
    this.obsBatch = null;
  }
  BuildBatch = () => {
    if (this.mediaDuration === null) {
      this.mediaDuration = durationList[this.commandName];
    }
    this.obsBatch = BatchBuilder.BuildOBSBatch(this);
  };
}

const BuildCommands = async () => {
  let commands = [];

  // Loop through audio file to find audio/video commands.
  // Then check if audio file has a matching image file.
  fs.readdirSync(audioDir + "/").forEach((file) => {
    var commandName;
    var hasImage;
    var hasMedia;
    var imagePath;
    var mediaPath;
    hasMedia = true;
    const command = file.split(".")[0];
    console.log("Command added: " + command);
    commandName = command;
    mediaPath = path.resolve(audioDir, file);
    getAudioDurationInSeconds(mediaPath)
      .then((duration) => {
        const mediaDuration = duration * 1000;
        durationList[commandName] = mediaDuration;
      })
      .catch((err) => {
        console.log(err);
      });
    const gifPath = path.join(imageDir, command + ".gif");
    if (fs.existsSync(gifPath)) {
      hasImage = true;
      imagePath = path.resolve(gifPath);
    }

    const c = new Command(
      hasMedia,
      hasImage,
      commandName,
      imagePath,
      mediaPath
    );
    commands.push(c);
  });

  return commands;
};

module.exports = { BuildCommands };
