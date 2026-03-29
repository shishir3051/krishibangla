import { DISTRICTS } from './districts';

export async function getWeather(districtName = 'Dhaka') {
  const apiKey = 'f5aeec1f3dd348b291b141654262903';

  // URL decode the district name and make it case-insensitive for matching
  const decodedName = decodeURIComponent(districtName).trim();
  const district = DISTRICTS.find(d => d.name.toLowerCase() === decodedName.toLowerCase());
  
  // Use coordinates if available for better reliability, fall back to name
  const query = district ? `${district.lat},${district.lon}` : decodedName;

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=1&aqi=no&alerts=no`
    );
    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message || 'Weather fetch failed');

    const current = data.current;
    const forecast = data.forecast.forecastday[0].day;

    // Irrigation Logic
    let irrigationStatus = {
      level: 'low',
      message_en: 'No immediate irrigation needed.',
      message_bn: 'তাত্ক্ষণিক সেচের প্রয়োজন নেই।'
    };

    if (forecast.daily_chance_of_rain > 50) {
      irrigationStatus = {
        level: 'none',
        message_en: 'Rain expected. Avoid irrigation.',
        message_bn: 'বৃষ্টির সম্ভাবনা আছে। সেচ এড়িয়ে চলুন।'
      };
    } else if (current.temp_c > 30 && forecast.daily_chance_of_rain < 20) {
      irrigationStatus = {
        level: 'high',
        message_en: 'High heat & low rain. Irrigation recommended.',
        message_bn: 'তীব্র তাপ ও বৃষ্টির অভাব। সেচ দেওয়ার পরামর্শ দেওয়া হলো।'
      };
    } else if (current.temp_c > 25 && forecast.daily_chance_of_rain < 30) {
      irrigationStatus = {
        level: 'medium',
        message_en: 'Monitor soil moisture for irrigation.',
        message_bn: 'সেচের জন্য মাটির আর্দ্রতা পরীক্ষা করুন।'
      };
    }

    return {
      location: data.location.name,
      district: district ? district.bn : decodedName,
      temp: current.temp_c,
      feels_like: current.feelslike_c,
      condition: current.condition.text,
      icon: current.condition.icon,
      humidity: current.humidity,
      wind: current.wind_kph,
      rain_chance: forecast.daily_chance_of_rain,
      irrigation: irrigationStatus
    };

  } catch (error) {
    console.error('Weather Fetch Error:', error);
    throw error;
  }
}
