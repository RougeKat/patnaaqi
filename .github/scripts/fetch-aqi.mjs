#!/usr/bin/env node
// fetch-aqi.mjs — Fetches from WAQI + Open-Meteo, merges, writes public/data/aqi.json
// Run locally:  WAQI_TOKEN=your_token node .github/scripts/fetch-aqi.mjs
// Run in CI:    Uses ${{ secrets.WAQI_TOKEN }} injected as env var

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────

const PATNA_LAT = 25.5941;
const PATNA_LON = 85.1376;
const UPDATE_INTERVAL_MINUTES = 60;

const WAQI_TOKEN = process.env.WAQI_TOKEN;
if (!WAQI_TOKEN) {
  console.error('Error: WAQI_TOKEN environment variable is not set.');
  process.exit(1);
}

// ─── Indian AQI helpers ───────────────────────────────────────────────────────

function getAqiCategory(aqi) {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

// Compute Indian AQI sub-index for a single pollutant concentration.
// Breakpoints from CPCB guidelines.
function calcPm25SubIndex(c) {
  if (c <= 30)  return linear(0,   50,  0,   30,  c);
  if (c <= 60)  return linear(51,  100, 30,  60,  c);
  if (c <= 90)  return linear(101, 200, 60,  90,  c);
  if (c <= 120) return linear(201, 300, 90,  120, c);
  if (c <= 250) return linear(301, 400, 120, 250, c);
  return linear(401, 500, 250, 380, Math.min(c, 380));
}

function calcPm10SubIndex(c) {
  if (c <= 50)  return linear(0,   50,  0,   50,  c);
  if (c <= 100) return linear(51,  100, 50,  100, c);
  if (c <= 250) return linear(101, 200, 100, 250, c);
  if (c <= 350) return linear(201, 300, 250, 350, c);
  if (c <= 430) return linear(301, 400, 350, 430, c);
  return linear(401, 500, 430, 600, Math.min(c, 600));
}

function calcNo2SubIndex(c) {
  if (c <= 40)  return linear(0,   50,  0,   40,  c);
  if (c <= 80)  return linear(51,  100, 40,  80,  c);
  if (c <= 180) return linear(101, 200, 80,  180, c);
  if (c <= 280) return linear(201, 300, 180, 280, c);
  if (c <= 400) return linear(301, 400, 280, 400, c);
  return linear(401, 500, 400, 800, Math.min(c, 800));
}

function calcSo2SubIndex(c) {
  if (c <= 40)  return linear(0,   50,  0,   40,  c);
  if (c <= 80)  return linear(51,  100, 40,  80,  c);
  if (c <= 380) return linear(101, 200, 80,  380, c);
  if (c <= 800) return linear(201, 300, 380, 800, c);
  if (c <= 1600) return linear(301, 400, 800, 1600, c);
  return linear(401, 500, 1600, 2100, Math.min(c, 2100));
}

function calcO3SubIndex(c) {
  if (c <= 50)  return linear(0,   50,  0,   50,  c);
  if (c <= 100) return linear(51,  100, 50,  100, c);
  if (c <= 168) return linear(101, 200, 100, 168, c);
  if (c <= 208) return linear(201, 300, 168, 208, c);
  if (c <= 748) return linear(301, 400, 208, 748, c);
  return linear(401, 500, 748, 1000, Math.min(c, 1000));
}

function linear(iHigh, iLow, cHigh, cLow, c) {
  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (c - cLow) + iLow);
}

