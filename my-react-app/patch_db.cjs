const fs = require('fs');

const path = 'c:/Users/adhar/OneDrive/Desktop/WEB/my-react-app/src/db.js';
let content = fs.readFileSync(path, 'utf8');

const newP3M1 = `
  "p3m1": {
    "title": "3.1 Servos & Motors",
    "phase": "PHASE 3: Actuation & Sensors",
    "isCapstone": false,
    "overview": {
      "hook": "Making physical moves. Controlling a servo motor's exact angle using code.",
      "concept": "Unlike standard DC motors that spin continuously, Servos use an internal potentiometer and control circuit to lock into a precise angle (0 to 180 degrees) based on a specific PWM signal.",
      "difficulty": "Intermediate",
      "buildTime": "15 mins",
      "simulation": "m9"
    },
    "parts": [
      {
        "category": "Component",
        "name": "SG90 Servo",
        "quantity": 1,
        "why": "Position-controlled motor."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Wiring",
        "instruction": "Brown wire to GND. Red wire to 3V3. Orange (Signal) wire to GPIO 13."
      },
      {
        "number": 2,
        "title": "Upload",
        "instruction": "Upload the Servo sweep sketch."
      }
    ],
    "whatYouWillObserve": "The servo arm will sweep back and forth precisely from 0 degrees to 180 degrees.",
    "troubleshooting": [
      {
        "q": "The ESP32 keeps restarting when the servo moves.",
        "a": "Servos pull a lot of current. Your USB port might not be providing enough power. Ensure a solid connection."
      }
    ],
    "code": {
      "filename": "Sweep.ino",
      "snippet": "#include <ESP32Servo.h>\\n\\nServo myServo;\\nint servoPin = 13;\\n\\nvoid setup() {\\n  myServo.attach(servoPin);\\n}\\n\\nvoid loop() {\\n  for (int pos = 0; pos <= 180; pos += 1) {\\n    myServo.write(pos);\\n    delay(15);\\n  }\\n  for (int pos = 180; pos >= 0; pos -= 1) {\\n    myServo.write(pos);\\n    delay(15);\\n  }\\n}",
      "breakdown": [
        {
          "line": 1,
          "desc": "Requires the ESP32Servo library from the Library Manager."
        },
        {
          "line": 7,
          "desc": "Links the Servo object to GPIO 13."
        },
        {
          "line": 12,
          "desc": "Commands the motor gear to turn to the specified angle."
        }
      ]
    }
  },
`;

const newP3M2 = `
  "p3m2": {
    "title": "3.2 OLED Displays",
    "phase": "PHASE 3: Actuation & Sensors",
    "isCapstone": false,
    "overview": {
      "hook": "Wiring up a tiny TV screen using only two data wires.",
      "concept": "I2C (Inter-Integrated Circuit) is a communication bus that allows multiple devices to share just two pins (SDA and SCL) by using unique digital addresses, like mailboxes on a street.",
      "difficulty": "Intermediate",
      "buildTime": "20 mins",
      "simulation": "m7"
    },
    "parts": [
      {
        "category": "Component",
        "name": "0.96 OLED Display",
        "quantity": 1,
        "why": "Visual output screen."
      },
      {
        "category": "Microcontroller",
        "name": "ESP32 Dev Board",
        "quantity": 1,
        "why": "I2C Master controller."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Library Install",
        "instruction": "Install Adafruit GFX and Adafruit SSD1306 via the Arduino Library Manager."
      },
      {
        "number": 2,
        "title": "I2C Wiring",
        "instruction": "Connect OLED VCC to 3V3, GND to GND. Connect SDA to GPIO 21, and SCL to GPIO 22."
      },
      {
        "number": 3,
        "title": "Upload",
        "instruction": "Upload the OLED test sketch."
      }
    ],
    "whatYouWillObserve": "The screen will wake up and display text or graphics. You just communicated a complex pixel map over a tiny two-wire highway!",
    "troubleshooting": [
      {
        "q": "The screen is completely black.",
        "a": "Check your I2C address in code. Some screens are 0x3C, others are 0x3D."
      }
    ],
    "code": {
      "filename": "OLED_Test.ino",
      "snippet": "#include <Wire.h>\\n#include <Adafruit_GFX.h>\\n#include <Adafruit_SSD1306.h>\\n\\n#define SCREEN_WIDTH 128\\n#define SCREEN_HEIGHT 64\\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);\\n\\nvoid setup() {\\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\\n  display.clearDisplay();\\n  display.setTextSize(2);\\n  display.setTextColor(WHITE);\\n  display.setCursor(10, 10);\\n  display.println(\\"Hello IoT\\");\\n  display.display();\\n}\\n\\nvoid loop() {}",
      "breakdown": [
        {
          "line": 7,
          "desc": "Initializes the display object using hardware I2C (&Wire)."
        },
        {
          "line": 10,
          "desc": "Boots the screen using the specific hex address 0x3C."
        },
        {
          "line": 16,
          "desc": "Pushes the rendering buffer to the physical screen."
        }
      ]
    }
  },
`;

