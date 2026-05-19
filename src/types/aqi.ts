// AQI category string union — matches the six Indian AQI bands
export type AqiCategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

// A single pollutant reading as stored in the static JSON
export interface PollutantReading {
  id: string;           // machine key: "pm25", "no2", etc.
  display_name: string; // human label: "PM2.5", "NO₂", etc.
  value: number;        // concentration from Open-Meteo (µg/m³ or mg/m³)
  unit: string;         // "µg/m³" or "mg/m³"
  category: AqiCategory;
}

// The WAQI station the AQI reading came from
export interface WaqiStation {
  name: string;   // e.g. "IGSC Planetarium Complex, Patna, India"
  waqi_id: number; // numeric station id from WAQI (data.idx)
}

// One hour in the 48-hour forecast (from Open-Meteo hourly)
export interface ForecastHour {
  time: string;  // ISO 8601 local time, e.g. "2026-05-19T22:00"
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
}

export interface ForecastData {
  hourly: ForecastHour[];
}

// Metadata about when the JSON was generated
export interface AqiMeta {
  generated_at: string;   // ISO 8601 UTC timestamp
  next_update_at: string; // ISO 8601 UTC timestamp
  sources: string[];      // ["WAQI", "Open-Meteo"]
  location: AqiLocation;
}

export interface AqiLocation {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

// The current AQI reading for the city
export interface CurrentAqi {
  aqi: number;
  category: AqiCategory;
  dominant_pollutant: string; // id of the pollutant driving the AQI
  station: WaqiStation;
  pollutants: PollutantReading[];
}

// Root shape of public/data/aqi.json
export interface AqiData {
  meta: AqiMeta;
  current: CurrentAqi;
  forecast: ForecastData;
}
