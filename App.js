import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-native-reanimated'; 
//import { useAddNoteMutation, useDeleteNoteMutation, useFetchNotesQuery, useSearchNotesQuery, useUpdateNoteMutation } from './db';

function App() {
  useDeviceContext(tw);

  return (
    <Provider store={store}>
      <SafeAreaView style={tw` h-full bg-lime-950`}>

          <Text style={tw`w-screen h-fit pt-2 pb-3 text-center px-3 text-xl text-white`}>Notes App</Text>
          
          <View style={tw`w-screen h-full bg-lime-900`}>
            
            <TouchableOpacity style={tw`rounded-full w-10 h-10 flex items-center text-lime-950 bg-white`}>
              <Text style={tw`flex items-center h-fit text-center text-2xl`}>+</Text>
            </TouchableOpacity>
          </View>
        
      </SafeAreaView>
    </Provider>
  )
}

export default App;
