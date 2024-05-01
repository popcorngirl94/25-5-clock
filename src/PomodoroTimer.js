import React, { useState, useRef } from 'react';
import { IoArrowDownOutline } from "react-icons/io5";
import { IoArrowUpOutline } from "react-icons/io5";
import { CgPlayPauseO } from "react-icons/cg";
import { LuTimerReset } from "react-icons/lu";
import BeepSound from './audio/beep.mp3';
import './App.css';

const PomodoroTimer = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const audioRef = useRef(new Audio(BeepSound));


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const startStopTimer = () => {
    if (!timerRunning) {
      const id = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            audioRef.current.play(); // Play audio when the timer reaches 00:00
            clearInterval(id);
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              setTimeLeft(breakLength * 60);
            } else {
              setTimerLabel("Session");
              setTimeLeft(sessionLength * 60);
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    setTimerRunning(!timerRunning);
  };
  

  const resetTimer = () => {
    clearInterval(intervalId);
    setTimerRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
  };

  const adjustSessionLength = (amount) => {
    if (!timerRunning) {
      const newSessionLength = sessionLength + amount;
      if (newSessionLength > 0 && newSessionLength <= 60) {
        setSessionLength(newSessionLength);
        if (timerLabel === "Session") {
          setTimeLeft(newSessionLength * 60);
        }
      }
    }
  };

  const adjustBreakLength = (amount) => {
    if (!timerRunning) {
      const newBreakLength = breakLength + amount;
      if (newBreakLength > 0 && newBreakLength <= 60) {
        setBreakLength(newBreakLength);
        if (timerLabel === "Break") {
          setTimeLeft(newBreakLength * 60);
        }
      }
    }
  };

  return (
    <div className="wrapper">
    <div className="tabs">
      <div className="tab" id="break-tab">
        Break Length
      </div>
      <div className="tab" id="session-tab">
        Session Length
      </div>
    </div>
    <div className="controls-container">
      <div className="timer-controls" id="break-controls">
        <button id="break-decrement" onClick={() => adjustBreakLength(-1)}><IoArrowDownOutline /></button>{breakLength}<button id="break-increment" onClick={() => adjustBreakLength(1)}><IoArrowUpOutline /></button>
      </div>
      <div className="timer-controls" id="session-controls">
        <button id="session-decrement" onClick={() => adjustSessionLength(-1)}><IoArrowDownOutline /></button>{sessionLength}<button id="session-increment" onClick={() => adjustSessionLength(1)}><IoArrowUpOutline /></button>
      </div>
    </div>
    <div className="timer-container">
      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>
      <div className="timer-buttons">
        <button id="start_stop" onClick={startStopTimer}><CgPlayPauseO /></button>
        <button id="reset" onClick={resetTimer}><LuTimerReset /></button>
      </div>
      <audio id="beep" ref={audioRef} src={BeepSound}/>
    </div>
  </div>
  );
};

export default PomodoroTimer;
