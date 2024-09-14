export const cleanCSVValue = (value: string) => {
  return value?.trim().replace(/^"+|"+$/g, ''); 
};

export const setNestedValue = (obj: any, keys: string[], value: any) => {
  let currentObj = obj;
  for (let i = 0; i < keys?.length; i++) {
    const key = keys[i];
    if (i === keys?.length - 1) {
      if (value !== undefined && value !== null && value !== '') {
        currentObj[key] = value;
      }
    } else {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
  }
};

export const roundToTwoDecimals = (number: number) => number?.toFixed(2);