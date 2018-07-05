import  {  createHash  }  from  "crypto" ;

export const generateSHA512Hash = (data: string): string =>
  createHash('sha512').update(data || '').digest('hex');

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

export const printOpts = (opts: any): void =>{
  opts.secret = generateSHA512Hash(opts.secret);
  opts.passphrase = generateSHA512Hash(opts.passphrase);
  opts.keyString = generateSHA512Hash(opts.keyString);
  console.log("Signing opts:", opts);
};

