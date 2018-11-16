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
  const tempOpts = {...opts};
  tempOpts.secret = generateSHA512Hash(opts.secret);
  tempOpts.passphrase = generateSHA512Hash(opts.passphrase);
  tempOpts.keyString = generateSHA512Hash(opts.keyString);
  console.log("Printing opts:", tempOpts);
};