const newP3M3 = `
  "p3m3": {
    "title": "3.3 Environmental Sensing",
    "phase": "PHASE 3: Actuation & Sensors",
    "isCapstone": false,
    "overview": {
      "hook": "Reading the real world. Detect temperature and humidity using the DHT11 sensor.",
      "concept": "The DHT11 uses a capacitive humidity sensor and a thermistor. It converts analog values internally and sends them to the ESP32 as a digital data stream over a single wire.",
      "difficulty": "Intermediate",
      "buildTime": "15 mins",
      "simulation": "m8"
    },
    "parts": [
      {
        "category": "Component",
        "name": "DHT11 Sensor",
        "quantity": 1,
        "why": "Measures temp & humidity."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Library Install",
        "instruction": "Install 'DHT sensor library' by Adafruit via the Arduino Library Manager."
      },
      {
        "number": 2,
        "title": "Wiring",
        "instruction": "Connect VCC to 3V3, GND to GND, and Data to GPIO 4."
      },
      {
        "number": 3,
        "title": "Upload",
        "instruction": "Upload the DHT test sketch."
      }
    ],
    "whatYouWillObserve": "The Serial Monitor will display the current temperature and humidity. Try breathing on the sensor to see the humidity spike!",
    "troubleshooting": [
      {
        "q": "It prints 'Failed to read from DHT sensor!'",
        "a": "Check your wiring and ensure you've defined the correct DHTPIN in your code."
      }
    ],
    "code": {
      "filename": "DHT_Reader.ino",
      "snippet": "#include <DHT.h>\\n\\n#define DHTPIN 4\\n#define DHTTYPE DHT11\\n\\nDHT dht(DHTPIN, DHTTYPE);\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  dht.begin();\\n}\\n\\nvoid loop() {\\n  delay(2000);\\n  float h = dht.readHumidity();\\n  float t = dht.readTemperature();\\n\\n  if (isnan(h) || isnan(t)) {\\n    Serial.println(\\"Failed to read from DHT sensor!\\");\\n    return;\\n  }\\n\\n  Serial.print(\\"Humidity: \\");\\n  Serial.print(h);\\n  Serial.print(\\"%  Temperature: \\");\\n  Serial.print(t);\\n  Serial.println(\\"C\\");\\n}",
      "breakdown": [
        {
          "line": 6,
          "desc": "Instantiates the DHT object on GPIO 4, specifying it's a DHT11 model."
        },
        {
          "line": 14,
          "desc": "The DHT11 is slow. It requires at least a 2-second delay between reads."
        },
        {
          "line": 18,
          "desc": "Checks if the returned value is 'Not a Number', indicating a read failure."
        }
      ]
    }
  },
`;

