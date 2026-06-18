// ── SYSTEM CONFIGURATION ─────────────────────────────────────────────
// Change this:
const OR_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OR_MODEL = 'deepseek/deepseek-chat';

const PROJ_SYSTEM = `You are an expert hardware maker and IoT mentor with the personality of a confident technical YouTuber — think GreatScott! meets The Engineering Mindset. You talk to makers like a knowledgeable friend.

HARD RULES:
1. Always design around the ESP32 development board. That is the only microcontroller.
2. The AI system MUST try its level best to curate the whole step-by-step answer with the minimum number of external components. Prioritize using ONLY components from the user's kit: ESP32 Development Board, 0.96 inch OLED Display, DHT11 (Temp/Humidity) Sensor, Ultrasonic Sensor (HC-SR04), IR Sensor, LDR (Light Sensor), Active Buzzer, SG90 Servo Motor, 555 Timer IC, BC547 Transistors, Potentiometer (10k), Push Buttons, Breadboard, Jumper Wires (M-M, M-F, F-F), LEDs (Single Colors & RGB), Capacitors & Resistors Set, Single channel relay, micro USB cable.
3. While the step-by-step answer tries its best to keep components limited to the kit, it's okay if it mentions things not included in the kit, but it MUST be clearly mentioned that the component should be externally sourced from somewhere and is not present in the kit. If an idea ABSOLUTELY requires a component outside this kit, you MUST flag it in the "why" field by starting with "[EXTERNAL]" and clearly state it needs to be sourced externally.
4. Return ONLY a raw JSON object. Zero markdown fences. Zero preamble. Zero explanation. Just the JSON.
5. All code must be real, working Arduino C++ (no pseudocode).

Return exactly this JSON shape:
{
  "overview": {
    "hook": "Punchy 1-sentence hook",
    "concept": "2-3 sentences explaining the core engineering concept (e.g., how PWM fakes analog, or how a voltage divider works).",
    "difficulty": "Beginner | Intermediate | Advanced | Master",
    "buildTime": "Estimated time (e.g., '20 mins')"
  },
  "parts": [
    { "category": "Component/Microcontroller/Cable", "name": "Name", "quantity": 1, "why": "1-sentence reason why it is needed" }
  ],
  "steps": [
    { 
      "number": 1, 
      "title": "Action-oriented title", 
      "instruction": "Clear, direct instruction.", 
      "proTip": "Optional tip for this specific step",
      "sanityCheck": "Optional check to ensure they didn't mess up"
    }
  ],
  "whatYouWillObserve": "1-2 sentences describing exactly what happens when they power it on.",
  "troubleshooting": [
    { "q": "Common issue symptom?", "a": "Direct solution." }
  ],
  "code": {
    "filename": "Main.ino",
    "snippet": "const int pin = 2;\nvoid setup() { ...",
    "breakdown": [
      { "line": 2, "desc": "Explanation of what line 2 does." }
    ]
  }
}`;

