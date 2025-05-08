import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Image,
  SafeAreaView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

const DenunciaScreen = () => {
  const [descripcion, setDescripcion] = useState('');
  const [moduloPolicial, setModuloPolicial] = useState('EPI_N5_JAIHUAYCO');
  const [horaIncidente, setHoraIncidente] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tipoIncidente, setTipoIncidente] = useState('');
  const [calleAvenida, setCalleAvenida] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  // Datos para los ComboBox
  const modulosPoliciales = [
    { label: 'EPI Nº 5 ALALAY', value: 'EPI_N5_Alalay' },
    { label: 'EPI Nº 1 COÑA COÑA', value: 'EPI_N1_Coña Coña' },
    { label: 'EPI Nº 3 JAIHUAYCO', value: 'EPI_N3_Jaihuayco' },
    { label: 'EPI Nº 7 SUR', value: 'EPI_N7_Sur' },
    { label: 'EPI Nº 6 CENTRAL', value: 'EPI_N6_Central' },
  ];

  const tiposIncidente = [
    { label: 'Asesinato', value: 'ASESINATO' },
    { label: 'Asalto', value: 'ASALTO' },
    { label: 'Accidente de tránsito', value: 'ACCIDENTE_TRANSITO' },
    { label: 'Violencia doméstica', value: 'VIOLENCIA_DOMESTICA' },
    { label: 'Disturbio publico', value: 'DISTURBIO_PUBLICO' },
    { label: 'Otro', value: 'OTRO' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setHoraIncidente(selectedTime);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = () => {
    if (!descripcion) {
      Alert.alert('Error', 'La descripción del incidente es obligatoria');
      return;
    }
    if (!moduloPolicial) {
      Alert.alert('Error', 'Debe seleccionar un módulo policial');
      return;
    }
    if (!tipoIncidente) {
      Alert.alert('Error', 'Debe seleccionar un tipo de incidente');
      return;
    }
    if (!calleAvenida) {
      Alert.alert('Error', 'Debe ingresar la calle o avenida');
      return;
    }

    const denunciaData = {
      descripcion,
      moduloPolicial,
      horaIncidente: formatTime(horaIncidente),
      tipoIncidente,
      calleAvenida,
      imagen: selectedImage,
    };

    console.log('Datos de denuncia:', denunciaData);
    Alert.alert('Éxito', 'Denuncia enviada correctamente', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const PickerField = ({ value, onValueChange, items, placeholder }: any) => {
    return Platform.OS === 'ios' ? (
      <View style={styles.selectContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item: any) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
        <View style={styles.pickerArrows}>
          <FontAwesome name="chevron-up" size={12} color="#666" />
          <FontAwesome name="chevron-down" size={12} color="#666" />
        </View>
      </View>
    ) : (
      <View style={styles.selectContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item: any) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.menuSuperior}>
      <Stack.Screen 
        options={{
          headerTitle: " Nueva Denuncia",
          headerStyle: {
            backgroundColor: '#2e5929',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView contentContainerStyle={styles.contenedor}>
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Descripcion del incidente *</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Ingrese una descripcion"
            placeholderTextColor="#8D6E63" 
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Modulos policiales *</Text>
          <PickerField
            value={moduloPolicial}
            onValueChange={(value: string) => setModuloPolicial(value)}
            items={modulosPoliciales}
            placeholder="Seleccione un módulo policial"
          />

          <Text style={styles.seccionTitulo}>Hora del incidente *</Text>
          <TouchableOpacity 
            style={styles.timePickerButton} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.textoTiempo}>{formatTime(horaIncidente)}</Text>
            <View style={styles.pickerArrows}>
              <FontAwesome name="chevron-up" size={12} color="#666" />
              <FontAwesome name="chevron-down" size={12} color="#666" />
            </View>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={horaIncidente}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.seccionTitulo}>Tipo de incidente *</Text>
          <PickerField
            value={tipoIncidente}
            onValueChange={(value: string) => setTipoIncidente(value)}
            items={tiposIncidente}
            placeholder="Tipo de incidente"
          />

          <Text style={styles.seccionTitulo}>Calle o Avenida *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la calle"
            placeholderTextColor="#8D6E63"
            value={calleAvenida}
            onChangeText={setCalleAvenida}
          />
        </View>

        <View style={styles.seccionImagen}>
          {selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.seleccionDeImagen}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
            <FontAwesome name="image" size={50} color="#ccc" />
            <Text style={styles.placeholderText}>Ninguna imagen seleccionada</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={pickImage}
          >
            <FontAwesome name="cloud-upload" size={24} color="black" />
            <Text style={styles.uploadButtonText}>Subir Imagen</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Denuncia</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menuSuperior: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contenedor: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  seccion: {
    marginBottom: 15,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  timePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  textoTiempo: {
    fontSize: 16,
    color: '#333',
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  pickerArrows: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 30,
    paddingRight: 15,
  },
  seccionImagen: {
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderImage: {
    width: '70%',
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  seleccionDeImagen: {
    width: '90%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
    height: 58,
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#FFD600',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    borderWidth:1
  },
  submitButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholderContainer: {
    width: '80%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    color: '#999',
  },
});

export default DenunciaScreen;