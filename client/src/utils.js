export const catchErrors = fn => {
  return function(...args) {
    return fn(...args).catch((err) => {
      console.error(err)
    })
  }
}

export const formatTrackDuration = (duration) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor(((duration % 60000) / 1000));
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}