function getPollutantCategory(subIndex) {
  return getAqiCategory(subIndex);
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchWaqi() {
  const url = `https://api.waqi.info/feed/patna/?token=${WAQI_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WAQI HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== 'ok') throw new Error(`WAQI error: ${JSON.stringify(json)}`);
  return json.data;
}

async function fetchOpenMeteo() {
  const params = new URLSearchParams({
    latitude: String(PATNA_LAT),
    longitude: String(PATNA_LON),
    current: 'pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,ozone',
    hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
    timezone: 'Asia/Kolkata',
    forecast_days: '2',
  });
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  return res.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching from WAQI and Open-Meteo...');

  const [waqi, meteo] = await Promise.all([fetchWaqi(), fetchOpenMeteo()]);

  console.log(`WAQI AQI: ${waqi.aqi} (${waqi.city.name})`);
  console.log(`Open-Meteo PM2.5: ${meteo.current.pm2_5} µg/m³`);

  const now = new Date();
  const nextUpdate = new Date(now.getTime() + UPDATE_INTERVAL_MINUTES * 60_000);

  // ── Pollutant concentrations: prefer Open-Meteo (model data, µg/m³)
  // CO from Open-Meteo is in µg/m³, convert to mg/m³ for display
  const coUgm3  = meteo.current.carbon_monoxide;  // e.g. 508 µg/m³
  const coMgm3  = +(coUgm3 / 1000).toFixed(2);     // e.g. 0.51 mg/m³

  const pm25Val = meteo.current.pm2_5;
  const pm10Val = meteo.current.pm10;
  const no2Val  = meteo.current.nitrogen_dioxide;
  const so2Val  = meteo.current.sulphur_dioxide;
  const o3Val   = meteo.current.ozone;

  // ── Sub-indices for pollutant category badges
  const pm25Sub = calcPm25SubIndex(pm25Val);
  const pm10Sub = calcPm10SubIndex(pm10Val);
  const no2Sub  = calcNo2SubIndex(no2Val);
  const so2Sub  = calcSo2SubIndex(so2Val);
  const o3Sub   = calcO3SubIndex(o3Val);
  // CO Indian AQI sub-index (mg/m³ breakpoints: 1=50, 2=100, 10=200, 17=300, 34=400)
  const coSub   = coMgm3 <= 1 ? linear(0,50,0,1,coMgm3)
                : coMgm3 <= 2 ? linear(51,100,1,2,coMgm3)
                : coMgm3 <= 10 ? linear(101,200,2,10,coMgm3)
                : coMgm3 <= 17 ? linear(201,300,10,17,coMgm3)
                : coMgm3 <= 34 ? linear(301,400,17,34,coMgm3)
                : linear(401,500,34,50,Math.min(coMgm3,50));

  // ── Build forecast array (next 48 hours from now)
  const times  = meteo.hourly.time;
  // Shift to India Standard Time (UTC+5:30) to generate correct local ISO string for comparison with Open-Meteo times
  const localTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const nowIso = localTime.toISOString().slice(0, 13);
  const hourly = times
    .map((t, i) => ({
      time: t + '+05:30', // Append the Kolkata offset to make it a fully qualified ISO 8601 string
      pm25: meteo.hourly.pm2_5[i] ?? null,
      pm10: meteo.hourly.pm10[i] ?? null,
      no2:  meteo.hourly.nitrogen_dioxide[i] ?? null,
      o3:   meteo.hourly.ozone[i] ?? null,
      so2:  meteo.hourly.sulphur_dioxide[i] ?? null,
      co:   meteo.hourly.carbon_monoxide[i] !== undefined && meteo.hourly.carbon_monoxide[i] !== null
            ? +(meteo.hourly.carbon_monoxide[i] / 1000).toFixed(2)
            : null,
    }))
    // Only keep hours from current hour onward (skip past hours), limited to the next 24 hours
    .filter(h => h.time.slice(0, 13) >= nowIso)
    .slice(0, 24);

  // ── Assemble final JSON
  const output = {
    meta: {
      generated_at:    now.toISOString(),
      next_update_at:  nextUpdate.toISOString(),
      sources:         ['WAQI', 'Open-Meteo'],
      location: {
        name:    'Patna',
        state:   'Bihar',
        country: 'India',
        lat:     PATNA_LAT,
        lon:     PATNA_LON,
      },
    },
    current: {
      aqi:                waqi.aqi,
      category:           getAqiCategory(waqi.aqi),
      dominant_pollutant: waqi.dominentpol ?? 'pm25',
      station: {
        name:    waqi.city.name,
        waqi_id: waqi.idx,
      },
      pollutants: [
        { id: 'pm25', display_name: 'PM2.5', value: +pm25Val.toFixed(1), unit: 'µg/m³', category: getPollutantCategory(pm25Sub) },
        { id: 'pm10', display_name: 'PM10',  value: +pm10Val.toFixed(1), unit: 'µg/m³', category: getPollutantCategory(pm10Sub) },
        { id: 'no2',  display_name: 'NO₂',   value: +no2Val.toFixed(1),  unit: 'µg/m³', category: getPollutantCategory(no2Sub)  },
        { id: 'so2',  display_name: 'SO₂',   value: +so2Val.toFixed(1),  unit: 'µg/m³', category: getPollutantCategory(so2Sub)  },
        { id: 'co',   display_name: 'CO',    value: coMgm3,              unit: 'mg/m³', category: getPollutantCategory(coSub)   },
        { id: 'o3',   display_name: 'O₃',    value: +o3Val.toFixed(1),   unit: 'µg/m³', category: getPollutantCategory(o3Sub)   },
      ],
    },
    forecast: { hourly },
  };

  // ── Write to public/data/aqi.json
  const outPath = join(__dirname, '../../public/data/aqi.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Written to ${outPath}`);
  console.log(`AQI: ${output.current.aqi} (${output.current.category}) | Station: ${output.current.station.name}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
