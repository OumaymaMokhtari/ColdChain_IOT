/*********
  Rui Santos
  Complete project details at
  https://randomnerdtutorials.com/esp8266-dht11dht22-temperature-and-humidity-web-server-with-arduino-ide/
*********/

// Import required libraries
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Hash.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WiFi credentials
const char* ssid = "TP-LINK_54A2";
const char* password = "54174726";

// Django API
const char* serverName = "http://192.168.1.102:8000/api/mesures/";

#define DHTPIN 5
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

float t = 0.0;
float h = 0.0;

AsyncWebServer server(85);

unsigned long previousMillis = 0;
const long interval = 10000;

/* ====================== HTML ====================== */
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h2>ESP8266 DHT Server</h2>
  <p>Temperature: <span id="temperature">%TEMPERATURE%</span> °C</p>
  <p>Humidity: <span id="humidity">%HUMIDITY%</span> %</p>
</body>
<script>
setInterval(() => {
  fetch("/temperature").then(r => r.text()).then(t => {
    document.getElementById("temperature").innerHTML = t;
  });
}, 10000);

setInterval(() => {
  fetch("/humidity").then(r => r.text()).then(h => {
    document.getElementById("humidity").innerHTML = h;
  });
}, 10000);
</script>
</html>)rawliteral";

/* ====================== PROCESSOR ====================== */
String processor(const String& var){
  if(var == "TEMPERATURE") return String(t);
  if(var == "HUMIDITY") return String(h);
  return String();
}

/* ====================== AJOUT UNIQUE ====================== */
void sendToAPI(float temp, float hum) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi non connecté");
    return;
  }

  WiFiClient client;
  HTTPClient http;

  http.begin(client, serverName);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-KEY", "ESP_SECRET_123");
  http.setTimeout(5000);

  String json = "{";
  json += "\"sensor_id\": 1,";
  json += "\"temperature\": " + String(t, 2) + ",";
  json += "\"humidity\": " + String(h, 2);
  json += "}";


  int code = http.POST(json);

  Serial.print("POST code: ");
  Serial.println(code);

  if (code > 0) {
    String payload = http.getString();
    Serial.println(payload);
  } else {
    Serial.print("Erreur HTTP: ");
    Serial.println(http.errorToString(code));
  }

  http.end();
}

/* ====================== SETUP ====================== */
void setup(){
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Connexion WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nConnecté !");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/html", index_html, processor);
  });

  server.on("/temperature", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", String(t));
  });

  server.on("/humidity", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", String(h));
  });

  server.begin();
}

/* ====================== LOOP ====================== */
void loop(){
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    float newT = dht.readTemperature();
    float newH = dht.readHumidity();

    if (!isnan(newT) && !isnan(newH)) {
      t = newT;
      h = newH;

      Serial.println(t);
      Serial.println(h);

      sendToAPI(t, h);
    } else {
      Serial.println("Erreur lecture DHT");
    }
  }
}
