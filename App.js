import { SafeAreaView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import { AntDesign } from '@expo/vector-icons';
import MasonryList from '@react-native-seoul/masonry-list';
import { useAddNoteMutation, useDeleteNoteMutation, useFetchNotesQuery, useSearchNotesQuery, useUpdateNoteMutation } from './db';
import { useEffect } from 'react';

function App() {
  useDeviceContext(tw);

  // data prop in flatlist
  const { date } = useFetchNotesQuery();
  const [addNote] = useAddNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const { data } = useSearchNotesQuery();
  const [updateNote] = useUpdateNoteMutation();
  
  // keyextracter takes in item prop, returns item.id
  // renderitem takes in item prop and i?, generates the html component to display


  return (
    <Provider store={store}>
      <SafeAreaView style={tw` h-full bg-lime-950`}>

          <Text style={tw`w-screen pt-3 pb-3 text-center px-3 text-xl font-bold text-white`}>Notes App</Text>
          
          <View style={tw`flex-1 relative bg-lime-900`}>

            <View style={tw`bg-lime-950 py-1 px-3 my-2 mx-1 rounded-full`}>
              <TextInput style={tw`py-1 px-2 text-base text-white`} placeholder='Search' placeholderTextColor="white">
              </TextInput>
            </View>

            <MasonryList></MasonryList>
            

            <TouchableOpacity style={tw`absolute bottom-8 right-8`}>
              <AntDesign name="pluscircle" size={42} color="white" style={tw`text-center`} />
            </TouchableOpacity>
            
          </View>
          
          
          
      </SafeAreaView>
    </Provider>
  )
}

export default App;