const newP3M4 = `
  "p3m4": {
    "title": "3.4 Relay Power Control",
    "phase": "PHASE 3: Actuation & Sensors",
    "isCapstone": false,
    "overview": {
      "hook": "Using a 3.3V digital signal to safely switch high-power devices on and off.",
      "concept": "A relay is an electromechanical switch. When we send a tiny 3.3V signal to the coil, it creates a magnetic field that physically pulls a metal contact shut, allowing larger voltages to flow on a completely isolated circuit.",
      "difficulty": "Intermediate",
      "buildTime": "20 mins",
      "simulation": "m10"
    },
    "parts": [
      {
        "category": "Component",
        "name": "Single Channel Relay Module",
        "quantity": 1,
        "why": "Isolated power switch."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Wiring the Control",
        "instruction": "Connect Relay VCC to 5V (or VIN), GND to GND, and IN to GPIO 26."
      },
      {
        "number": 2,
        "title": "Upload Code",
        "instruction": "Upload a basic Blink sketch, but change the output pin to GPIO 26."
      },
      {
        "number": 3,
        "title": "Listen",
        "instruction": "You should hear a physical *CLICK* every second as the internal electromagnet engages."
      }
    ],
    "whatYouWillObserve": "The relay will click rhythmically. You are now controlling a switch capable of handling high power using your low-power ESP32.",
    "troubleshooting": [
      {
        "q": "It doesn't click.",
        "a": "Some relay modules require 5V to energize the coil. Ensure your ESP32 has a 5V/VIN pin and use that for the Relay VCC."
      }
    ],
    "code": {
      "filename": "RelayTest.ino",
      "snippet": "const int relayPin = 26;\\n\\nvoid setup() {\\n  pinMode(relayPin, OUTPUT);\\n}\\n\\nvoid loop() {\\n  digitalWrite(relayPin, HIGH); // Engages coil\\n  delay(2000);\\n  digitalWrite(relayPin, LOW);  // Releases coil\\n  delay(2000);\\n}",
      "breakdown": [
        {
          "line": 8,
          "desc": "Sends 3.3V to the relay transistor, which energizes the electromagnet and pulls the switch closed."
        }
      ]
    }
  },
`;

const newP3CapCode = `
    "code": {
      "filename": "DesktopRadar.ino",
      "snippet": "#include <ESP32Servo.h>\\n#include <Wire.h>\\n#include <Adafruit_GFX.h>\\n#include <Adafruit_SSD1306.h>\\n\\n#define SCREEN_WIDTH 128\\n#define SCREEN_HEIGHT 64\\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);\\n\\nServo myServo;\\nconst int trigPin = 5;\\nconst int echoPin = 18;\\n\\nvoid setup() {\\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\\n  myServo.attach(13);\\n  pinMode(trigPin, OUTPUT);\\n  pinMode(echoPin, INPUT);\\n}\\n\\nvoid loop() {\\n  for (int angle = 0; angle <= 180; angle += 5) {\\n    scan(angle);\\n  }\\n  for (int angle = 180; angle >= 0; angle -= 5) {\\n    scan(angle);\\n  }\\n}\\n\\nvoid scan(int angle) {\\n  myServo.write(angle);\\n  delay(30);\\n\\n  digitalWrite(trigPin, LOW);\\n  delayMicroseconds(2);\\n  digitalWrite(trigPin, HIGH);\\n  delayMicroseconds(10);\\n  digitalWrite(trigPin, LOW);\\n  \\n  long duration = pulseIn(echoPin, HIGH);\\n  long distance = duration * 0.034 / 2;\\n\\n  display.clearDisplay();\\n  display.setTextSize(1);\\n  display.setTextColor(WHITE);\\n  display.setCursor(0,0);\\n  display.print(\\"Angle: \\"); display.print(angle);\\n  display.setCursor(0,10);\\n  display.print(\\"Dist: \\"); display.print(distance); display.print(\\" cm\\");\\n  display.display();\\n}",
      "breakdown": [
        {
          "line": 21,
          "desc": "Sweeps the servo in 5-degree increments to scan the room."
        },
        {
          "line": 39,
          "desc": "Calculates the distance to the nearest object using the ultrasonic echo."
        },
        {
          "line": 48,
          "desc": "Updates the OLED screen dynamically as the radar sweeps."
        }
      ]
    }
`;

