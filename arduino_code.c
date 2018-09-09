#include <rgb_lcd.h>

rgb_lcd lcd;

const int buttonL = 3;       // connect a button
const int buzzer = 4;        // connect a buzzer
const int buttonR = 2;
const int buttonU = 7;
const int buttonD = 6;
const int buttonS = 5;
int buttonStateL = 0;
int buttonStateR = 0;
int buttonStateU = 0;
int buttonStateD = 0;
int buttonStateS = 0;
int buttonStateL1 = 0;
int buttonStateR1 = 0;
int buttonStateU1 = 0;
int buttonStateD1 = 0;
int buttonStateS1 = 0;
int colorR = 255;
int colorG = 255;
int colorB = 255;
String x = "";
int a = 0;
int y = 0;
int z = 0;
int menuDisplay = 0;
int reeCount = 0;

void setup()
{
  //set button as an INPUT device
  pinMode(buttonR, INPUT);
  pinMode(buttonL, INPUT);
  pinMode(buttonU, INPUT);
  pinMode(buttonD, INPUT);
  pinMode(buttonS, INPUT);
  pinMode(buzzer, OUTPUT);   //set LED as an OUTPUT device
  lcd.begin(16, 2);
  lcd.setRGB(colorR, colorG, colorB);

}

void loop()
{
  buttonStateS = digitalRead(buttonS);
  buttonStateU = digitalRead(buttonU);
  buttonStateD = digitalRead(buttonD);
  buttonStateL = digitalRead(buttonL);
  buttonStateR = digitalRead(buttonR);
  if (menuDisplay == 0 && buttonStateS == 1)  {
    delay(1000);
    menuDisplay = menuDisplay + 1;
  }
  if (menuDisplay == 0)  {
    lcd.setCursor(0, 0);
    lcd.print("Press Select to");
    lcd.setCursor(0, 1);
    lcd.print("Start          ");
  }

  if (menuDisplay == 1)  {
    lcd.setCursor(0, 0);
    lcd.print("Gre Yel Red Gra");
    lcd.setCursor(0, 1);
    lcd.print("              ");
    if (buttonStateL == 1)  {
      lcd.setRGB(0, 255, 0);
      delay(1000);
      menuDisplay = menuDisplay + 1;
    }
    if (buttonStateU == 1)  {
      lcd.setRGB(255, 255, 0);
      delay(1000);
      menuDisplay = menuDisplay + 1;
    }
    if (buttonStateD == 1)  {
      lcd.setRGB(255, 0, 0);
      delay(1000);
      a = 1;
      menuDisplay = menuDisplay + 1;
    }
    if (buttonStateR == 1)  {
      lcd.setRGB(50, 50, 50);
      delay(1000);
      menuDisplay = menuDisplay + 1;

    }
  }

  if (menuDisplay == 2)  {
    buttonStateL = 0;
    buttonStateR = 0;
    buttonStateU = 0;
    buttonStateD = 0;
    buttonStateS = 0;
    lcd.setCursor(0, 0);
    lcd.print("  M53    M21      ");
    lcd.setCursor(0, 1);
    lcd.print("  M06    M24      ");
    if (buttonStateR == 1)  {
      y = 0;
    }
    if (buttonStateD == 1)  {
      y = 1;
    }
    if (buttonStateU == 1)  {
      y = 2;
    }
    if (buttonStateL == 1)  {
      y = 3;
    }
    if (buttonStateS == 1)  {
      y = 4;
    }
    switch (z)  {
      case 0:
        x = "M53";
        menuDisplay = menuDisplay + 2;
        break;
      case 1:
        x = "M21";
        menuDisplay = menuDisplay + 2;
        break;
      case 2:
        x = "M06";
        menuDisplay = menuDisplay + 2;
        break;
      case 3:
        x = "M24";
        menuDisplay = menuDisplay + 2;
        break;
      case 4:
        buttonStateS = 0;
        menuDisplay = menuDisplay + 1;
    }
  }

  if (menuDisplay == 3)  {

    lcd.setCursor(0, 0);
    lcd.print("  A71    A32     ");
    lcd.setCursor(0, 1);
    lcd.print("  A02    A57     ");
    if (buttonStateL == 1)  {
      z = 0;
    }
    if (buttonStateU == 1)  {
      z = 1;
    }
    if (buttonStateD == 1)  {
      z = 2;
    }
    if (buttonStateR == 1)  {
      z = 3;
    }
    if (buttonStateS == 1)  {
      z = 4;
    }
    switch (z)  {
      case 0:
        x = "A71";
        menuDisplay = menuDisplay + 1;
        break;
      case 1:
        x = "A32";
        menuDisplay = menuDisplay + 1;
        break;
      case 2:
        x = "A02";
        menuDisplay = menuDisplay + 1;
        break;
      case 3:
        x = "A57";
        menuDisplay = menuDisplay + 1;
        break;
      case 4:
        buttonStateS = 0;
        menuDisplay = menuDisplay - 1;
    }
  }


  if (menuDisplay >= 4)  {

    lcd.setCursor(0, 0);
    lcd.print("ID: 5169B5E8FC");
    lcd.setCursor(0, 1);
    lcd.print(" Amb ID: ");
    lcd.setCursor(8, 1);
    lcd.print(x);
    if (a == 1)  {
      if (reeCount < 10) {
        digitalWrite(buzzer, HIGH);
        delay(500);
        digitalWrite(buzzer, LOW);
        delay(500);
        reeCount++;
      }

    }
    if (buttonStateS == 1)  {
      lcd.setRGB(255, 255, 255);
      delay(1000);
      a = 0;
      reeCount = 0;
      menuDisplay = 1;
    }
  }

}
