/*
 * A_W_Functions.c
 *
 *  Created on: Oct 18, 2016
 *      Author: Zulai
 */


#include "cpu.h"
#include "A_W_Functions.h"

//************************************************************************
//*						     VARIABLES GLOBALES                          *
//************************************************************************
extern unsigned int tiempo;
extern int capture_ready; 
extern unsigned int tiempo2;
extern int capture_ready2;
extern float yaw_mpu1;
extern int transf;
extern int contador3;
//************************************************************************
//*						FUNCIONES Y PROCEDIMIENTOS                       *
//************************************************************************

//          **************MATEMATICA*****************************

float ATAN(float y){                               
 // Computa la función arcotangente. Rango: [-PI/2,PI/2] 
	float x=y;
	float angle=0;
    if(x>1.4 || x<-1.4){
        angle= ATAN(1/x);
        if(x>0){
            angle= (float)(PI/2 - angle);
        }
        else{
            angle= (float)(-PI/2 -angle);
        }
    }
    else{
        if (x>=0.5){
            angle= (float)(0.015 + x*(1.0311+ x*(-0.2608)));     // Línea de tendencia de Excel
        }
        else if (x<=-0.5){
        	angle= (float)(-0.015 + x*(1.0311+ x*(0.2608)));     // Línea de tendencia de Excel
        }
        else{
        angle=x*x;
        angle= (float)(x*(1.0+angle*(-0.333+angle*(0.2+angle*(-0.1429)))));
        }
    }
    return angle;
}


//          **************PROMEDIADORES***************************
float ULTRA1 (){
//	Calcula el promedio de 3 medidas del sensor  de ultrasonido 1
	unsigned int promedio=0,i;
	for (i = 0; i <= 2; i++){
		while (!capture_ready){};
		promedio += tiempo;
		capture_ready = 0;
	}
	return (0.017*promedio/3);
	
}

float ULTRA2 (){
//	Calcula el promedio de 3 medidas del sensor  de ultrasonido 2
	unsigned int promedio=0,i;
	for (i = 0; i <= 2; i++){
		while (!capture_ready2){};
		promedio += tiempo2;
		capture_ready2 = 0;
	}
	return (0.017*promedio/3);
	
}


//          ***************MPU6050********************************

// I2C

byte I2C_WRITE_REGISTER(byte addressReg,byte data){
	// Rutina para mandar dos datos, la dirección de registro y el contenido del mismo.
	word snd=0;
	word size=2;
	byte err;
	byte frame[2];
	frame[0]=addressReg;        
	frame[1]=data;
	while(err=CI2C1_SendBlock(frame,size,&snd)!=ERR_OK){};
	return err; // Retornar código de error definido por processor expert
}

byte I2C_READ(byte addressReg){
	// Rutina para recibir un byte del dispositivo esclavo
	byte data =0;
	CI2C1_SendChar(addressReg);
	CI2C1_RecvChar(&data);
	return data;
}

void I2C_MULTIPLE_READ(byte InitialAddress,byte *DataArray,word size){
	// Rutina para recibir multiples bytes del dispositivo esclavo
	word snd=0;
	CI2C1_SendChar(InitialAddress);
	CI2C1_RecvBlock(DataArray,size,&snd);
}



void I2C_SELECT_SLAVE(byte slaveAddress){
	// Rutina para seleccionar satisfactoriamente un nuevo esclavo I2C.
	while(CI2C1_SelectSlave(slaveAddress)!=ERR_OK) ;
}

// INICIALIZACION DE LOS SENSORES MPU6050

