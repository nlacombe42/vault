export class DateUtils {
	public static getFirstSecondOfMonth(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	public static getLastSecondOfMonth(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, -1);
	}

	public static monthEquals(date1: Date, date2: Date) {
		return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
	}
}
