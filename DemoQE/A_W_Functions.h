/*
 * A_W_Functions.h
 *
 *  Created on: Oct 18, 2016
 *      Author: Zulai
 */

#ifndef A_W_FUNCTIONS_H_
#define A_W_FUNCTIONS_H_

#include "PE_Types.h"
#include "PE_Error.h"
#include "PE_Const.h"
#include "IO_Map.h"
#include "CI2C1.h"

//************************************************************************
//*             DIRECCIONES DE LOS REGISTROS DE LOS SLAVES               *
//************************************************************************

//Dirección I2C de la IMU 1 AZUL
#define SLAVE_ADDRESS_MPU1 0x68
//Dirección I2C de la IMU 2 VERDE
#define SLAVE_ADDRESS_MPU2 0x69

#define MPU6050_SMPLRT_DIV     	0x19   // R/W
#define MPU6050_CONFIG         	0x1A   // R/W
#define MPU6050_GYRO_CONFIG    	0x1B   // R/W
#define MPU6050_ACCEL_CONFIG   	0x1C   // R/W

#define MPU6050_INT_PIN_CFG    	0x37   // R/W
#define MPU6050_INT_ENABLE     	0x38   // R/W
#define MPU6050_INT_STATUS     	0x3A   // R

#define MPU6050_ACCEL_XOUT_H   	0x3B   // R
#define MPU6050_ACCEL_XOUT_L   	0x3C   // R
#define MPU6050_ACCEL_YOUT_H   	0x3D   // R
#define MPU6050_ACCEL_YOUT_L   	0x3E   // R
#define MPU6050_ACCEL_ZOUT_H   	0x3F   // R
#define MPU6050_ACCEL_ZOUT_L   	0x40   // R

#define MPU6050_GYRO_XOUT_H   	0x43   // R
#define MPU6050_GYRO_XOUT_L   	0x44   // R
#define MPU6050_GYRO_YOUT_H   	0x45   // R
#define MPU6050_GYRO_YOUT_L   	0x46   // R
#define MPU6050_GYRO_ZOUT_H   	0x47   // R
#define MPU6050_GYRO_ZOUT_L   	0x48   // R

#define MPU6050_TEMP_OUT_H     	0x41   // R
#define MPU6050_TEMP_OUT_L     	0x42   // R


#define MPU6050_PWR_MGMT_1     0x6B   // R/W
#define MPU6050_FIFO_R_W       	0x74   // R/W
#define MPU6050_WHO_AM_I       	0x75   // R

//************************************************************************
//*                    Constantes de Conversion                          *
//************************************************************************


#define A_R 16384.0  //Ratios de conversion de bits a g

#define PI 3.1415926

//************************************************************************
//*    			 	          FUNCIONES                                  *
//************************************************************************

//*****************            Matematica            *********************


float ATAN(float y);
float ATAN2(float  num,float den);

//*****************Funciones Para los Sensores MPU6050*********************






///FUNCIONES DE CONFIGURACION DE LOS MPU6050

void MPU6050_INIT1(int *ax_offset, int *ay_offset, int *az_offset);
void MPU6050_INIT2(int *ax_offset, int *ay_offset, int *az_offset);

// FUNCIONES PARA LEER LOS SENSORES

void SENSOR_READ(byte *AccelData, byte slaveAdress, byte initialAdress);
void SENSOR_DATA(byte slaveAdress, int *AccelX, int *AccelY, int *AccelZ,int *GyroX,int *GyroY,int *GyroZ);
float GET_ROLL(float angley,float anglez);
void ROLLS(float *roll_mpu1,float *roll_mpu2,int ax_offset_mpu1,int ay_offset_mpu1, int az_offset_mpu1, int ax_offset_mpu2,int ay_offset_mpu2,int az_offset_mpu2);

//FUNCIONES PARA REALIZAR I2C

byte I2C_WRITE_REGISTER(byte addressReg,byte data);
byte I2C_READ(byte addressReg);
void I2C_MULTIPLE_READ(byte InitialAddress,byte *DataArray,word size);
void I2C_SELECT_SLAVE(byte slaveAddress);

//PROMEDIADORES MOVILES
float ULTRA1 (void);
float ULTRA2 (void);


// FUNCION PARA TRANSMITIR POR COMUNICACION SERIAL
void SERIAL(float roll_mpu1, float roll_mpu2,float distancia1,float distancia2,byte botones);

//FUNCION DELAY  
void DELAY(word ms);


#endif /* A_W_FUNCTIONS_H_ */
