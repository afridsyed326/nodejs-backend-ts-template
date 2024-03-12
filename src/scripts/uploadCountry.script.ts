// IMPORTS
import dotenv from 'dotenv';
import readline from 'readline';

// MODELS
import CountryModel from '../models/country.model';

// ENV & REDLINE CONFIG
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// INTERFACE
interface CountrySample {
  name: string;
  code: string;
  code3: string;
  countryCode: string;
  region: string;
  subRegion: string;
  intermediateRegion: string;
  regionCode: string;
  intermediateRegionCode: string;
  phoneCode: Number;
}

export default async (force = false) => {
  try {
    const response = await fetch(
      'https://gist.githubusercontent.com/codepadding/06a862ceb1f9c5dc5f0f805a30bbf924/raw/7fd28d5ccb920acd6257768f23936f63f8f26c51/country.json'
    );
    const countries = await response.json();
    const formatted = countries?.map((country: CountrySample) => {
      return {
        name: country?.name,
        code: country?.code,
        phoneCode: country?.phoneCode,
        flag: `https://storage.googleapis.com/datadocx/flags/countries/country_${country?.code.toLowerCase()}.svg`,
      };
    });

    const country_find = await CountryModel.findOne();

    if (!country_find || force) {
      if (country_find && force) {
        await CountryModel.deleteMany();
        rl.question(
          'Are you sure you want to delete all documents? (y/n): ',
          async (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yy') {
              await CountryModel.deleteMany();
              console.log('delete all country');
            }
          }
        );
      }
      await CountryModel.create(formatted);
      console.log('successfully upload country with flag');
    } else {
      console.log('country list already uploaded');
    }
  } catch (error: any) {
    console.log(error.message);
  }
};
