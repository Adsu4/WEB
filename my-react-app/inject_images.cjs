const fs = require('fs');

const componentImages = {
  'ESP32 Development Board': 'https://robukits.in/static/uploads/esp32devkit1.png',
  'Breadboard': 'https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/breadboard-840-tie-point-500x500-removebg-preview.png',
  'Jumper Wires': 'https://robocraze.com/cdn/shop/files/3_Male_to_Female_Jumper_Wires_20cm_20pcs_1000x.png?v=1758691490',
  '0.96" OLED Display': 'https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/ChatGPT_Image_Jun_8__2026__01_20_57_AM-removebg-preview.png',
  'DHT11 Sensor': 'https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/DHT11_Humidity_Temperature_Sensor_Module_1000x.jpg',
  'Ultrasonic Sensor (HC-SR04)': 'https://www.kitkraft.in/cdn/shop/files/ultrasonic_sensor_3_e3673ef4-1f94-4979-be20-213ccbe626b4.png?v=1752597803',
  'IR Sensor': 'https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/i/r/ir-sensor-module-line-following.jpg',
  'LDR (Light Sensor)': 'https://www.sunrobotics.in/cdn/shop/files/LDR-module-1_60b4d653-45a9-4e6f-83f5-d8877c29bbcb_1920x.png?v=1746160216',
  'Active Buzzer': 'https://robu.in/_next/image/?url=https%3A%2F%2Frobu-prod-media.s3.ap-south-1.amazonaws.com%2Fuploads%2F2024%2F10%2FActive-Buzzer.png&w=1920&q=90',
  'SG90 Servo Motor': 'https://robukits.in/static/uploads/sg90.png',
  '5V Relay': 'https://5.imimg.com/data5/SELLER/Default/2020/11/FK/WK/OH/15458098/5v-relay-module-500x500.jpg',
  'Push Buttons': 'https://projectpoint.in/image/cache/catalog/button_12mm-800x800.jpg',
  'LEDs': 'https://dynokart.in/wp-content/uploads/2018/08/3mm-led-1.jpg',
  'Resistors': 'https://5.imimg.com/data5/SELLER/Default/2023/12/369621363/DH/RH/UO/21085075/resistors-th-and-smd.jpg',
  'Capacitors': 'https://www.codrey.com/wp-content/uploads/2019/01/Capcitors.jpg',
  'Potentiometer': 'https://robodo.in/cdn/shop/products/51mNAteWA9L.jpg?v=1672847436',
  'BC547 transistors': 'https://robukits.in/static/uploads/bc547_2.png',
  '555 Timer IC': 'https://5.imimg.com/data5/SELLER/Default/2020/11/SW/FE/YR/15458098/555-timer-ic.png',
  'USB Cable': 'https://rukmini1.flixcart.com/image/1500/1500/xif0q/data-cable/micro-usb-cable/7/9/l/15w-micro-usb-cable-for-super-fast-charge-treams-original-imahgmeeq4ttrahz.jpeg?q=70'
};

let code = fs.readFileSync('src/App.jsx', 'utf8');

for (const [name, url] of Object.entries(componentImages)) {
  // We need to match the placehold.co string
  const encodedName = encodeURIComponent(name).replace(/'/g, "\\'"); // escape single quotes if needed
  
  // Try matching \`https://placehold.co/800x400/png?text=\${encodeURIComponent('name')}\`
  // Sometimes it's hardcoded as text: https://placehold.co/800x400/png?text=name
  // And sometimes it uses backticks and encodeURIComponent.
  
  // Since we know what it looks like, let's just replace any img src that is a placeholder inside that component block.
  // We can just find the block for the component:
  // "componentName === 'name' ? (" and the next "<img src="
  
  const blockStartStr = `componentName === '${name}'`;
  const blockStartIdx = code.indexOf(blockStartStr);
  
  if (blockStartIdx !== -1) {
    const imgStartIdx = code.indexOf('<img src=', blockStartIdx);
    if (imgStartIdx !== -1 && imgStartIdx < blockStartIdx + 1000) { // Should be soon after
      const nextEndImg = code.indexOf(' alt=', imgStartIdx);
      if (nextEndImg !== -1) {
        const oldSrc = code.substring(imgStartIdx, nextEndImg);
        // Replace it!
        code = code.substring(0, imgStartIdx) + `<img src="${url}"` + code.substring(nextEndImg);
        console.log('Updated image for', name);
      }
    }
  }
}

fs.writeFileSync('src/App.jsx', code);
