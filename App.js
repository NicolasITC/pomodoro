import { StyleSheet, Text, SafeAreaView, View, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import { Audio } from "expo-av";

const colors = ["#EC8A8A", "#A2D9CE", "#D7BDE2"]

const TimePOMO = 25 * 60
const TimeSHORT = 5 * 60
const TimeBREAK = 15 * 60
const BreakINTERVAL = 3

// TODO: Reset button?
// TODO: BreakINTERVAL logic
// TODO: Task list
// TODO: Settings

export default function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(TimePOMO);
  const [currentState, setCurrentState] = useState("POMO" | "SHORT" | "BREAK"); // enum
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1)
      }, 1)
    } else {
      clearInterval(interval)
    }

    if (time === 0) {
      setIsActive(false)
      setIsWorking(prev => !prev)

      setCurrentState((prev) => {
        switch (prev) {
          case 0:
            setTime(TimeSHORT);
            return 1;
          case 1:
            setTime(TimeBREAK);
            return 2;
          case 2:
            setTime(TimePOMO);
            return 0;
          default:
            return prev;
        }
      });
    }
    return () => clearInterval(interval)
  }, [isActive, time])

  const handleStartStop = () => {
    playSound()
    setIsActive(!isActive)
  }

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/button-press.mp3")
    )
    await sound.playAsync();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentState] }]}>
      <View style={[
        { paddingTop: Platform.OS === 'android' && 45 },
        { paddingHorizontal: 15, flex: 1 }]}
      >
        <Text style={styles.pomodoro}>Pomodoro</Text>
        <Header
          setTime={setTime}
          currentState={currentState}
          setCurrentState={setCurrentState}
          setIsActive={setIsActive}
        />
        <Timer time={time} />
        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={{ color: 'white', fontWeight: 'bold' }} >{isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pomodoro: {
    color: '#1E1E1E',
    fontWeight: 'bold',
    fontSize: 32
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  },
});
