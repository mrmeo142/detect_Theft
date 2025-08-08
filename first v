#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// WiFi và Firebase
#define WIFI_SSID "my_wifi"
#define WIFI_PASSWORD "my_password"
#define API_KEY "AIzaSyCPbF26LYp55XWEN34yliKLw9rTNw-XOG0"
#define DATABASE_URL "https://detect-theft-dc3d6-default-rtdb.asia-southeast1.firebasedatabase.app/deletethat" // xoa deletethat de lay dung link

// Chân kết nối
#define IR_SENSOR_PIN D5
#define RELAY_PIN D6
#define ACC_THRESHOLD 16.0

// Đối tượng Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Cảm biến MPU6050
Adafruit_MPU6050 mpu;
int systemEnabled = 1;
String lastAlert = ""; 

void setup() {
  Serial.begin(9600);
  pinMode(IR_SENSOR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  // Kết nối WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Đang kết nối WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println(WiFi.localIP());

  // Cấu hình Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if(Firebase.signUp(&config, &auth, "", "")){
    Serial.println("SignUp OK");
  };
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Đợi Firebase sẵn sàng
  delay(3000);
  while (!Firebase.ready()) {
    Serial.println("Chờ Firebase...");
    delay(500);
  }
  Serial.println("Firebase đã sẵn sàng");

  // Khởi tạo MPU6050z
  if (!mpu.begin()) {
    Serial.println("Lỗi khởi tạo MPU6050");
    while (1){
      delay(10);
    }
  }
  Serial.println("MPU6050 đã sẵn sàng");
  
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float x = a.acceleration.x;
  float y = a.acceleration.y;
  float z = a.acceleration.z;
  float acc = sqrt(x * x + y * y + z * z);
  int irValue = digitalRead(IR_SENSOR_PIN);

  // Gửi dữ liệu về Firebase
  if (Firebase.ready()) {
    Firebase.RTDB.setFloat(&fbdo, "Test/acceleration", acc);
    Firebase.RTDB.setInt(&fbdo, "Test/sensor", irValue);
    Firebase.RTDB.getInt(&fbdo, "button/systemEnabled");
    systemEnabled = fbdo.intData();
  }

  // Xử lý cảnh báo
      if (irValue == HIGH && acc >= ACC_THRESHOLD) {
        digitalWrite(RELAY_PIN, LOW);
        Firebase.RTDB.setString(&fbdo, "Test/alert", "Phát hiện va đập");
    } else if (irValue == LOW && acc >= ACC_THRESHOLD) {
        if(systemEnabled == 1){
          digitalWrite(RELAY_PIN, HIGH);
        }
        Firebase.RTDB.setString(&fbdo, "Test/alert", "Phát hiện kẻ trộm");
    } else if (irValue == LOW && acc < ACC_THRESHOLD) {
        digitalWrite(RELAY_PIN, LOW);
        Firebase.RTDB.setString(&fbdo, "Test/alert", "Phát hiện có tiếp cận");
    } else {
        digitalWrite(RELAY_PIN, LOW);
        Firebase.RTDB.setString(&fbdo, "Test/alert", "Trạng thái bình thường");
    }

  // Hiển thị gia tốc
  Serial.print("Gia tốc: ");
  Serial.println(acc);

  delay(1000);
}
