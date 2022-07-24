const BuildOBSBatch = (command) => {
  let batch = [];
  const includeImage = command.hasImage;
  const includeMedia = command.hasMedia;
  const includeSleep = command.mediaDuration !== null;

  // Set the item properties
  if (includeImage) {
    const step = SetImage(command.imagePath);
    batch.push(step);
  }
  if (includeMedia) {
    const step = SetMedia(command.mediaPath);
    batch.push(step);
  }
  // Turn the sources on
  if (includeImage) {
    const step = SetShowHideImage(true);
    batch.push(step);
  }
  if (includeMedia) {
    const step = SetShowHideMedia(true);
    batch.push(step);
  }
  // Sleep
  if (includeSleep) {
    const step = SetWait(command.mediaDuration);
    batch.push(step);
  }
  // Turn the sources off
  if (includeImage) {
    const step = SetShowHideImage(false);
    batch.push(step);
  }
  if (includeMedia) {
    const step = SetShowHideMedia(false);
    batch.push(step);
  }

  return batch;
};

const SetImage = (val) => {
  const step = BuildSetSourceSettings("MemeImage", val);
  return step;
};
const SetMedia = (val) => {
  const step = BuildSetSourceSettings("MemeMedia", val, val);
  return step;
};
const BuildSetSourceSettings = (target, file, localFile) => {
  const command = {
    "request-type": "SetSourceSettings",
    sourceName: target,
    sourceSettings:
      localFile !== undefined
        ? {
            file: file,
            local_file: file,
          }
        : {
            file: file,
          },
  };
  return command;
};
const SetShowHideImage = (isVisible) => {
  const step = BuildShowHideScene("MemeImage", isVisible);
  return step;
};
const SetShowHideMedia = (isVisible) => {
  const step = BuildShowHideScene("MemeMedia", isVisible);
  return step;
};
const SetWait = (duration) => {
  const command = {
    "request-type": "Sleep",
    sleepMillis: duration,
  };
  return command;
};

const BuildShowHideScene = (val, isVisible) => {
  const step = BuildOBSCommand("SetSceneItemProperties", val, isVisible);
  return step;
};

const BuildOBSCommand = (commandName, val, isVisible) => {
  const command =
    isVisible === null || isVisible === undefined
      ? {
          "request-type": commandName,
          item: val,
        }
      : {
          "request-type": commandName,
          item: val,
          visible: isVisible,
        };
  return command;
};

module.exports = { BuildOBSBatch };
