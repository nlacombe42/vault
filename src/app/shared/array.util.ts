export class Grouping<Key, Value> {
	readonly key: Key;
	readonly values: Value[];

	constructor(key: Key, values: Value[]) {
		this.key = key;
		this.values = values;
	}
}

export class ArrayUtils {
	public static groupByField<Value extends object>(values: Value[], property: keyof Value, getComparableKey?: (value: Value) => any): Grouping<any, Value>[] {
		const _getComparableKey = !!getComparableKey ? getComparableKey : (value: Value) => value[property];
		const map = values.reduce((map, value) => {
			let comparableKey = _getComparableKey(value);

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
