
export default class CountryUtil {

  static getCountryCodeByName(countryName): string {
    const countries = require('../assests/json/countries');

    for (const c of countries) {
      if (c.name === countryName) {
        return c.alpha2Code;
      }
    }

    return null;
  }

}
