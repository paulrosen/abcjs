function getBarYAt(startx, starty, endx, endy, x) {
	return starty + (endy - starty) / (endx - startx) * (x - startx);
}

export default getBarYAt;

