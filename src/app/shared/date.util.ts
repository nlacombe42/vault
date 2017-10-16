export class DateUtils {
	public static getFirstSecondOfMonth(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	public static getLastSecondOfMonth(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, -1);
	}
}
