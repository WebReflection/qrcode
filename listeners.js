class Listeners extends Map {
  add(target, ...rest) {
    for (const [type, value] of this)
      target.addEventListener(type, value, ...rest);
    return this;
  }
  remove(target, ...rest) {
    for (const [type, value] of this)
      target.removeEventListener(type, value, ...rest);
    return this;
  }
}

export default Listeners;