void MPU6050_INIT1(int *ax_offset, int *ay_offset, int *az_offset){
	 // Rutina de configuración e inicialización el MPU6050 1
	int i;
	int xaux,yaux,zaux,gxaux,gyaux,gzaux;
	long ax = 0;
	long ay = 0;
	long az = 0;
    while(CI2C1_SelectSlave(SLAVE_ADDRESS_MPU1)!=ERR_OK){};
    I2C_WRITE_REGISTER(MPU6050_PWR_MGMT_1,0x00);  // Evitar el sleep mode
    DELAY(100);
    I2C_WRITE_REGISTER(MPU6050_SMPLRT_DIV,0x00);   // Dejamos la tasa de muestreo en 8kHz la cual será truncada por el DLPF
    I2C_WRITE_REGISTER(MPU6050_CONFIG,0x00);      // DLPF
    I2C_WRITE_REGISTER(MPU6050_ACCEL_CONFIG,0x00);// +/- 2g, no self test
    I2C_WRITE_REGISTER(MPU6050_GYRO_CONFIG,0x08); // +/- 500 dps, no self test
    I2C_WRITE_REGISTER(MPU6050_INT_PIN_CFG,0x02); //
    DELAY(10);                   				   // Espera necesaria para configurar el dispositivo
    
    // Promediador de 200 muestras para obtener el offset
    for(i=0;i<=200;i++){
    	SENSOR_DATA(SLAVE_ADDRESS_MPU1, &xaux, &yaux, &zaux,&gxaux,&gyaux,&gzaux);
    	ax += xaux;
    	ay += yaux;
    	az += zaux;	
    }
    ax = ax/200;
    ay = ay/200;
    az = az/200;
    *ax_offset = ax;
    *ay_offset = ay;
    *az_offset = az-16384;
    
}

void MPU6050_INIT2(int *ax_offset, int *ay_offset, int *az_offset){
	// Rutina de configuración e inicialización el MPU6050 2
	int i;
	int xaux,yaux,zaux,gxaux,gyaux,gzaux;
	long ax = 0;
	long ay = 0;
	long az = 0;
    while(CI2C1_SelectSlave(SLAVE_ADDRESS_MPU2)!=ERR_OK){};
    I2C_WRITE_REGISTER(MPU6050_PWR_MGMT_1,0x00);  // Evitar el sleep mode
    DELAY(100);
    I2C_WRITE_REGISTER(MPU6050_CONFIG,0x00);      // DLPF
    I2C_WRITE_REGISTER(MPU6050_ACCEL_CONFIG,0x00);// +/- 2g, no self test
    I2C_WRITE_REGISTER(MPU6050_INT_PIN_CFG,0x02); //
    DELAY(10);                   				   // Espera necesaria para configurar el dispositivo
    
    // Promediador de 200 muestras para obtener el offset
    for(i=0;i<=200;i++){
    	SENSOR_DATA(SLAVE_ADDRESS_MPU2, &xaux, &yaux, &zaux,&gxaux,&gyaux,&gzaux);
    	ax += xaux;
    	ay += yaux;
    	az += zaux;	
    }
    ax = ax/200;
    ay = ay/200;
    az = az/200;
    *ax_offset = ax;
    *ay_offset = ay;
    *az_offset = az-16384;
}

// LEER LOS SENSORES

void SENSOR_READ(byte *AccelData, byte slaveAdress, byte initialAdress){
	//Rutina para obtener los valores de algun sensor del MPU-6050
	I2C_SELECT_SLAVE(slaveAdress);
	I2C_MULTIPLE_READ(initialAdress,AccelData,6);
}
 
void SENSOR_DATA(byte slaveAdress, int *AccelX, int *AccelY, int *AccelZ,int *GyroX,int *GyroY,int *GyroZ){
	// Rutina de obtencion de los valores de aceleracion y velocidad angular del acelerometro y giroscopio
	 byte AccelData[6];
	 byte GyroData[6];
	 
	 SENSOR_READ(AccelData,slaveAdress,MPU6050_ACCEL_XOUT_H);
	 SENSOR_READ(GyroData,slaveAdress,MPU6050_GYRO_XOUT_H);
	
	 // Se guardan los valores de los distintos ejes en variables independientes
	*AccelX = ((int)AccelData[0]<<8)|((int)AccelData[1]);
	*AccelY = ((int)AccelData[2]<<8)|((int)AccelData[3]);
	*AccelZ = ((int)AccelData[4]<<8)|((int)AccelData[5]);
	*GyroX = ((int)GyroData[0]<<8)|((int)GyroData[1]);
	*GyroY = ((int)GyroData[2]<<8)|((int)GyroData[3]);
	*GyroZ = ((int)GyroData[4]<<8)|((int)GyroData[5]);	
}

