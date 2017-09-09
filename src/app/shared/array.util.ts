export class Grouping<Key, Value> {
	readonly key: Key;
	readonly values: Value[];

	constructor(key: Key, values: Value[]) {
		this.key = key;
		this.values = values;
	}
}

export class ArrayUtils {
	public static groupByField<Value>(values: Value[], property: string, getComparableKey?: (value: Value) => any): Grouping<any, Value>[] {
		if (!getComparableKey)
			getComparableKey = function (value: Value): any {
				return value[property];
			};

		const map = values.reduce((map, value) => {
			let comparableKey = getComparableKey(value);

			ArrayUtils.addToMapValues(map, comparableKey, value);

			return map;
		}, new Map<string, Value[]>());

		return Array.from(map).map(([comparableKey, value]) => new Grouping(value[0][property], value));
	}

	public static addToMapValues<Key, Value>(map: Map<Key, Value[]>, key: Key, value: Value): void {
		let values = map.get(key);

		if (values === undefined)
			values = [];

		values.push(value);

		map.set(key, values);
	}
}
