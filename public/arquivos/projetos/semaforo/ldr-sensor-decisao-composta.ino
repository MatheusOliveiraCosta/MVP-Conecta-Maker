#define led 10

void setup() {
  pinMode(led, OUTPUT);
  digitalWrite(led,LOW);
 // Serial.begin(9600);
}

void loop() {
  int ldr = analogRead(0); //leitura do LDR
  //Serial.println(ldr);
  if(ldr < 500){
    digitalWrite(led,HIGH);
  }else{
    digitalWrite(led,LOW);
  }
}
