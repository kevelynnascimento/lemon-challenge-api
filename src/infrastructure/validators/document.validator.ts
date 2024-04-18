export default class DocumentValidator {
  static isValid(value: string): boolean {
    const cleanedValue = value.replace(/[^\d]/g, '');
    return /^(\d{11}|\d{14})$/.test(cleanedValue);
  }
}
