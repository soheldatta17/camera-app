import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as FaceDetector from 'expo-face-detector';

const CameraScreen = () => {
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef(null);

  const toggleCameraType = () => {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const handleCapture = async () => {
    try {
      if (cameraRef.current) {
        const { uri } = await cameraRef.current.takePictureAsync();

        await MediaLibrary.saveToLibraryAsync(uri);

        const faces = await detectFaces(uri);
        showFaceDetectionAlert(faces);

        console.log('Photo captured and saved to camera roll');
      } else {
        console.error('cameraRef is null or undefined');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const detectFaces = async (photoUri) => {
    try {
      
  
      const result = await FaceDetector.detectFacesAsync(photoUri);
  
      if (result.faces) {
        return result.faces;
      } else {
        console.log('No faces detected');
        return [];
      }
    } catch (error) {
      console.error('Error detecting faces:', error);
      return [];
    }
  };
  

  const showFaceDetectionAlert = (faces) => {
    // Customize your alert here based on the detected faces
    Alert.alert(
      'Face Detection Result',
      `Detected ${faces.length} face(s) in the photo!`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <Camera style={styles.camera} type={type} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <View style={styles.captureContainer}>
            <Ionicons name="camera" size={60} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <View style={styles.containerd}>
            <Ionicons name="camera-reverse" size={60} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </Camera>
  );
};

export default function App() {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  containerd: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlignVertical:10
  },
});
