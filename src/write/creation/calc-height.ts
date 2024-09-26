// TODO-PER: make the types more organized
interface V {
	duplicate: boolean;
	staff: { top: number; bottom: number };
}

interface SG {
	voices: Array<V>;
}

export function calcHeight(staffGroup : SG) {
	// the height is calculated here in a parallel way to the drawing below in hopes that both of these functions will be modified together.
	// TODO-PER: also add the space between staves. (That's systemStaffSeparation, which is the minimum distance between the staff LINES.)
	let height = 0;
	staffGroup.voices.forEach(v => {
		if (!v.duplicate) {
			height += v.staff.top;
			height += -v.staff.bottom;
		}
	})
	return height;
}
