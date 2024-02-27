export const isStringPositiveInteger = (stringValue) => {
    if (typeof stringValue !== 'string') return false;
    const positiveIntegerRegex = new RegExp('^(0|[1-9][0-9]*)$');
    return positiveIntegerRegex.test(stringValue);
}
