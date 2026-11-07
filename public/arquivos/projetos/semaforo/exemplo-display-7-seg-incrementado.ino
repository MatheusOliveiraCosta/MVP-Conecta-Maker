#define vermelho 9
#define amarelo 10
#define verde 11

int pinosDisplay[7] = {2,3,4,5,6,7,8}; //a,b,c,d,e,f,g
int i; 

void setup() {
  pinMode(vermelho, OUTPUT);
  pinMode(amarelo, OUTPUT);
  pinMode(verde, OUTPUT);

  for(i = 0; i < 7; i++){
    pinMode(pinosDisplay[i],OUTPUT);
  }  
  limparDisplay();
}

void loop() {
  int cont = 9;
  //Ligar luz vermelha
  digitalWrite(vermelho, HIGH);

  //exibir contagem de tempo
  while(cont >= 0){
    converter7seg(cont);
    delay(1000);
    cont--;
  } 

  //Desligar luz vermelha
  digitalWrite(vermelho, LOW);
  //Ligar luz verde
  digitalWrite(verde, HIGH);

  //exibir contagem de tempo
  cont = 5;
  while(cont >= 0){
    converter7seg(cont);
    delay(1000);
    cont--;
  } 

  //Desligar luz verde
  digitalWrite(verde, LOW);
  limparDisplay();

  //Ligar amarelo
  digitalWrite(amarelo, HIGH);
  delay(2000);
  digitalWrite(amarelo, LOW);
}


void ligarSegmento(char s){
  switch(s){
    case 'a':
    digitalWrite(pinosDisplay[0],LOW);
    break;

    case 'b':
    digitalWrite(pinosDisplay[1],LOW);
    break;

    case 'c':
    digitalWrite(pinosDisplay[2],LOW);
    break;

    case 'd':
    digitalWrite(pinosDisplay[3],LOW);
    break;

    case 'e':
    digitalWrite(pinosDisplay[4],LOW);
    break;

    case 'f':
    digitalWrite(pinosDisplay[5],LOW);
    break;

    case 'g':
    digitalWrite(pinosDisplay[6],LOW);
    break;
  }
}

void limparDisplay(){
  for(i = 0; i < 7; i++){
    digitalWrite(pinosDisplay[i],HIGH);    
  }
}

void converter7seg(int valor){
  switch(valor){
    case 1:
      limparDisplay();
      ligarSegmento('b');
      ligarSegmento('c');
      break;

    case 2:
      limparDisplay();
      ligarSegmento('a');
      ligarSegmento('b');
      ligarSegmento('g');
      ligarSegmento('e');
      ligarSegmento('d');
      break;
    
    case 3:
      limparDisplay();
      ligarSegmento('a');
      ligarSegmento('b');
      ligarSegmento('c');
      ligarSegmento('d');
      ligarSegmento('g');
      break;

    case 4:
      limparDisplay();
      ligarSegmento('b');
      ligarSegmento('c');
      ligarSegmento('f');
      ligarSegmento('g');
      break;

    case 5:
      limparDisplay();
      ligarSegmento('a');
      ligarSegmento('c');
      ligarSegmento('d');
      ligarSegmento('f');
      ligarSegmento('g');
      break;

    case 6:
      limparDisplay();
      ligarSegmento('c');
      ligarSegmento('d');
      ligarSegmento('e');
      ligarSegmento('f');
      ligarSegmento('g');
      break; 

    case 7:
      limparDisplay();
      ligarSegmento('a');
      ligarSegmento('b');
      ligarSegmento('c');
      break;
    
    case 8:
      limparDisplay();
      ligarSegmento('a');
      ligarSegmento('b');
      ligarSegmento('c');
      ligarSegmento('d');
      ligarSegmento('e');
      ligarSegmento('f');
      ligarSegmento('g');
      break;

    case 9:
      limparDisplay();
      ligarSegmento('a');
      ligarSegmento('b');
      ligarSegmento('c');
      ligarSegmento('f');
      ligarSegmento('g');
      break;
    
    default:
      limparDisplay();
      ligarSegmento('a');
      ligarSegmento('b');
      ligarSegmento('c');
      ligarSegmento('d');
      ligarSegmento('e');
      ligarSegmento('f');
  }

}