const newP4CapCode = `
    "code": {
      "filename": "SmartHomeHub.ino",
      "snippet": "#include <WiFi.h>\\n#include <WebServer.h>\\n#include <DHT.h>\\n#include <Wire.h>\\n#include <Adafruit_GFX.h>\\n#include <Adafruit_SSD1306.h>\\n\\nconst char* ssid = \\"YOUR_HOME_WIFI\\";\\nconst char* password = \\"YOUR_PASSWORD\\";\\n\\nWebServer server(80);\\nDHT dht(4, DHT11);\\nAdafruit_SSD1306 display(128, 64, &Wire, -1);\\nconst int relayPin = 26;\\nbool relayState = false;\\nfloat temp = 0.0;\\n\\nvoid setup() {\\n  pinMode(relayPin, OUTPUT);\\n  dht.begin();\\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\\n  \\n  WiFi.begin(ssid, password);\\n  while (WiFi.status() != WL_CONNECTED) delay(500);\\n\\n  server.on(\\"/\\", []() {\\n    temp = dht.readTemperature();\\n    String html = \\"<h1>Smart Hub</h1><p>Temp: \\" + String(temp) + \\" C</p>\\";\\n    html += \\"<a href='/toggle'><button>Toggle Relay</button></a>\\";\\n    server.send(200, \\"text/html\\", html);\\n  });\\n\\n  server.on(\\"/toggle\\", []() {\\n    relayState = !relayState;\\n    digitalWrite(relayPin, relayState ? HIGH : LOW);\\n    server.sendHeader(\\"Location\\", \\"/\\");\\n    server.send(303);\\n  });\\n\\n  server.begin();\\n}\\n\\nvoid loop() {\\n  server.handleClient();\\n  \\n  display.clearDisplay();\\n  display.setCursor(0,0);\\n  display.setTextColor(WHITE);\\n  display.print(\\"IP: \\"); display.println(WiFi.localIP());\\n  display.print(\\"Temp: \\"); display.print(temp);\\n  display.print(\\" C\\\\nRelay: \\"); display.println(relayState ? \\"ON\\" : \\"OFF\\");\\n  display.display();\\n}",
      "breakdown": [
        {
          "line": 23,
          "desc": "Connects to your local home network instead of creating a standalone access point."
        },
        {
          "line": 26,
          "desc": "Generates a dashboard showing live temperature and providing a button to control the physical relay."
        },
        {
          "line": 36,
          "desc": "Uses a 303 Redirect to return the user to the main dashboard immediately after toggling the relay."
        },
        {
          "line": 44,
          "desc": "Displays the local IP address on the OLED so you know what URL to type into your browser."
        }
      ]
    }
`;

// Extract everything before p3m1
const prefixIdx = content.indexOf('"p3m1":');
const prefix = content.slice(0, prefixIdx);

// Extract p4m1 and onwards (we don't touch p4m1, p4m2, p4m3)
const suffixIdx = content.indexOf('"p4m1":');
const suffix = content.slice(suffixIdx);

const newMiddle = newP3M1 + newP3M2 + newP3M3 + newP3M4 + `
  "p3cap": {
    "title": "Capstone: Desktop Radar",
    "phase": "PHASE 3: Actuation & Sensors",
    "isCapstone": true,
    "overview": {
      "hook": "Mount the Ultrasonic sensor onto the Servo motor and map the environment to the OLED screen.",
      "concept": "You will combine PWM servos, timing pulses, and I2C displays into a single cohesive project. The servo will sweep, the sensor will ping, and the screen will plot.",
      "difficulty": "Master",
      "buildTime": "60 mins"
    },
    "parts": [
      {
        "category": "Component",
        "name": "HC-SR04",
        "quantity": 1,
        "why": "Distance scanner."
      },
      {
        "category": "Component",
        "name": "SG90 Servo",
        "quantity": 1,
        "why": "Scanner panning mount."
      },
      {
        "category": "Component",
        "name": "0.96 OLED",
        "quantity": 1,
        "why": "Radar visualizer."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Hardware Mount",
        "instruction": "Use tape or hot glue to secure the HC-SR04 on top of the Servo horn."
      },
      {
        "number": 2,
        "title": "Wiring",
        "instruction": "Wire the I2C OLED, the HC-SR04 to GPIO 5 and 18, and the Servo to GPIO 13."
      },
      {
        "number": 3,
        "title": "Software Integration",
        "instruction": "Combine the servo sweep loop with the pulseIn calculation."
      }
    ],
    "whatYouWillObserve": "The servo will pan back and forth. If it detects an object close by, it can halt, beep a buzzer, or display the object coordinate on the OLED.",
    "troubleshooting": [
      {
        "q": "The servo twitches heavily.",
        "a": "You have power sag. Try using a separate power rail or decoupling capacitor across 3V3 and GND."
      }
    ],
` + newP3CapCode + `
  },
`;

const updatedContent = prefix + newMiddle + suffix;

// Now we need to inject the p4cap code into the suffix part
const p4CapPrefixIdx = updatedContent.lastIndexOf('"troubleshooting": [');
const p4CapEndIdx = updatedContent.lastIndexOf('}');
// Find the exact closing brace of troubleshooting for p4cap
const troubleshootingEndIdx = updatedContent.indexOf(']', p4CapPrefixIdx) + 1;

const finalContent = updatedContent.slice(0, troubleshootingEndIdx) + ",\n" + newP4CapCode + "\n" + updatedContent.slice(troubleshootingEndIdx);

fs.writeFileSync(path, finalContent);
console.log("SUCCESS");
