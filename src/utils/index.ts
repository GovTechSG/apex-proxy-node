export const isTruthy = (value: any): boolean => {
  const valueType = typeof value;
  switch(valueType) {
    case 'string':
      const normalisedValue = value.toLowerCase();
      return (
        normalisedValue === 'true'
        || normalisedValue === '1'
      );
    case 'number':
      return value >= 1;
    case 'boolean':
      return value;
    default:
      return false;
  }
};