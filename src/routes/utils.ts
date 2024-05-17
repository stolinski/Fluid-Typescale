export function round(num: number, places: number = 2) {
	return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
}
