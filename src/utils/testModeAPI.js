export const gaCalls = [];

export default {
  calls: gaCalls,
  ga: (...args) => {
    gaCalls.push([...args]);
  }
};
