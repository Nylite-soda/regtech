declare module 'react-select-country-list' {
  interface Country {
    value: string;
    label: string;
  }

  function countryList(): {
    getData: () => Country[];
  };

  export default countryList;
} 