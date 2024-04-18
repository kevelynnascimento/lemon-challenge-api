export default class EnumValidator {
  static isValid<T>(enumType: T, value: string): boolean {
    return Object.values(enumType).includes(value as any);
  }
}
