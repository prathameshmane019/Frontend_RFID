#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>

// RFID pins
#define SS_PIN 5
#define RST_PIN 22

// Network credentials
const char* ssid = "Admin";
const char* password = "1234";

// API endpoint
const char* serverUrl = "https://nfc-attendance.vercel.app/api/attendance/record";

// Variables
byte nuidPICC[4] = {0, 0, 0, 0};
MFRC522::MIFARE_Key key;
MFRC522 rfid = MFRC522(SS_PIN, RST_PIN);

void setup() {
  // Init Serial USB
  Serial.begin(115200);
  Serial.println(F("Initialize System"));
  
  // init rfid D8,D5,D6,D7
  SPI.begin();
  rfid.PCD_Init();
  Serial.print(F("Reader :"));
  rfid.PCD_DumpVersionToSerial();

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected to WiFi, IP: ");
  Serial.println(WiFi.localIP());

  // Initialize the key
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
}

void loop() {
  readRFID();
}

void readRFID(void) {
  // Look for new cards
  if (!rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been read
  if (!rfid.PICC_ReadCardSerial())
    return;

  // Store NUID into nuidPICC array
  for (byte i = 0; i < 4; i++) {
    nuidPICC[i] = rfid.uid.uidByte[i];
  }

  // Show the NUID in decimal format as before
  Serial.print(F("RFID In dec: "));
  printDec(rfid.uid.uidByte, rfid.uid.size);
  Serial.println();

  // Convert NUID to space-separated string format (e.g., "83 238 222 36")
  String cardId = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (i > 0) cardId += " ";
    if (rfid.uid.uidByte[i] < 10) cardId += "0";
    cardId += String(rfid.uid.uidByte[i], DEC);
  }

  // Send to API if WiFi is connected
  if (WiFi.status() == WL_CONNECTED) {
    sendAttendanceData(cardId);
  } else {
    Serial.println("WiFi not connected");
  }

  // Halt PICC
  rfid.PICC_HaltA();
  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();
}

void printDec(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], DEC);
  }
}

void sendAttendanceData(String cardId) {
  HTTPClient http;
  
  // Configure timed response
  http.setConnectTimeout(5000); // 5 seconds timeout
  
  // Start connection
  http.begin(serverUrl);
  
  // Set headers
  http.addHeader("Content-Type", "application/json");
  
  // Prepare JSON data - keeping the original decimal format
  String jsonData = "{\"cardId\":\"" + cardId + "\"}";
  
  Serial.print("Sending to API: ");
  Serial.println(jsonData);
  
  // Send POST request
  int httpResponseCode = http.POST(jsonData);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
    
    // Visual feedback can be added here (like blinking an LED)
    
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  
  // Free resources
  http.end();
  
  // Add delay to prevent too frequent API calls
  delay(1000);
}