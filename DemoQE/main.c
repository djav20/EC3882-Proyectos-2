/* ###################################################################
**     Filename    : main.c
**     Project     : Contador
**     Processor   : MC9S08QE128CLK
**     Version     : Driver 01.12
**     Compiler    : CodeWarrior HCS08 C Compiler
**     Date/Time   : 2016-09-28, 15:13, # CodeGen: 0
**     Abstract    :
**         Main module.
**         This module contains user's application code.
**     Settings    :
**     Contents    :
**         No public methods
**
** ###################################################################*/
/*!
** @file main.c
** @version 01.12
** @brief
**         Main module.
**         This module contains user's application code.
*/         
/*!
**  @addtogroup main_module main module documentation
**  @{
*/         
/* MODULE main */


/* Including needed modules to compile this module/procedure */
#include "Cpu.h"
#include "Events.h"
#include "AS1.h"
#include "TI1.h"
#include "AD1.h"
#include "Bit1.h"
#include "CI2C1.h"
/* Include shared modules, which are used for whole project */
#include "PE_Types.h"
#include "PE_Error.h"
#include "PE_Const.h"
#include "IO_Map.h"
#include "A_W_Functions.h"
#include "math.h"

/* User includes (#include below this line is not maintained by Processor Expert) */
	 unsigned int tiempo;             // Variable donde se guarda el ancho del pulso del ultrasonido 1
	 int capture_ready;               // Variable para establecer si ya se culmino la medida del ultrasonido 1
	 unsigned int tiempo2;            // Variable donde se guarda el ancho del pulso del ultrasonido 2
	 int capture_ready2;              // Variable para establecer si ya se culmino la medida del ultrasonido 2
	 float distancia1;                // Variable donde se guarda la distancia calculada con el ultrasonido 1
	 float distancia2;                // Variable donde se guarda la distancia calculada con el ultrasonido 2
	 int ax_offset_mpu1,ay_offset_mpu1,az_offset_mpu1; //Variables donde se guardan los offset de los ejes del MPU 1
	 int ax_offset_mpu2,ay_offset_mpu2,az_offset_mpu2; //Variables donde se guardan los offset de los ejes del MPU 2
	 float roll_mpu1, roll_mpu2;                       // Variables donde se guardan los Rolls de los acelerometros
	 float yaw_mpu1;
	 int contadorr;
	 int contadorwhile;
	 int contador3;
	 int dato;
	 unsigned int dato2;
	 unsigned int dato3;
	 unsigned char b;
	 unsigned char c;
	 
	 bool digital1;
	 bool digital2;
	 unsigned char trama[5] = {0xF2, 0x00, 0x00, 0x33, 0x44};
	 unsigned char error;
	 int estado = 0;
	 
void main(void)
{
  /* Write your local variable definition here */	
  /*** Processor Expert internal initialization. DON'T REMOVE THIS CODE!!! ***/
  PE_low_level_init();
  /*** End of Processor Expert internal initialization.                    ***/
  
  /* Write your code here */
  //SETUP
  MPU6050_INIT1(&ax_offset_mpu1,&ay_offset_mpu1,&az_offset_mpu1); //Rutina de Configuracion del MPU 1
  //MPU6050_INIT2(&ax_offset_mpu2,&ay_offset_mpu2,&az_offset_mpu2); //Rutina de Configuracion del MPU 2
  AD1_Start();
  
while (1){
	contadorwhile++;
	if(estado){
		ROLLS(&roll_mpu1, &roll_mpu2,ax_offset_mpu1,ay_offset_mpu1,az_offset_mpu1,ax_offset_mpu2,ay_offset_mpu2,az_offset_mpu2); // Rutina de obtencion de los Rolls de los distintos MPU
		//SERIAL(roll_mpu1,roll_mpu2,distancia1,distancia2,Bits1_GetVal());  // Rutina de transmision de datos por comunicacion serial
		//Bits2_PutVal(Bits1_GetVal());  // Proceso para enceder los LEDS dependiento del estado de los pulsadores
		dato = (int) roll_mpu1;
		
		c = dato & 0x007F;
		  b = dato >> 7;
		  b = b & 0x1F;
		  
		  digital1 = Bit1_GetVal();
		  
		  if(digital1){
			  b = b | 0x40;
		  }
		  if(digital2){
			  b = b | 0x20;
		  }
		  		  
		  trama[1] = b;
		  trama[2] = c;
		  
		  AD1_GetValue16(&dato2);
	  
		  dato2 = dato2 >> 4;
		  c = dato2 & 0x007F;
		  b = dato2 >> 7;
		  b = b & 0x1F;
		  
		  if(digital1){
			  b = b | 0x40;
		  }
		  if(digital2){
			  b = b | 0x20;
		  }
		  
		  trama[3] = b;
		  trama[4] = c;
		  
		  do{
			  error = AS1_SendChar(trama[0]);
		  }while (error != ERR_OK);
		  
		  do{
			  error = AS1_SendChar(trama[1]);
		  }while (error != ERR_OK);
				  
		  do{
			  error = AS1_SendChar(trama[2]);
		  }while (error != ERR_OK);
		  
		  do{
			  error = AS1_SendChar(trama[3]);
		  }while (error != ERR_OK);
		  
		  do{
			  error = AS1_SendChar(trama[4]);
		  }while (error != ERR_OK);
		
		estado = 0;
		
	}
}




































  /*** Don't write any code pass this line, or it will be deleted during code generation. ***/
  /*** RTOS startup code. Macro PEX_RTOS_START is defined by the RTOS component. DON'T MODIFY THIS CODE!!! ***/
  #ifdef PEX_RTOS_START
    PEX_RTOS_START();                  /* Startup of the selected RTOS. Macro is defined by the RTOS component. */
  #endif
  /*** End of RTOS startup code.  ***/
  /*** Processor Expert end of main routine. DON'T MODIFY THIS CODE!!! ***/
  for(;;){}
  /*** Processor Expert end of main routine. DON'T WRITE CODE BELOW!!! ***/
} /*** End of main routine. DO NOT MODIFY THIS TEXT!!! ***/

/* END main */
/*!
** @}
*/
/*
** ###################################################################
**
**     This file was created by Processor Expert 10.3 [05.09]
**     for the Freescale HCS08 series of microcontrollers.
**
** ###################################################################
*/
