import { SafeAreaView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import { AntDesign } from '@expo/vector-icons';
import MasonryList from '@react-native-seoul/masonry-list';
import { useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAddNoteMutation, useDeleteNoteMutation, useFetchNotesQuery, useSearchNotesQuery, useUpdateNoteMutation } from './db';
import { useEffect, useLayoutEffect } from 'react';

function HomeScreen({navigation}) {
  // data prop in flatlist
  const [ addNote, {data: addNoteData, error: addNoteError}] = useAddNoteMutation();
  const { data: searchData, error, isLoading } = useSearchNotesQuery("");

  useEffect(() => {
    if (addNoteData != undefined) {
      console.log(addNoteData.title);
      navigation.navigate("Edit", {data: addNoteData});
    }


  }, [addNoteData, searchData]);
  
  // keyextracter takes in item prop, returns item.id
  // renderitem takes in item prop and i?, generates the html component to display

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Edit", {data: item}) } style={tw`w-[96%] mb-2 mx-auto bg-lime-200 rounded-full px-3 py-1.5`}> 
      <Text style={tw`font-bold `}>{item.title}</Text>
      <Text style={tw``}>{item.content}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={tw`flex-1 bg-stone-900`}>

      <View style={tw`bg-lime-100 py-1 px-3 my-2 mx-1 border-2 rounded-full`}>
        <TextInput style={tw`py-1 px-2 text-base text-black`} placeholder='Search' placeholderTextColor="black">
        </TextInput>
      </View>

      <View style={tw`flex-1 items-center justify-center bg-stone-900`}>

      {searchData ? 
        <MasonryList
          style={tw`px-0.5 pt-0.5 pb-20`}
          data={searchData}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />  
        : <></>
      }
      <TouchableOpacity onPress={() => { 
        addNote({title:"Title", content: ""});
       }} 
       style={tw`bg-lime-100 rounded-full absolute bottom-[5%] right-8 mx-auto items-center flex-1 justify-center w-12 h-12`}>
        <Text style={tw`text-black text-center text-3xl mt--1`}>+</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

function EditScreen({ route, navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({ title: route.params.data.title });
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [])

  const [updateNote, {data: updateNoteData, error: updateNoteError}] = useUpdateNoteMutation();
  const inputRef = useRef(null);
  

  return (
    <View style={tw`flex-1 bg-lime-200 p-2`}>
      <TextInput style={tw`w-full h-full `} ref={inputRef}>{route.params.data.content}</TextInput>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  useDeviceContext(tw);

  

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Notes">
          <Stack.Screen
            options={{
              headerStyle: tw`bg-stone-900 border-0`,
              headerTintColor: '#FFF',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Notes"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: tw`bg-stone-900 border-0`,
              headerTintColor: '#FFF',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Edit"
            component={EditScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App;
