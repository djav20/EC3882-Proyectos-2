#include "cpu.h"
#include "A_W_Functions.h"

// Arcotangente. Rango: [-PI/2,PI/2] 
float ATAN(float y){                               
	float x = y;
	float angle = 0;
    if(x>1.4 || x<-1.4){
        angle = ATAN(1/x);
        if(x > 0){
            angle= (float)(PI/2 - angle);
        }
        else{
            angle= (float)(-PI/2 -angle);
        }
    }
    else{
        if (x >= 0.5){
            angle = (float)(0.015 + x*(1.0311+ x*(-0.2608)));     // L�nea de tendencia de Excel
        }
        else if (x <= -0.5){
        	angle = (float)(-0.015 + x*(1.0311+ x*(0.2608)));     // L�nea de tendencia de Excel
        }
        else{
			angle = x*x;
			angle = (float)(x*(1.0+angle*(-0.333+angle*(0.2+angle*(-0.1429)))));
        }
    }
    return angle;
}


// I2C

// Envia dos datos por I2C.
byte I2C_WRITE_REGISTER(byte addressReg, byte data){
	word snd = 0;
	word size = 2;
	byte err;
	byte frame[2];
	frame[0] = addressReg;        
	frame[1] = data;
	while(err=CI2C1_SendBlock(frame, size, &snd) != ERR_OK){};
	return err; // Retornar codigo de error.
}

// Recibe un byte del sensor.
byte I2C_READ(byte addressReg){
	byte data =0;
	CI2C1_SendChar(addressReg);
	CI2C1_RecvChar(&data);
	return data;
}
// Recibe multiples bytes del sensor.
void I2C_MULTIPLE_READ(byte InitialAddress, byte *DataArray, word size){
	word snd = 0;
	CI2C1_SendChar(InitialAddress);
	CI2C1_RecvBlock(DataArray, size, &snd);
}

// Seleccionamos el esclavo al que le hablaremos.
void I2C_SELECT_SLAVE(byte slaveAddress){
	while(CI2C1_SelectSlave(slaveAddress)!=ERR_OK) ;
}


// Inicializacion del MPU6050.
void MPU6050_INIT1(int *ax_offset, int *ay_offset, int *az_offset){
	int i;
	int xaux, yaux, zaux, gxaux, gyaux, gzaux;
	long ax = 0;
	long ay = 0;
	long az = 0;
    while(CI2C1_SelectSlave(SLAVE_ADDRESS_MPU1)!=ERR_OK){};

    I2C_WRITE_REGISTER(MPU6050_PWR_MGMT_1, 0x00);  // Evitar el sleep mode.
    delayMS(100);
    I2C_WRITE_REGISTER(MPU6050_SMPLRT_DIV, 0x00);   // Dejamos la tasa de muestreo en 8kHz la cual sera truncada por el DLPF.
    I2C_WRITE_REGISTER(MPU6050_CONFIG, 0x00);      // DLPF.
    I2C_WRITE_REGISTER(MPU6050_ACCEL_CONFIG, 0x00);// +/- 2g, no self test.
    I2C_WRITE_REGISTER(MPU6050_GYRO_CONFIG, 0x08); // +/- 500 dps, no self test.
    I2C_WRITE_REGISTER(MPU6050_INT_PIN_CFG, 0x02); //
    delayMS(10);                   				   // Espera necesaria para configurar el dispositivo.
    
    // Promediador de 200 muestras para obtener el offset.
    for(i = 0; i <= 200; i++){
    	SENSOR_DATA(SLAVE_ADDRESS_MPU1, &xaux, &yaux, &zaux, &gxaux, &gyaux, &gzaux);
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


// Leemos los valores del esclavo en la ruta especificada.
void SENSOR_READ(byte *AccelData, byte slaveAdress, byte initialAdress){
	I2C_SELECT_SLAVE(slaveAdress);
	I2C_MULTIPLE_READ(initialAdress, AccelData, 6);
}
 
// Lee los valores del acelerometro y osciloscopio del MPU6050.
void SENSOR_DATA(byte slaveAdress, int *AccelX, int *AccelY, int *AccelZ,int *GyroX,int *GyroY,int *GyroZ){
	byte AccelData[6];
	byte GyroData[6];
	
	SENSOR_READ(AccelData, slaveAdress, MPU6050_ACCEL_XOUT_H);
	SENSOR_READ(GyroData, slaveAdress, MPU6050_GYRO_XOUT_H);
	
	 // Se guardan los valores de los distintos ejes en variables independientes.
	*AccelX = ((int)AccelData[0]<<8)|((int)AccelData[1]);
	*AccelY = ((int)AccelData[2]<<8)|((int)AccelData[3]);
	*AccelZ = ((int)AccelData[4]<<8)|((int)AccelData[5]);
	*GyroX = ((int)GyroData[0]<<8)|((int)GyroData[1]);
	*GyroY = ((int)GyroData[2]<<8)|((int)GyroData[3]);
	*GyroZ = ((int)GyroData[4]<<8)|((int)GyroData[5]);	
}

// Calculamos el angulo ROLL
float GET_ROLL(float angley, float anglez){
	float anglex = 0; // Correccion de offset.
	if(anglez == 0.0){
		if(angley < 0){
			return 270;
		}
		else{
			return 90;
		}
	}
	else{
		anglex = (ATAN(angley/anglez))*180/PI;
		if (anglex < 0) return anglex + 360;
		else return anglex;
	}
		 
}

// Retorna el angulo roll del MPU6050.
void ROLLS(float *roll_mpu1, int ax_offset_mpu1, int ay_offset_mpu1, int az_offset_mpu1){
	int i;
	int x, y, z, gx, gy, gz, x1, y1, z1, gx1, gy1, gz1;
	float anglex, angley, anglez, promedio1x = 0, promedio1y = 0, promedio1z = 0;
	
	// Promediador de 15 muestras de los acelerometros.
	for (i = 0; i < 16; i++){
		SENSOR_DATA(SLAVE_ADDRESS_MPU1, &x, &y, &z, &gx, &gy, &gz);
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
	
	anglez = (float) promedio1z/A_R;
	angley = (float) promedio1y/A_R;
	anglex = (float) promedio1x/A_R;
	
	*roll_mpu1 = GET_ROLL(angley,anglez);
	//yaw_mpu1 = GET_ROLL(anglex, anglez);
}

// Delay de milisegundos.
void delayMS(word ms){       
	Cpu_Delay100US(10*ms);
}
