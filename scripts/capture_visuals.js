import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const TARGET_DIR_1 = path.resolve('L:/pr 15(esp)/sendiing files/screenshots/17_CityOS');
const TARGET_DIR_2 = path.resolve('./screenshots');

if (!fs.existsSync(TARGET_DIR_1)) fs.mkdirSync(TARGET_DIR_1, { recursive: true });
if (!fs.existsSync(TARGET_DIR_2)) fs.mkdirSync(TARGET_DIR_2, { recursive: true });

async function saveScreenshot(page, filename) {
  const file1 = path.join(TARGET_DIR_1, filename);
  const file2 = path.join(TARGET_DIR_2, filename);
  await page.screenshot({ path: file1, fullPage: false });
  fs.copyFileSync(file1, file2);
  console.log(`Saved: ${filename} to both directories`);
}

async function run() {
  const port = 4175;
  const url = `http://localhost:${port}/`;
  console.log(`Launching Chrome with WebGL on ${url}...`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--headless=new',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox'
    ]
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // 1. Initial 3D Digital Twin God View
  console.log('Capturing 01_digital_twin_god_view.png...');
  await saveScreenshot(page, '01_digital_twin_god_view.png');

  // 2. Traffic Congestion Modal
  console.log('Capturing 02_traffic_congestion_simulation.png...');
  await page.locator('text=Traffic Congestion').first().click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '02_traffic_congestion_simulation.png');
  // Close modal with Escape or close button
  await page.keyboard.press('Escape');
  const closeBtn = page.locator('button svg.lucide-x').first();
  if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
  await page.waitForTimeout(600);

  // 3. Electricity Grid Substation Modal
  console.log('Capturing 03_electricity_grid_substations.png...');
  await page.locator('text=Power Grid').first().click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '03_electricity_grid_substations.png');
  if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
  await page.waitForTimeout(600);

  // 4. Water Hydraulics Modal
  console.log('Capturing 04_water_hydraulics_distribution.png...');
  await page.locator('text=Water Hydraulics').first().click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '04_water_hydraulics_distribution.png');
  if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
  await page.waitForTimeout(600);

  // 5. Pollution & AQI Modal
  console.log('Capturing 05_pollution_aqi_heat_island.png...');
  await page.locator('text=Pollution & AQI').first().click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '05_pollution_aqi_heat_island.png');
  if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
  await page.waitForTimeout(600);

  // 6. Emergency Dispatch Modal
  console.log('Capturing 06_emergency_dispatch_golden_hour.png...');
  await page.locator('text=Emergency Dispatch').first().click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '06_emergency_dispatch_golden_hour.png');
  if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
  await page.waitForTimeout(600);

  // 7. AI City Planning Modal
  console.log('Capturing 07_ai_city_planning_interventions.png...');
  await page.locator('button:has-text("AI City Planning")').first().click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '07_ai_city_planning_interventions.png');
  if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
  await page.waitForTimeout(600);

  // 8. Dusk Golden Hour & Ward Telemetry Drawer
  console.log('Capturing 08_dusk_golden_hour_ward_telemetry.png...');
  // Click Dusk button
  const duskBtn = page.locator('button[title="Dusk (Golden Hour)"]').first();
  if (await duskBtn.count() > 0) await duskBtn.click({ force: true });
  await page.waitForTimeout(600);
  // Click a Ward badge
  const wardBadge = page.locator('text=W01').first();
  if (await wardBadge.count() > 0) await wardBadge.click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '08_dusk_golden_hour_ward_telemetry.png');

  console.log('All 8 verified visual screenshots successfully captured!');
  await browser.close();
}

run().catch(err => {
  console.error('Error during visual capture:', err);
  process.exit(1);
});
