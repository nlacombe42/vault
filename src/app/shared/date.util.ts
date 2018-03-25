export class DateUtils {
	public static getFirstSecondOfMonth(month: Date): Date {
		return new Date(month.getFullYear(), month.getMonth(), 1);
	}

	public static getLastSecondOfMonth(month: Date): Date {
		return new Date(month.getFullYear(), month.getMonth() + 1, 1, 0, 0, -1);
	}

	public static monthEquals(month1: Date, month2: Date): boolean {
		return month1.getFullYear() === month2.getFullYear() && month1.getMonth() === month2.getMonth();
	}

	public static isPastMonth(month: Date): boolean {
		return DateUtils.getLastSecondOfMonth(month) < new Date();
	}

	public static addSeconds(date: Date, seconds: number) {
		let newDate = new Date(date);
		newDate.setSeconds(newDate.getSeconds() + seconds);
		return newDate;
	}

	public static addMinutes(date: Date, minutes: number) {
		let newDate = new Date(date);
		newDate.setMinutes(newDate.getSeconds() + minutes);
		return newDate;
	}
}
