import { NextResponse } from 'next/server';
import { DISTRICTS } from '@/lib/districts';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const districtName = searchParams.get('district');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  const apiKey = process.env.WEATHER_API_KEY || 'f5aeec1f3dd348b291b141654262903';

  let query;
  let isCoord = false;
  let decodedName = '';
  let district = null;

  if (lat && lon) {
    query = `${lat},${lon}`;
    isCoord = true;
  } else {
    // URL decode the district name and make it case-insensitive for matching
    decodedName = decodeURIComponent(districtName || 'Dhaka').trim();
    district = DISTRICTS.find(d => d.name.toLowerCase() === decodedName.toLowerCase());
    // Use coordinates if available for better reliability, fall back to name
    query = district ? `${district.lat},${district.lon}` : decodedName;
  }

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=1&aqi=no&alerts=no`,
      { cache: 'no-store' }
    );
    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message || 'Weather fetch failed');

    const current = data.current;
    const forecast = data.forecast.forecastday[0].day;

    // Irrigation Logic
    // High Priority: No rain today AND Temp > 30°C
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

    return NextResponse.json({
      location: data.location.name,
      district: isCoord ? (data.location.region || data.location.name) : (district ? district.bn : decodedName),
      temp: current.temp_c,
      feels_like: current.feelslike_c,
      condition: current.condition.text,
      icon: current.condition.icon,
      humidity: current.humidity,
      wind: current.wind_kph,
      rain_chance: forecast.daily_chance_of_rain,
      irrigation: irrigationStatus
    });

  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
