"use client"
import { useEffect, useState } from 'react';
import {generateJestCode} from '../utils/generateJestCode'

const InteractionRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [interactions, setInteractions] = useState([]);

  const interactionTemplate = {
    type: '',
    target: {
      tag: '',
      id: '',
      class: '',
      text: '',
    },
    timestamp: 0,
    value: '',
  };

  const handleRecordClick = () => {
    setIsRecording(true);
    console.log('Recording started');
    console.log(interactions);

    
    
  };

  const handleInteraction = (event) => {
    if (!isRecording) return; // 녹화 중이 아닐 때는 무시
    console.log(event)

    const interaction = {
      ...interactionTemplate,
      type: event.type,
      target: {
        tag: event.target.tagName.toLowerCase(),
        id: event.target.id || '',
        class: event.target.className || '',
        text: event.target.textContent || '',
      },
      timestamp: Date.now(),
      value: event.target.value || null, // 값이 없을 경우 null로 설정
    };

    setInteractions((prev) => [...prev, interaction]);
  };

  useEffect(() => {
    const events = [
      'click', 'dblclick', 'mouseenter', 'mouseleave',
      'input', 'change', 'focus', 'blur', 'keydown', 
      'touchstart', 'touchmove', 'touchend',
      'resize', 'scroll',
    ];

    events.forEach(event => {
      document.addEventListener(event, handleInteraction);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [isRecording]);

  useEffect(()=> {
    console.log(interactions)
  },[interactions])

  const handleRecordStop = () => {
        // 이벤트 리스너 제거 및 Jest 코드 생성
        const jestCode = generateJestCode(interactions);
        console.log(jestCode);
        setIsRecording(false)
        setInteractions([]);
  }

  return (
    <div>
      <h1>E2E Test Automation PoC</h1>
      <button onClick={handleRecordClick}>
        {'Start Recording'}
      </button>
      <input type='text' />
      <button onClick={handleRecordStop}>Stop it</button>
      {/* 여기서 다른 페이지 또는 컴포넌트를 렌더링할 수 있습니다 */}
    </div>
  );
};

export default InteractionRecorder;
