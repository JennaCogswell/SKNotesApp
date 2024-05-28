import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import { AntDesign } from '@expo/vector-icons';
import MasonryList from '@react-native-seoul/masonry-list';
import { useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAddNoteMutation, useDeleteNoteMutation, useFetchNotesQuery, useSearchNotesQuery, useUpdateNoteMutation } from './db';
import { useEffect, useLayoutEffect, useState } from 'react';

function HomeScreen({navigation}) {
  const [ addNote, {data: addNoteData, error: addNoteError}] = useAddNoteMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchData, error, isLoading } = useSearchNotesQuery(searchQuery);


  // when new note added, navigate to edit page
  useEffect(() => {
    if (addNoteData != undefined) {
      console.log(addNoteData.title);
      navigation.navigate("Edit", {data: addNoteData});
    }
  }, [addNoteData]);
  
  // component to render for each note item
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Edit", {data: item}) } style={tw`w-[96%] mb-2 mx-auto bg-lime-200 rounded-2xl px-2 py-2`}> 
      <Text style={tw`font-bold text-lg`}>{item.title}</Text>
      <Text style={tw``} numberOfLines={5}>{item.content}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={tw`flex-1 bg-stone-900`}>

      <View style={tw`bg-lime-100 py-1 px-3 my-2 mx-1 border-2 rounded-full`}>
        <TextInput style={tw`py-1 px-1 text-base text-black`} placeholder='Search' placeholderTextColor="black" value={searchQuery} onChangeText={(newValue) => {setSearchQuery(newValue)}}>
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
        addNote({title:"", content: ""});
       }} 
       style={tw`bg-lime-100 border-2 border-stone-900 rounded-full absolute bottom-[5%] right-8 mx-auto items-center flex-1 justify-center w-12 h-12`}>
        <Text style={tw`text-black text-center text-4xl mt--0.5`}>+</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

function EditScreen({ route, navigation }) {
  const [content, setContent] = useState(route.params.data.content);
  const [title, setTitle] = useState(route.params.data.title);
  const [ deleteNote, {data: deleteNoteData, error: deleteNoteError}] = useDeleteNoteMutation();
  const [updateNote, {data: updateNoteData, error: updateNoteError}] = useUpdateNoteMutation();
  const inputRef = useRef(null);

  // when delete button pressed, delete from db then navigate back to notes page
  const handleDelete = () => {
    deleteNote({ id: route.params.data.id });
    navigation.navigate("Notes");
  };

  useLayoutEffect(() => {
    navigation.setOptions({ 
      // create custom textinput component for the note headerTitle to edit title
      headerTitle: () => (
        <TextInput
          style={tw`text-white font-bold text-lg`}
          placeholder='Title'
          placeholderTextColor='#DDD'
          value={title}
          onChangeText={(newTitle) => setTitle(newTitle)}
        />
      ),
      // add delete button icon on the right of note header
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={tw`mr-1`}>
          <AntDesign name="delete" size={24} color="white" />
        </TouchableOpacity>
      ),
     });
  });

  // when title or content changed in textinput, update note data
  useEffect(() => {
    updateNote({id: route.params.data.id, title: title, content: content});
  }, [content, title])

  // on component mount, set cursor focus on content text input
  useEffect(() => {
    inputRef.current.focus();
  }, [])

  // wrap textinput in a full page touchable opacity, so wherever page is pressed, cursur will focus on content text input
  return (
    <View style={tw`flex-1 bg-lime-200 p-2`}>
      <TouchableOpacity style={tw`w-full h-full`} onPress={()=> {inputRef.current.focus()}}>
        <TextInput style={tw``} ref={inputRef} value={content} multiline onChangeText={(newValue)=> {setContent(newValue)}}></TextInput>
      </TouchableOpacity>
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
              headerTitleStyle: tw`font-bold text-xl`,
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