float GET_ROLL(float angley,float anglez){
	//Función que permite el cómputo del ángulo ROLL
	float anglex=0; // Corrección de offset
	
	if(anglez==0.0){
		if(angley<0){
			return 270;
		}
		else{
			return 90;
		}
	}
	
	else{
		anglex = (ATAN(angley/anglez))*180/PI;
		if (anglex <0) return anglex+360;
		else return anglex;
	}
		 
}

void ROLLS(float *roll_mpu1,float *roll_mpu2, int ax_offset_mpu1,int ay_offset_mpu1, int az_offset_mpu1, int ax_offset_mpu2,int ay_offset_mpu2,int az_offset_mpu2){
	// Funcion encarga de obtener los Rolls de los distintos MPUs 
	int i;
	int x,y,z,gx,gy,gz,x1,y1,z1,gx1,gy1,gz1;
	float anglex,angley,anglez, promedio1x=0, promedio1y=0, promedio1z=0, promedio2x=0, promedio2y=0, promedio2z=0;
	float yaw;
	// Promediador de 15 muestras de los acelerometros de los distintos módulos
	
	for (i=0;i<16;i++){
	SENSOR_DATA(SLAVE_ADDRESS_MPU1, &x,&y,&z,&gx,&gy,&gz);
	x -= ax_offset_mpu1;
	y -= ay_offset_mpu1;
	z -= az_offset_mpu1;
	
	promedio1x += x;
	promedio1y += y;
	promedio1z += z;
	
	}
	
	promedio1x /= 15;
	promedio1y /= 15;
	promedio1z /= 15;
	
	// Cálculo del Roll del MPU 1
	anglez=(float)promedio1z/A_R;
	angley=(float)promedio1y/A_R;
	anglex = (float)promedio1x/A_R;
	
	*roll_mpu1 = GET_ROLL(angley,anglez);
	//if(*roll_mpu1 > 90) *roll_mpu1 -= 360;
	//transf = (int) *roll_mpu1;
	//yaw_mpu1 = GET_ROLL(anglex, anglez);
}

//   ****************************** SERIAL*******************
void SERIAL(float roll_mpu1, float roll_mpu2,float distancia1,float distancia2,byte botones){
	//Rutina para el envio de distintos datos por comunicación Serial
	char buffer[18]; // Arreglo que permite el almacenamiento y transmisión de los distintos datos
	
	long auxd,auxa;
	int i;
	// Conversion de flotante de dos cifras significativas a entero y almacenamiento en los distintos bytes del arreglo 
	auxd = distancia1*100;
	buffer[0] = (byte)auxd;
	buffer[1] = (byte)(auxd>>8);
	buffer[2] = (byte)(auxd>>16);
	buffer[3] = (byte)(auxd>>24);
	
	auxd = distancia2*100;
	buffer[4] = (byte)auxd;
	buffer[5] = (byte)(auxd>>8);
	buffer[6] = (byte)(auxd>>16);
	buffer[7] = (byte)(auxd>>24);
	
	auxa = roll_mpu1*100;
	buffer[8] = (byte)auxa;
	buffer[9] = (byte)(auxa>>8);
	buffer[10] = (byte)(auxa>>16);
	buffer[11] = (byte)(auxa>>24);
	
	auxa = roll_mpu2*100;
	buffer[12] = (byte)auxa;
	buffer[13] = (byte)(auxa>>8);
	buffer[14] = (byte)(auxa>>16);
	buffer[15] = (byte)(auxa>>24);
	
	buffer[16] = botones;
	buffer[17] = 0xFF;
	
	// Transmisión del Arreglo Buffer
	for(i=0;i<18;i++){
		Term1_SendChar(buffer[i]);
	}
}

//  **************************** FUNCIONES DEL PROCESADOR*****

void DELAY(word ms){       
	// Procedimiento de retardo medido en milisegundos de espera
	Cpu_Delay100US(10*ms);
}
