function getBarYAt(startx: any, starty: any, endx: any, endy: any, x: any) {
  return starty + ((endy - starty) / (endx - startx)) * (x - startx);
}

export default getBarYAt;
