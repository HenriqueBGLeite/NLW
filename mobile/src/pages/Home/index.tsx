import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { 
  View, 
  ImageBackground, 
  Text, 
  Image, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform   
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string
}

interface DataItems {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] =useState<DataItems[]>([]);
  const [ufSelected, setUfSelected] = useState('');
  const [cities, setCities] =useState<DataItems[]>([]);
  const [citySelected, setCitySelected] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla); 

        ufInitials.map(sigla => {
          console.log(sigla);
          setUfs([...ufs, {label: sigla, value: sigla}]);
        });
      });
  }, []);

  useEffect(() => {
    if (ufSelected === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected}/municipios`)
      .then(response => {
      const cityNames = response.data.map(city => city.nome);
      cityNames.map(nome => setCities([...cities, { label: nome, value: nome}]));
    });
  }, [ufSelected]);

  function handleNavigateToPoints() {
    console.log(ufSelected);
    navigation.navigate('Points', {
      ufSelected, 
      citySelected
    });
  }

  function handleSelectedUf(value: string) {
    console.log(value);
  };

  return( 
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
        
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setUfSelected(value)}
              placeholder={{
                label: 'Selecione o estado',
                value: null,
                color: '#A0A0B2',
              }}
              items={ufs}
              Icon={() => {
                return (
                  <View style={pickerSelectStyles.buttonIcon}>
                    <Icon name="chevron-down" size={24} color="#A0A0B2" />
                  </View>
                );
              }}
          />
          <RNPickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setCitySelected(value)}
              placeholder={{
                label: 'Selecione a cidade',
                value: null,
                color: '#A0A0B2',
              }}
              items={cities}
              Icon={() => {
                return (
                  <View style={pickerSelectStyles.buttonIcon}>
                    <Icon name="chevron-down" size={24} color="#A0A0B2" />
                  </View>
                );
              }}
          />         

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'transparent',
    color: '#A0A0B2',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default Home;