export const LESSONS = {
  "gz1": {
    "title": "0.1 The Language of Electricity (V, I, R)",
    "phase": "GROUND ZERO: Before You Build",
    "isCapstone": false,
    "overview": {
      "hook": "Voltage is the push, Current is the flow, Resistance is the squeeze. Let's learn why plugging an LED directly into a battery causes it to pop.",
      "concept": "Before touching any hardware, you need to build a mental model of electricity. Think of it like water in a pipe: voltage is the pump pressure, current is the water flow, and resistance is the width of the pipe.",
      "difficulty": "Beginner",
      "buildTime": "10 mins"
    },
    "parts": [],
    "steps": [
      {
        "number": 1,
        "title": "Voltage (V)",
        "instruction": "Imagine a water tank connected to a hose. The height of the water tank creates pressure. In electricity, this pressure is called Voltage."
      },
      {
        "number": 2,
        "title": "Current (I)",
        "instruction": "The water actually flowing through the hose is the Current. This is the volume of electricity moving through the wire."
      },
      {
        "number": 3,
        "title": "Resistance (R)",
        "instruction": "If you step on the hose, you restrict the flow. This is Resistance. Components like Resistors are designed to specifically restrict flow."
      },
      {
        "number": 4,
        "title": "Ohm's Law",
        "instruction": "V = I * R. This means that if you increase the pressure (Voltage) without increasing resistance, the flow (Current) gets stronger.",
        "sanityCheck": "If resistance drops to zero, current skyrockets to infinity. This is a short circuit!"
      },
      {
        "number": 5,
        "title": "Why LEDs Pop",
        "instruction": "Electronic components like LEDs are like fragile water balloons. If the pressure (Voltage) is too high and there's no resistance to slow the flow, the LED bursts."
      }
    ],
    "whatYouWillObserve": "You will understand the fundamental relationship between Voltage, Current, and Resistance, ensuring you never accidentally burn out your components.",
    "troubleshooting": [
      {
        "q": "Why did my LED pop?",
        "a": "You likely provided too much voltage (pressure) without using a resistor to restrict the current (flow)."
      },
      {
        "q": "Can I get shocked by 3.3V?",
        "a": "No! 3.3 Volts is a very low 'pressure'. It's perfectly safe to touch with your bare hands."
      }
    ],
    "simulation": "plumbing"
  },
  "gz2": {
    "title": "0.2 Breadboard Internal Mechanics",
    "phase": "GROUND ZERO: Before You Build",
    "isCapstone": false,
    "overview": {
      "hook": "Destroying the 'magic grid' misconception. Breadboards are just rows of hidden metal clips.",
      "concept": "A breadboard isn't a complex circuit—it's just a way to connect wires without soldering. The holes you see are connected under the plastic by long strips of copper.",
      "difficulty": "Beginner",
      "buildTime": "5 mins"
    },
    "parts": [],
    "steps": [
      {
        "number": 1,
        "title": "The Power Rails",
        "instruction": "Look at your breadboard. You will see two long strips running down the sides (red and blue). These are connected vertically to supply electricity to the whole board."
      },
      {
        "number": 2,
        "title": "The Terminal Strips",
        "instruction": "In the middle, there are two banks of horizontal rows, numbered 1 to 30. The 5 holes in each horizontal row (A-B-C-D-E) are connected together by a hidden metal clip."
      },
      {
        "number": 3,
        "title": "Making Connections",
        "instruction": "If you plug two wires into the exact same horizontal row (e.g., hole A1 and hole C1), they are physically touching each other under the plastic.",
        "proTip": "Always double-check your row numbers!"
      },
      {
        "number": 4,
        "title": "The Middle Ravine",
        "instruction": "The gap in the middle separates the left and right banks. They are completely disconnected. We place chips across this gap so their left pins don't short-circuit with their right pins."
      }
    ],
    "whatYouWillObserve": "You will mentally 'see through' the plastic of the breadboard to understand exactly how holes are wired together internally.",
    "troubleshooting": [
      {
        "q": "Why isn't my circuit working?",
        "a": "Double-check your rows. Components must share the exact same row number to be connected."
      },
      {
        "q": "Does a component cross the middle ravine?",
        "a": "The middle gap separates the left and right sides. If you plug a chip across the gap, its left pins won't short-circuit with its right pins."
      }
    ],
    "simulation": "xray_breadboard"
  },
  "gz3": {
    "title": "0.3 Reading Resistors",
    "phase": "GROUND ZERO: Before You Build",
    "isCapstone": false,
    "overview": {
      "hook": "How to read color bands so you never mix up a 220Ω (LED protector) and a 10kΩ (pull-up) resistor.",
      "concept": "Resistors use colored stripes to indicate their value instead of printed numbers. We'll decode these stripes so you can confidently grab the right component every time.",
      "difficulty": "Beginner",
      "buildTime": "15 mins"
    },
    "parts": [],
    "steps": [
      {
        "number": 1,
        "title": "The Tolerance Band",
        "instruction": "Resistors have colored bands. Hold the resistor so the gold or silver band is on the far right. This is the 'tolerance' band."
      },
      {
        "number": 2,
        "title": "The Digits",
        "instruction": "The first two bands represent the first two digits. For example, Red is 2, so Red-Red is 22."
      },
      {
        "number": 3,
        "title": "The Multiplier",
        "instruction": "The third band is the multiplier (how many zeros to add). Brown means 1 zero. So Red-Red-Brown means 22 + one zero = 220 Ohms (Ω).",
        "sanityCheck": "220Ω is your best friend for protecting LEDs."
      },
      {
        "number": 4,
        "title": "The 10k Resistor",
        "instruction": "Brown-Black-Orange means 10 + three zeros = 10,000 Ohms (10kΩ)."
      }
    ],
    "whatYouWillObserve": "You will be able to instantly visually identify the difference between the low-resistance 220Ω resistors and the high-resistance 10kΩ resistors in your kit.",
    "troubleshooting": [
      {
        "q": "The colors are hard to see!",
        "a": "Use your smartphone camera to zoom in, or take a picture with flash. The beige background of the resistor can sometimes make colors look weird."
      },
      {
        "q": "Does direction matter?",
        "a": "No! Resistors don't care which way electricity flows through them. They are non-polarized."
      }
    ],
    "simulation": "resistor_decoder"
  },
  "gz4": {
    "title": "0.4 The Arsenal (Kit Familiarization)",
    "phase": "GROUND ZERO: Before You Build",
    "isCapstone": false,
    "overview": {
      "hook": "Grouping your kit components into logical buckets.",
      "concept": "We classify your parts into four groups: The Brains (Microcontrollers), The Senses (Sensors, Buttons), The Muscles (Motors, OLED, LEDs), and The Glue (Transistors, Wires).",
      "difficulty": "Beginner",
      "buildTime": "15 mins"
    },
    "parts": [],
    "steps": [
      {
        "number": 1,
        "title": "The Brains",
        "instruction": "Find the large black chip with the silver box and Wi-Fi antenna. This is the ESP32. It will act as the master controller for all our projects."
      },
      {
        "number": 2,
        "title": "The Senses",
        "instruction": "Find the input devices: the push buttons, the Light Sensor (LDR), and the Ultrasonic Sensor (the one that looks like WALL-E eyes)."
      },
      {
        "number": 3,
        "title": "The Muscles",
        "instruction": "Find the output devices: the colorful LEDs, the black buzzer cylinder, the tiny blue servo motor, and the OLED screen."
      },
      {
        "number": 4,
        "title": "The Glue",
        "instruction": "Find the jumper wires, the resistors, and the tiny black three-legged transistors. These components connect everything together."
      }
    ],
    "whatYouWillObserve": "You will have a perfectly organized workspace and know exactly what each component looks like before you start building.",
    "troubleshooting": [
      {
        "q": "I'm missing a part!",
        "a": "Some parts are very small. Check the corners of the plastic bags. The resistors are often taped together in a strip."
      }
    ],
    "simulation": "kit_arsenal"
  },
  "p1m1": {
    "title": "1.1 The Basic Loop",
    "phase": "PHASE 1: Pure Hardware",
    "isCapstone": false,
    "overview": {
      "hook": "Wiring an LED and a 220Ω resistor to the ESP32's 3.3V and GND pins. Proving Ohm's Law physically.",
      "concept": "We use the ESP32 strictly as a 3.3V battery. No code allowed. We will physically close a loop of electricity to light an LED safely.",
      "difficulty": "Beginner",
      "buildTime": "15 mins"
      ,
      "simulation": "m1"
    },
    "parts": [
      {
        "category": "Microcontroller",
        "name": "ESP32 Dev Board",
        "quantity": 1,
        "why": "Acts purely as a 3.3V power supply."
      },
      {
        "category": "Component",
        "name": "Red LED",
        "quantity": 1,
        "why": "Visual indicator of current flow."
      },
      {
        "category": "Component",
        "name": "220Ω Resistor",
        "quantity": 1,
        "why": "Drops voltage to protect the LED."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Mount the ESP32",
        "instruction": "Keep the ESP32 off the breadboard. Use Female-to-Male jumper wires to connect the ESP32's pins to the breadboard rows."
      },
      {
        "number": 2,
        "title": "Power Rails",
        "instruction": "Connect a red wire from the '3V3' pin to the red power rail. Connect a black wire from 'GND' to the blue rail."
      },
      {
        "number": 3,
        "title": "The Resistor",
        "instruction": "Plug a 220Ω resistor (Red-Red-Brown) from the red power rail into a blank row (e.g., row 10)."
      },
      {
        "number": 4,
        "title": "The LED",
        "instruction": "Plug the LONG leg (Anode) of the LED into row 10. Plug the SHORT leg (Cathode) into the blue power rail (GND)."
      },
      {
        "number": 5,
        "title": "Power Up",
        "instruction": "Plug the ESP32 into your computer using the USB cable to provide power."
      }
    ],
    "whatYouWillObserve": "The LED will turn on instantly and stay a bright solid red! You have successfully created a complete, unbroken loop for electricity to flow.",
    "troubleshooting": [
      {
        "q": "My LED isn't turning on.",
        "a": "Check the legs! LEDs are polarized. The long leg MUST be connected to the positive side."
      },
      {
        "q": "Is my resistor the right one?",
        "a": "Make sure it's 220Ω (Red-Red-Brown). A 10kΩ resistor will make the LED incredibly dim."
      }
    ],
    "simulation": "m1"
  },
  "p1m2": {
    "title": "1.2 The Analog Valve",
    "phase": "PHASE 1: Pure Hardware",
    "isCapstone": false,
    "overview": {
      "hook": "Introducing the Potentiometer to dynamically control current flow and fade an LED mechanically.",
      "concept": "A potentiometer is an adjustable resistor. By twisting the dial, we change the resistance, altering the current flow to the LED in real-time without code.",
      "difficulty": "Beginner",
      "buildTime": "15 mins"
      ,
      "simulation": "m2"
    },
    "parts": [
      {
        "category": "Component",
        "name": "10k Potentiometer",
        "quantity": 1,
        "why": "Acts as our analog valve to control resistance."
      },
      {
        "category": "Component",
        "name": "Red LED",
        "quantity": 1,
        "why": "Visual indicator of current flow."
      },
      {
        "category": "Component",
        "name": "220Ω Resistor",
        "quantity": 1,
        "why": "Base protection for the LED."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Mount Potentiometer",
        "instruction": "Place the potentiometer on the breadboard so its 3 legs are in separate rows."
      },
      {
        "number": 2,
        "title": "Input Power",
        "instruction": "Connect the left leg of the potentiometer to the red power rail (3.3V)."
      },
      {
        "number": 3,
        "title": "Output Signal",
        "instruction": "Connect the middle leg of the potentiometer to a new row (e.g., row 20)."
      },
      {
        "number": 4,
        "title": "Protect & Light",
        "instruction": "Add a 220Ω resistor from row 20 to row 25. Plug the LED anode into row 25, and cathode to GND."
      },
      {
        "number": 5,
        "title": "Twist the Valve",
        "instruction": "Turn the potentiometer dial back and forth."
      }
    ],
    "whatYouWillObserve": "The LED will smoothly fade from completely off to full brightness depending on the dial position.",
    "troubleshooting": [
      {
        "q": "The LED is always on or always off.",
        "a": "Ensure you are using the middle leg for the output to the LED, not the right leg."
      },
      {
        "q": "It only fades a little bit.",
        "a": "You might have wired the right leg instead of the middle leg."
      }
    ],
    "simulation": "m2"
  },
  "p1m3": {
    "title": "1.3 Physical Logic Gates",
    "phase": "PHASE 1: Pure Hardware",
    "isCapstone": false,
    "overview": {
      "hook": "Building logical AND / OR gates using mechanical push buttons.",
      "concept": "Computers use logic gates to make decisions. Before writing if-statements in code, we can physically build AND logic (series) and OR logic (parallel) using switches.",
      "difficulty": "Intermediate",
      "buildTime": "20 mins"
      ,
      "simulation": "m3"
    },
    "parts": [
      {
        "category": "Component",
        "name": "Push Buttons",
        "quantity": 2,
        "why": "Mechanical switches to build logic."
      },
      {
        "category": "Component",
        "name": "Red LED",
        "quantity": 1,
        "why": "Visual logic output."
      },
      {
        "category": "Component",
        "name": "220Ω Resistor",
        "quantity": 1,
        "why": "LED protection."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Mount Buttons",
        "instruction": "Place two push buttons across the breadboard trench."
      },
      {
        "number": 2,
        "title": "Build AND Logic",
        "instruction": "Connect 3V3 to Button A input. Connect Button A output to Button B input. Connect Button B output to LED anode."
      },
      {
        "number": 3,
        "title": "Protect LED",
        "instruction": "Connect LED cathode via 220Ω resistor to GND. Press both buttons."
      },
      {
        "number": 4,
        "title": "Build OR Logic",
        "instruction": "Now connect 3V3 to BOTH Button A and B inputs. Connect BOTH Button outputs to the LED anode."
      },
      {
        "number": 5,
        "title": "Test OR Logic",
        "instruction": "Press either button to see the LED light up."
      }
    ],
    "whatYouWillObserve": "In series (AND), both buttons must be pressed to light the LED. In parallel (OR), pressing either button completes the circuit.",
    "troubleshooting": [
      {
        "q": "My button doesn't do anything.",
        "a": "Breadboard buttons usually have 4 legs connected in pairs. Make sure you are wiring diagonally across the button."
      }
    ],
    "simulation": "m3"
  },
  "p1m4": {
    "title": "1.4 The Electronic Muscle",
    "phase": "PHASE 1: Pure Hardware",
    "isCapstone": false,
    "overview": {
      "hook": "Using a BC547 Transistor to control a high-power LED using a tiny signal from an LDR.",
      "concept": "A transistor is an electronic switch. A tiny current at its 'Base' allows a massive current to flow from 'Collector' to 'Emitter'. We'll use a light sensor to trigger it.",
      "difficulty": "Advanced",
      "buildTime": "25 mins"
      ,
      "simulation": "m4"
    },
    "parts": [
      {
        "category": "Component",
        "name": "BC547 Transistor",
        "quantity": 1,
        "why": "The electronic switch."
      },
      {
        "category": "Component",
        "name": "LDR (Light Sensor)",
        "quantity": 1,
        "why": "Provides the tiny base signal based on ambient light."
      },
      {
        "category": "Component",
        "name": "White LED",
        "quantity": 1,
        "why": "The high-power load."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Mount Transistor",
        "instruction": "Place the BC547 flat-side facing you. Left is Collector, Middle is Base, Right is Emitter."
      },
      {
        "number": 2,
        "title": "Wire the Load",
        "instruction": "Connect 3V3 to LED Anode. Connect a 220Ω resistor from LED Cathode to the Collector."
      },
      {
        "number": 3,
        "title": "Wire the Emitter",
        "instruction": "Connect the Emitter to GND."
      },
      {
        "number": 4,
        "title": "Wire the Sensor",
        "instruction": "Wire LDR Module VCC to 3V3, and GND to GND. Connect the DO (Digital Out) pin to the Transistor's Base (add a 1kΩ resistor between DO and the Base for safety)."
      },
      {
        "number": 5,
        "title": "Tune and Test",
        "instruction": "Use a tiny screwdriver to twist the blue potentiometer on the LDR module to tune the light sensitivity! Cover the LDR with your finger to test."
      }
    ],
    "whatYouWillObserve": "The transistor acts as an automatic switch. When the LDR is exposed to light, the base gets triggered, and the main LED turns on.",
    "troubleshooting": [
      {
        "q": "The LED is always on.",
        "a": "You may have reversed the Collector and Emitter. Double check the flat-side orientation."
      }
    ],
    "simulation": "m4"
  },
  "p1m5": {
    "title": "1.5 The Heartbeat",
    "phase": "PHASE 1: Pure Hardware",
    "isCapstone": false,
    "overview": {
      "hook": "Introducing the legendary 555 Timer IC to blink an LED without a microcontroller.",
      "concept": "Before software loops existed, engineers used oscillators. The 555 timer IC uses charging and discharging capacitors to create a physical heartbeat.",
      "difficulty": "Expert",
      "buildTime": "30 mins"
    },
    "parts": [
      {
        "category": "Component",
        "name": "555 Timer IC",
        "quantity": 1,
        "why": "The hardware oscillator chip."
      },
      {
        "category": "Component",
        "name": "10uF Capacitor",
        "quantity": 1,
        "why": "Controls the timing speed."
      },
      {
        "category": "Component",
        "name": "Resistors",
        "quantity": 2,
        "why": "Sets the charge/discharge rates."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Mount the IC",
        "instruction": "Place the 555 Timer across the breadboard trench. Note the dot for pin 1."
      },
      {
        "number": 2,
        "title": "Power Pins",
        "instruction": "Connect Pin 8 and 4 to VIN (5V). Connect Pin 1 to GND."
      },
      {
        "number": 3,
        "title": "Timing Circuit",
        "instruction": "Connect Pin 2 to Pin 6. Add the 10uF capacitor from Pin 2 to GND."
      },
      {
        "number": 4,
        "title": "Resistor Network",
        "instruction": "Connect a 10k resistor from Pin 7 to 3V3, and a 100k resistor from Pin 7 to Pin 6."
      },
      {
        "number": 5,
        "title": "Output Load",
        "instruction": "Connect Pin 3 to an LED Anode, and cathode via 220Ω to GND."
      }
    ],
    "whatYouWillObserve": "The LED will blink rhythmically! You have built a hardware clock pulse, completely independent of the ESP32.",
    "troubleshooting": [
      {
        "q": "It's just a solid light.",
        "a": "Check the capacitor polarity. The stripe side must go to GND."
      }
    ],
    "simulation": "m5"
  },
  "p1cap": {
    "title": "Capstone: Vault Alarm",
    "phase": "PHASE 1: Pure Hardware",
    "isCapstone": true,
    "overview": {
      "hook": "Combine the LDR, Transistor, and Buzzer to build a laser tripwire alarm.",
      "concept": "You will integrate everything you learned in Phase 1 into a complete hardware project. An LDR will detect a break in light, triggering a transistor to fire an active buzzer.",
      "difficulty": "Master",
      "buildTime": "45 mins"
    },
    "parts": [
      {
        "category": "Component",
        "name": "Active Buzzer",
        "quantity": 1,
        "why": "The alarm sounder."
      },
      {
        "category": "Component",
        "name": "BC547 Transistor",
        "quantity": 1,
        "why": "The trigger switch."
      },
      {
        "category": "Component",
        "name": "LDR",
        "quantity": 1,
        "why": "The tripwire sensor."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Transistor Setup",
        "instruction": "Mount the BC547. Emitter to GND."
      },
      {
        "number": 2,
        "title": "Buzzer Output",
        "instruction": "Connect VIN (5V) to Buzzer POSITIVE. Connect Buzzer NEGATIVE to Collector."
      },
      {
        "number": 3,
        "title": "Sensor Trigger",
        "instruction": "Wire LDR Module VCC to 3V3, and GND to GND. Connect the DO (Digital Out) pin to the Transistor's Base."
      },
      {
        "number": 4,
        "title": "Calibration",
        "instruction": "Use a flashlight to keep the LDR flooded with light."
      },
      {
        "number": 5,
        "title": "The Tripwire",
        "instruction": "Block the light with your hand. The buzzer should scream."
      }
    ],
    "whatYouWillObserve": "When the light is blocked, the resistance changes, triggering the transistor switch and activating the high-current buzzer alarm purely via hardware logic.",
    "troubleshooting": [
      {
        "q": "The buzzer sounds weird or quiet.",
        "a": "Make sure you used an Active Buzzer (usually has a sticker on top), not a Passive Buzzer. Also ensure it's powered directly from 3V3 through the transistor, no resistor."
      }
    ]
  },
  "p2m1": {
    "title": "2.1 Setting Up the IDE",
    "phase": "PHASE 2: Software Gatekeeper",
    "isCapstone": false,
    "overview": {
      "hook": "Prepare your computer to talk to the ESP32.",
      "concept": "Before we write code, we need an editor (Arduino IDE) and the correct translation software (Drivers) so your computer can send instructions to the ESP32 over USB.",
      "difficulty": "Beginner",
      "buildTime": "15 mins"
    },
    "parts": [
      {
        "category": "Cable",
        "name": "Micro USB Cable",
        "quantity": 1,
        "why": "To physically connect the ESP32 to your PC."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Download Arduino IDE",
        "instruction": "Go to the official Arduino website and download the IDE for your operating system: <a href='https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE' target='_blank' style='text-decoration: underline; color: inherit; font-weight: 600;'>Download Arduino ide</a>"
      },
      {
        "number": 2,
        "title": "Open and Select Board",
        "instruction": "Open the Arduino IDE. In the top dropdown, click 'Select other board and port...'."
      },
      {
        "number": 3,
        "title": "Connect the ESP32",
        "instruction": "Connect the ESP32 using the USB cable. Search for 'ESP32 Dev Module' in the boards list, and select the corresponding COM port."
      },
      {
        "number": 4,
        "title": "Install Drivers (If Needed)",
        "instruction": "If no COM port works or appears, your computer is missing the serial driver. Download and install the CP2102 to USB driver (often trial and error to find what suits your device) from here: <a href='https://www.silabs.com/software-and-tools/usb-to-uart-bridge-vcp-drivers?tab=downloads' target='_blank' style='text-decoration: underline; color: inherit; font-weight: 600;'>Download driver</a>"
      },
      {
        "number": 5,
        "title": "Write and Upload Code",
        "instruction": "Write your code, click the upload tick button, and wait for it to finish."
      }
    ],
    "whatYouWillObserve": "Your computer is now fully equipped to compile C++ code and beam it directly into the ESP32's brain.",
    "troubleshooting": [
      {
        "q": "The COM port is still not showing up.",
        "a": "Make sure you use the microusb cable provided with the kit, its a data cable and not a powercable, so its reliable. Other cheap cables might be power only. Another issue of code not uploading might be because your version usb to uart might be wrong. Try installing some other version, thats the solution."
      }
    ]
  },
  "p2m2": {
    "title": "2.2 Booting the Brain",
    "phase": "PHASE 2: Software Gatekeeper",
    "isCapstone": false,
    "overview": {
      "hook": "Hello World! Writing your first C++ program to make the ESP32's onboard LED blink.",
      "concept": "Now we introduce software. Instead of hardwiring a 555 timer, we will tell the ESP32 to turn a pin HIGH (3.3V) and LOW (0V) using C++ code.",
      "difficulty": "Beginner",
      "buildTime": "15 mins"
      ,
      "simulation": "m5"
    },
    "parts": [
      {
        "category": "Microcontroller",
        "name": "ESP32 Dev Board",
        "quantity": 1,
        "why": "Running the C++ logic."
      },
      {
        "category": "Cable",
        "name": "Micro USB Cable",
        "quantity": 1,
        "why": "Uploading the compiled code from your PC."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Connect to PC",
        "instruction": "Plug the ESP32 into your computer. Open the Arduino IDE."
      },
      {
        "number": 2,
        "title": "Select Board",
        "instruction": "In Tools > Board, select ESP32 Dev Module. In Tools > Port, select the COM port."
      },
      {
        "number": 3,
        "title": "Write the Code",
        "instruction": "Copy the blink code into the IDE."
      },
      {
        "number": 4,
        "title": "Upload",
        "instruction": "Click the Upload button (Right Arrow). When you see Connecting..., hold the BOOT button on the ESP32."
      },
      {
        "number": 5,
        "title": "Observe",
        "instruction": "Watch the tiny blue LED on the board start blinking."
      }
    ],
    "whatYouWillObserve": "The internal blue LED (connected to GPIO 2) will blink exactly according to your delay() parameters in the code.",
    "troubleshooting": [
      {
        "q": "It says 'Failed to connect to ESP32'.",
        "a": "You must hold down the physical 'BOOT' button on the ESP32 board the moment the console says 'Connecting...'."
      }
    ],
    "simulation": "m6",
    "code": {
      "filename": "Blink.ino",
      "snippet": "void setup() {\n  pinMode(2, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(2, HIGH);\n  delay(1000);\n  digitalWrite(2, LOW);\n  delay(1000);\n}",
      "breakdown": [
        {
          "line": 2,
          "desc": "Configures GPIO pin 2 as an OUTPUT so it can provide voltage."
        },
        {
          "line": 6,
          "desc": "Turns the pin HIGH (outputs 3.3V)."
        },
        {
          "line": 7,
          "desc": "Pauses execution for 1000 milliseconds (1 second)."
        }
      ]
    }
  },
  "p2m3": {
    "title": "2.3 Digital Translation",
    "phase": "PHASE 2: Software Gatekeeper",
    "isCapstone": false,
    "overview": {
      "hook": "Reading physical button presses into C++ variables to control an external LED.",
      "concept": "Instead of routing current directly through a switch to an LED, we will wire the switch to an input pin, read its state in code, and use an if-statement to turn on an LED.",
      "difficulty": "Beginner",
      "buildTime": "20 mins"
      ,
      "simulation": "m6"
    },
    "parts": [
      {
        "category": "Component",
        "name": "Push Button",
        "quantity": 1,
        "why": "Physical input."
      },
      {
        "category": "Component",
        "name": "Red LED",
        "quantity": 1,
        "why": "Digital output."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Wire LED",
        "instruction": "Wire LED anode to GPIO 4, cathode to GND via 220Ω resistor."
      },
      {
        "number": 2,
        "title": "Wire Button",
        "instruction": "Wire one side of the button to GPIO 15, the other side to GND."
      },
      {
        "number": 3,
        "title": "Upload Code",
        "instruction": "Upload the button reading code."
      },
      {
        "number": 4,
        "title": "Test",
        "instruction": "Press the button and watch the LED respond instantly."
      }
    ],
    "whatYouWillObserve": "The LED lights up when pressed. The software is constantly checking the pin state and making decisions thousands of times per second.",
    "troubleshooting": [
      {
        "q": "The LED flickers randomly when I'm not pressing it.",
        "a": "This is a 'floating' pin. Ensure you use INPUT_PULLUP in your code to stabilize the pin at HIGH when not pressed."
      }
    ],
    "code": {
      "filename": "DigitalInput.ino",
      "snippet": "const int btnPin = 15;\nconst int ledPin = 4;\n\nvoid setup() {\n  pinMode(btnPin, INPUT_PULLUP);\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  int btnState = digitalRead(btnPin);\n  if (btnState == LOW) {\n    digitalWrite(ledPin, HIGH);\n  } else {\n    digitalWrite(ledPin, LOW);\n  }\n}",
      "breakdown": [
        {
          "line": 5,
          "desc": "INPUT_PULLUP enables an internal resistor that pulls the voltage to 3.3V normally."
        },
        {
          "line": 10,
          "desc": "Reads the pin. If pressed, it connects to GND, so it reads LOW."
        },
        {
          "line": 11,
          "desc": "The logic is inverted: LOW means pressed!"
        }
      ]
    }
  },
  "p2m4": {
    "title": "2.4 The Illusion of Analog",
    "phase": "PHASE 2: Software Gatekeeper",
    "isCapstone": false,
    "overview": {
      "hook": "Fading an LED using Pulse Width Modulation (PWM) - creating the illusion of analog voltages using pure digital signals.",
      "concept": "Digital pins can only output 3.3V or 0V. They can't output 1.5V. However, if we pulse the pin on and off incredibly fast, the human eye perceives it as dimming. This is PWM.",
      "difficulty": "Intermediate",
      "buildTime": "20 mins"
    },
    "parts": [
      {
        "category": "Component",
        "name": "Blue LED",
        "quantity": 1,
        "why": "High visibility for fading."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Wire LED",
        "instruction": "Wire LED anode to GPIO 16, cathode to GND via 220Ω resistor."
      },
      {
        "number": 2,
        "title": "Upload Code",
        "instruction": "Upload the PWM fading sketch."
      },
      {
        "number": 3,
        "title": "Observe",
        "instruction": "Watch the LED smoothly pulse like a sleeping Macbook."
      }
    ],
    "whatYouWillObserve": "The LED fades up and down smoothly. Even though the ESP32 is only outputting HIGH and LOW, the rapid switching creates an average voltage effect.",
    "troubleshooting": [
      {
        "q": "It blinks instead of fading.",
        "a": "Your delay is too high, or you aren't using the ESP32's ledcWrite() API correctly. Standard Arduino analogWrite() works on newer cores, but ledcWrite is native."
      }
    ],
    "code": {
      "filename": "PWMFade.ino",
      "snippet": "const int ledPin = 16;\n\nvoid setup() {\n  ledcAttach(ledPin, 5000, 8);\n}\n\nvoid loop() {\n  for(int dutyCycle = 0; dutyCycle <= 255; dutyCycle++) {\n    ledcWrite(ledPin, dutyCycle);\n    delay(5);\n  }\n  for(int dutyCycle = 255; dutyCycle >= 0; dutyCycle--) {\n    ledcWrite(ledPin, dutyCycle);\n    delay(5);\n  }\n}",
      "breakdown": [
        {
          "line": 4,
          "desc": "Configures PWM channel 0, with a 5000 Hz frequency and 8-bit resolution (0-255)."
        },
        {
          "line": 9,
          "desc": "Gradually increases the duty cycle, leaving the LED ON for a longer percentage of each pulse."
        }
      ]
    }
  },
  "p2m5": {
    "title": "2.5 The ADC Bridge",
    "phase": "PHASE 2: Software Gatekeeper",
    "isCapstone": false,
    "overview": {
      "hook": "Converting true analog physical values (light intensity) into digital numbers using the Analog-to-Digital Converter.",
      "concept": "The ADC takes a variable voltage from 0V to 3.3V and converts it into an integer from 0 to 4095. This allows the ESP32 to 'measure' the physical world.",
      "difficulty": "Intermediate",
      "buildTime": "20 mins"
    },
    "parts": [
      {
        "category": "Component",
        "name": "LDR",
        "quantity": 1,
        "why": "Light sensor voltage divider."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Voltage Divider",
        "instruction": "Wire the LDR from 3V3 to GPIO 34. Wire a 10k resistor from GPIO 34 to GND."
      },
      {
        "number": 2,
        "title": "Upload",
        "instruction": "Upload the ADC read sketch."
      },
      {
        "number": 3,
        "title": "Serial Monitor",
        "instruction": "Open the Serial Monitor (magnifying glass icon) at 115200 baud."
      },
      {
        "number": 4,
        "title": "Test",
        "instruction": "Cover the LDR and watch the numbers drop!"
      }
    ],
    "whatYouWillObserve": "A stream of numbers printing to your console that perfectly correlates with the brightness of the room.",
    "troubleshooting": [
      {
        "q": "The numbers are always 4095.",
        "a": "You forgot the 10k pull-down resistor to GND. Without it, the pin is pulled entirely to 3V3."
      }
    ],
    "code": {
      "filename": "AnalogRead.ino",
      "snippet": "const int ldrPin = 34;\n\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  int lightValue = analogRead(ldrPin);\n  Serial.print(\"Light Level: \");\n  Serial.println(lightValue);\n  delay(100);\n}",
      "breakdown": [
        {
          "line": 4,
          "desc": "Initializes serial communication to send data back to your PC via USB."
        },
        {
          "line": 8,
          "desc": "Reads the ADC. 0V = 0. 3.3V = 4095."
        }
      ]
    }
  },
  "p2cap": {
    "title": "Capstone: Thermometer",
    "phase": "PHASE 2: Software Gatekeeper",
    "isCapstone": true,
    "overview": {
      "hook": "Build an active environmental monitor that visually warns you if the room gets too hot.",
      "concept": "Combining ADC inputs (DHT11 or LDR proxy) and PWM outputs, creating a system that maps sensor data directly to LED brightness or alarm logic.",
      "difficulty": "Advanced",
      "buildTime": "30 mins"
    },
    "parts": [
      {
        "category": "Component",
        "name": "DHT11 Sensor",
        "quantity": 1,
        "why": "Temperature and Humidity."
      },
      {
        "category": "Component",
        "name": "RGB LED",
        "quantity": 1,
        "why": "Multi-color visual status."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Library Install",
        "instruction": "In Arduino IDE, go to Sketch > Include Library > Manage Libraries. Search and install DHT sensor library."
      },
      {
        "number": 2,
        "title": "Wire DHT11",
        "instruction": "Connect VCC to 3V3, GND to GND, and Data to GPIO 15."
      },
      {
        "number": 3,
        "title": "Wire RGB",
        "instruction": "Connect the longest leg of the RGB LED to GND. Connect Red to GPIO 4, Green to GPIO 16, Blue to GPIO 17 via 220Ω resistors."
      },
      {
        "number": 4,
        "title": "Code",
        "instruction": "Upload the mapping code that turns the LED RED if temp > 25°C, else GREEN."
      }
    ],
    "whatYouWillObserve": "The system reads the room temperature digitally, parses the protocol, and makes conditional decisions to drive the RGB LED.",
    "troubleshooting": [
      {
        "q": "DHT returns 'nan'.",
        "a": "NaN means Not a Number. Your data wire is disconnected, or you declared the wrong DHT type in code."
      }
    ],
    "code": {
      "filename": "SmartTemp.ino",
      "snippet": "#include \"DHT.h\"\n#define DHTPIN 15\n#define DHTTYPE DHT11\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(115200);\n  dht.begin();\n  pinMode(4, OUTPUT);\n  pinMode(16, OUTPUT);\n}\n\nvoid loop() {\n  float t = dht.readTemperature();\n  if (isnan(t)) return;\n  \n  if (t > 25.0) {\n    digitalWrite(4, HIGH); // RED\n    digitalWrite(16, LOW); // GREEN\n  } else {\n    digitalWrite(4, LOW);\n    digitalWrite(16, HIGH);\n  }\n  delay(2000);\n}",
      "breakdown": [
        {
          "line": 15,
          "desc": "Reads the temperature as a floating point decimal."
        },
        {
          "line": 18,
          "desc": "The logic threshold to trigger the visual warning."
        }
      ]
    }
  },

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
        "instruction": "Brown wire to GND. Red wire to VIN (5V). Orange (Signal) wire to GPIO 13."
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
      "snippet": "#include <ESP32Servo.h>\n\nServo myServo;\nint servoPin = 13;\n\nvoid setup() {\n  myServo.attach(servoPin);\n}\n\nvoid loop() {\n  for (int pos = 0; pos <= 180; pos += 1) {\n    myServo.write(pos);\n    delay(15);\n  }\n  for (int pos = 180; pos >= 0; pos -= 1) {\n    myServo.write(pos);\n    delay(15);\n  }\n}",
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
      "snippet": "#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\n#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);\n\nvoid setup() {\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  display.clearDisplay();\n  display.setTextSize(2);\n  display.setTextColor(WHITE);\n  display.setCursor(10, 10);\n  display.println(\"Hello IoT\");\n  display.display();\n}\n\nvoid loop() {}",
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
      "snippet": "#include <DHT.h>\n\n#define DHTPIN 4\n#define DHTTYPE DHT11\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(115200);\n  dht.begin();\n}\n\nvoid loop() {\n  delay(2000);\n  float h = dht.readHumidity();\n  float t = dht.readTemperature();\n\n  if (isnan(h) || isnan(t)) {\n    Serial.println(\"Failed to read from DHT sensor!\");\n    return;\n  }\n\n  Serial.print(\"Humidity: \");\n  Serial.print(h);\n  Serial.print(\"%  Temperature: \");\n  Serial.print(t);\n  Serial.println(\"C\");\n}",
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
        "instruction": "Connect Relay VCC to VIN (5V), GND to GND, and IN to GPIO 26."
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
      "snippet": "const int relayPin = 26;\n\nvoid setup() {\n  pinMode(relayPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(relayPin, HIGH); // Engages coil\n  delay(2000);\n  digitalWrite(relayPin, LOW);  // Releases coil\n  delay(2000);\n}",
      "breakdown": [
        {
          "line": 8,
          "desc": "Sends 3.3V to the relay transistor, which energizes the electromagnet and pulls the switch closed."
        }
      ]
    }
  },

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
        "title": "Safety Wiring",
        "instruction": "Wire the OLED and Servo. Power HC-SR04 with VIN (5V). Crucial: Build a voltage divider to protect the ESP32! HC-SR04 Echo -> 10k resistor -> GPIO 18. Then from GPIO 18 -> 10k resistor -> GND."
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

    "code": {
      "filename": "DesktopRadar.ino",
      "snippet": "#include <ESP32Servo.h>\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\n#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);\n\nServo myServo;\nconst int trigPin = 5;\nconst int echoPin = 18;\n\nvoid setup() {\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  myServo.attach(13);\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n}\n\nvoid loop() {\n  for (int angle = 0; angle <= 180; angle += 5) {\n    scan(angle);\n  }\n  for (int angle = 180; angle >= 0; angle -= 5) {\n    scan(angle);\n  }\n}\n\nvoid scan(int angle) {\n  myServo.write(angle);\n  delay(30);\n\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n  \n  long duration = pulseIn(echoPin, HIGH, 30000);\n  long distance = duration * 0.034 / 2;\n\n  display.clearDisplay();\n  display.setTextSize(1);\n  display.setTextColor(WHITE);\n  display.setCursor(0,0);\n  display.print(\"Angle: \"); display.print(angle);\n  display.setCursor(0,10);\n  display.print(\"Dist: \"); display.print(distance); display.print(\" cm\");\n  display.display();\n}",
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

  },
  "p4m1": {
    "title": "4.1 High-Voltage Bridge",
    "phase": "PHASE 4: Connected IoT",
    "isCapstone": false,
    "overview": {
      "hook": "Using a 3.3V digital signal to safely control a high-current device like a DC Motor using an Electromagnetic Relay.",
      "concept": "A relay is an electromechanical switch. When we send a tiny 3.3V signal to the coil, it creates a magnetic field that physically pulls a metal contact shut, allowing high voltage to flow on an isolated circuit.",
      "difficulty": "Advanced",
      "buildTime": "20 mins"
      ,
      "simulation": "m11"
    },
    "parts": [
      {
        "category": "Component",
        "name": "Single Channel Relay",
        "quantity": 1,
        "why": "Isolated high-voltage switch."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Wiring the Control",
        "instruction": "Connect Relay VCC to VIN (5V), GND to GND, and IN to GPIO 26."
      },
      {
        "number": 2,
        "title": "Upload Code",
        "instruction": "Upload a basic Blink sketch, but change the pin from 2 to 26."
      },
      {
        "number": 3,
        "title": "Listen",
        "instruction": "You should hear a physical *CLICK* every second as the internal magnet engages."
      }
    ],
    "whatYouWillObserve": "The relay will click rhythmically. You are now controlling a switch capable of handling mains power using your ESP32.",
    "troubleshooting": [
      {
        "q": "It doesn't click.",
        "a": "Some relay modules require 5V to energize the coil. If your ESP32 has a VIN or 5V pin, use that for the Relay VCC instead of 3V3."
      }
    ],
    "code": {
      "filename": "RelayTest.ino",
      "snippet": "const int relayPin = 26;\n\nvoid setup() {\n  pinMode(relayPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(relayPin, HIGH); // Engages coil\n  delay(2000);\n  digitalWrite(relayPin, LOW);  // Releases coil\n  delay(2000);\n}",
      "breakdown": [
        {
          "line": 8,
          "desc": "Sends 3.3V to the relay transistor, which energizes the electromagnet."
        }
      ]
    }
  },
  "p4m2": {
    "title": "4.2 The Local Hotspot",
    "phase": "PHASE 4: Connected IoT",
    "isCapstone": false,
    "overview": {
      "hook": "Turn your ESP32 into a Wi-Fi router. Host a local web page directly from the microcontroller.",
      "concept": "The ESP32 has a built-in radio. We can configure it in Access Point (AP) mode. It will broadcast its own Wi-Fi network that your phone can connect to.",
      "difficulty": "Intermediate",
      "buildTime": "25 mins"
      ,
      "simulation": "m12"
    },
    "parts": [
      {
        "category": "Microcontroller",
        "name": "ESP32 Dev Board",
        "quantity": 1,
        "why": "Wi-Fi capability."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Upload Code",
        "instruction": "Upload the WiFiAccessPoint sketch."
      },
      {
        "number": 2,
        "title": "Connect Phone",
        "instruction": "Open your phone Wi-Fi settings and look for \"ESP32_Network\". Connect using the password in the code."
      },
      {
        "number": 3,
        "title": "Open Browser",
        "instruction": "Open a browser and navigate to 192.168.4.1."
      }
    ],
    "whatYouWillObserve": "You will see a simple HTML web page loaded directly from your ESP32. Your ESP32 is now a web server!",
    "troubleshooting": [
      {
        "q": "The web page doesn't load.",
        "a": "Ensure you are connected to the ESP32's Wi-Fi network, and that your phone hasn't auto-switched back to your home Wi-Fi or Cellular Data."
      }
    ],
    "code": {
      "filename": "AccessPoint.ino",
      "snippet": "#include <WiFi.h>\n#include <WebServer.h>\n\nconst char *ssid = \"ESP32_Network\";\nconst char *password = \"12345678\";\n\nWebServer server(80);\n\nvoid handleRoot() {\n  server.send(200, \"text/html\", \"<h1>Hello from ESP32!</h1>\");\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.softAP(ssid, password);\n  \n  server.on(\"/\", handleRoot);\n  server.begin();\n  Serial.println(\"Server started.\");\n}\n\nvoid loop() {\n  server.handleClient();\n}",
      "breakdown": [
        {
          "line": 7,
          "desc": "Creates a WebServer object listening on port 80 (standard HTTP)."
        },
        {
          "line": 15,
          "desc": "Initializes the radio in Access Point mode."
        },
        {
          "line": 17,
          "desc": "Routes any traffic hitting the root URL \"/\" to the handleRoot function."
        },
        {
          "line": 23,
          "desc": "Must be called rapidly in the loop to process incoming HTTP requests."
        }
      ]
    }
  },
  "p4m3": {
    "title": "4.3 Two-Way Data",
    "phase": "PHASE 4: Connected IoT",
    "isCapstone": false,
    "overview": {
      "hook": "Adding buttons to your web page to control the physical relay over Wi-Fi.",
      "concept": "We will serve an HTML page with interactive buttons. When clicked, the browser will send an HTTP request back to the ESP32, which will flip the physical relay.",
      "difficulty": "Advanced",
      "buildTime": "30 mins"
    },
    "parts": [
      {
        "category": "Component",
        "name": "Single Channel Relay",
        "quantity": 1,
        "why": "Physical actuator."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Wiring",
        "instruction": "Keep the relay wired to GPIO 26."
      },
      {
        "number": 2,
        "title": "Upload",
        "instruction": "Upload the Interactive Web Server sketch."
      },
      {
        "number": 3,
        "title": "Test",
        "instruction": "Connect to the ESP32 Wi-Fi, open the page, and tap the ON/OFF buttons."
      }
    ],
    "whatYouWillObserve": "When you tap the button on your phone screen, you will instantly hear the physical relay click on your desk.",
    "troubleshooting": [
      {
        "q": "The page loads but buttons do nothing.",
        "a": "Check your server.on() routes in the code. Ensure /on maps to a function that digitalWrites HIGH."
      }
    ],
    "code": {
      "filename": "WebControl.ino",
      "snippet": "#include <WiFi.h>\n#include <WebServer.h>\n\nWebServer server(80);\nconst int relayPin = 26;\n\nString html = \"<h1>Relay Control</h1><a href='/on'><button>ON</button></a> <a href='/off'><button>OFF</button></a>\";\n\nvoid setup() {\n  pinMode(relayPin, OUTPUT);\n  WiFi.softAP(\"ESP32_Home\", \"12345678\");\n  \n  server.on(\"/\", []() {\n    server.send(200, \"text/html\", html);\n  });\n  \n  server.on(\"/on\", []() {\n    digitalWrite(relayPin, HIGH);\n    server.send(200, \"text/html\", html);\n  });\n\n  server.on(\"/off\", []() {\n    digitalWrite(relayPin, LOW);\n    server.send(200, \"text/html\", html);\n  });\n\n  server.begin();\n}\n\nvoid loop() {\n  server.handleClient();\n}",
      "breakdown": [
        {
          "line": 7,
          "desc": "A basic HTML string containing two hyperlinks styled as buttons."
        },
        {
          "line": 17,
          "desc": "When the browser requests /on, the ESP32 turns the relay on and sends the HTML page back so the user sees the buttons again."
        }
      ]
    }
  },
  "p4cap": {
    "title": "Capstone: Smart Home Hub",
    "phase": "PHASE 4: Connected IoT",
    "isCapstone": true,
    "overview": {
      "hook": "Connect to your Home Wi-Fi, read DHT11 sensors, control Relays, and display it all on an OLED and Web Dashboard simultaneously.",
      "concept": "The ultimate culmination. The ESP32 acts as a true IoT node: reading analog/digital sensors, driving I2C displays, actuating high-voltage relays, and serving asynchronous web dashboards.",
      "difficulty": "Master",
      "buildTime": "90 mins"
    },
    "parts": [
      {
        "category": "Microcontroller",
        "name": "ESP32 Dev Board",
        "quantity": 1,
        "why": "The core."
      },
      {
        "category": "Component",
        "name": "DHT11 Sensor",
        "quantity": 1,
        "why": "Environment data."
      },
      {
        "category": "Component",
        "name": "0.96 OLED",
        "quantity": 1,
        "why": "Local display."
      },
      {
        "category": "Component",
        "name": "Relay",
        "quantity": 1,
        "why": "Appliance control."
      }
    ],
    "steps": [
      {
        "number": 1,
        "title": "Integration",
        "instruction": "Wire the DHT11, OLED, and Relay to the respective GPIOs you used in previous modules."
      },
      {
        "number": 2,
        "title": "Wi-Fi Station Mode",
        "instruction": "Change your code to connect to your home Wi-Fi router (WIFI_STA) instead of broadcasting its own."
      },
      {
        "number": 3,
        "title": "Upload & Find IP",
        "instruction": "Upload the code. Open the Serial Monitor to see what local IP address your router assigned the ESP32."
      },
      {
        "number": 4,
        "title": "Dashboard",
        "instruction": "Type that IP address into your desktop browser to see your live Smart Home Dashboard."
      }
    ],
    "whatYouWillObserve": "A fully functional IoT node. The web page will show live temperature data, and clicking the relay button will toggle the physical hardware while updating the local OLED screen.",
    "troubleshooting": [
      {
        "q": "It won't connect to my home Wi-Fi.",
        "a": "ESP32 only supports 2.4GHz Wi-Fi networks. It cannot connect to 5GHz networks. Ensure your router has a 2.4GHz band."
      }
    ],

    "code": {
      "filename": "SmartHomeHub.ino",
      "snippet": "#include <WiFi.h>\n#include <WebServer.h>\n#include <DHT.h>\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\nconst char* ssid = \"YOUR_HOME_WIFI\";\nconst char* password = \"YOUR_PASSWORD\";\n\nWebServer server(80);\nDHT dht(4, DHT11);\nAdafruit_SSD1306 display(128, 64, &Wire, -1);\nconst int relayPin = 26;\nbool relayState = false;\nfloat temp = 0.0;\nunsigned long lastDHTRead = 0;\n\nvoid setup() {\n  pinMode(relayPin, OUTPUT);\n  dht.begin();\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  \n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) delay(500);\n\n  server.on(\"/\", []() {\n    String html = \"<h1>Smart Hub</h1><p>Temp: \" + String(temp) + \" C</p>\";\n    html += \"<a href='/toggle'><button>Toggle Relay</button></a>\";\n    server.send(200, \"text/html\", html);\n  });\n\n  server.on(\"/toggle\", []() {\n    relayState = !relayState;\n    digitalWrite(relayPin, relayState ? HIGH : LOW);\n    server.sendHeader(\"Location\", \"/\");\n    server.send(303);\n  });\n\n  server.begin();\n}\n\nvoid loop() {\n  server.handleClient();\n  \n  if (millis() - lastDHTRead >= 2000) {\n    lastDHTRead = millis();\n    temp = dht.readTemperature();\n  }\n  \n  display.clearDisplay();\n  display.setCursor(0,0);\n  display.setTextColor(WHITE);\n  display.print(\"IP: \"); display.println(WiFi.localIP());\n  display.print(\"Temp: \"); display.print(temp);\n  display.print(\" C\\nRelay: \"); display.println(relayState ? \"ON\" : \"OFF\");\n  display.display();\n}",
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


  }
};
