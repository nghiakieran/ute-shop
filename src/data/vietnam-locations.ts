/**
 * Vietnam Locations Data
 * Cities, Districts, and Wards loaded from province.json
 */

import provinceData from './province.json';

export type Ward = {
  name: string;
  code: string;
};

export type District = {
  name: string;
  code: string;
  wards: Ward[];
};

export type City = {
  name: string;
  code: string;
  districts: District[];
};

function transformProvinceData(): City[] {
  const cities: Map<string, City> = new Map();

  provinceData.Sheet1.forEach((item: any) => {
    if (!cities.has(item.provinceId)) {
      cities.set(item.provinceId, {
        name: item.provinceName || '',
        code: item.provinceId || '',
        districts: [],
      });
    }

    const city = cities.get(item.provinceId)!;

    let district = city.districts.find((d) => d.code === item.districtId);
    if (!district) {
      district = {
        name: item.districtName || '',
        code: item.districtId || '',
        wards: [],
      };
      city.districts.push(district);
    }

    if (!district.wards.find((w) => w.code === item.communeId)) {
      district.wards.push({
        name: item.communeName || '',
        code: item.communeId || '',
      });
    }
  });

  return Array.from(cities.values());
}

export const vietnamLocations: City[] = transformProvinceData();
