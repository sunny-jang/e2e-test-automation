"use client"
import { useEffect, useState } from 'react';
import { generateJestCode} from '../utils/generateJestFile'
import { getPathPage } from '../utils/getPathPage';

const InteractionRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  interface Interaction {
    type: string; // The type of the interaction (e.g., 'click', 'input')
    target: {
      tag: string;   // The tag of the target element (e.g., 'button', 'input')
      id: string;    // The ID of the target element
      class: string; // The class of the target element
      text: string;  // The text content of the target element
    };
    timestamp: number; // The timestamp of the interaction (in milliseconds)
    value: unknown;      // The value associated with the interaction (for input events)
  }

  const interactionTemplate : Interaction = {
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

  type EventTypes = MouseEvent | KeyboardEvent | InputEvent | Event;

  const handleInteraction = (event: EventTypes) => {
    if (!isRecording) return; // 녹화 중이 아닐 때는 무시
    console.log(event)
    const target = event.target as HTMLElement;

    const interaction: Interaction = {
      ...interactionTemplate,
      type: event.type,
      target: {
        tag: target.tagName.toLowerCase(),
        id: target.id || '',
        class: target.className || '',
        text: target.textContent || '',
      },
      timestamp: Date.now(),
      value: 'value' in target ? target.value : "null", // 값이 없을 경우 null로 설정
    };

    setInteractions((prev) => [...prev, interaction]);
  };

  useEffect(() => {
    const events = [
      'click', 
      'input', 'change', 'focus', 'blur', 'keydown', 
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
        const pagePath = getPathPage()
        const jestCode = generateJestCode(interactions, pagePath);
        console.log(jestCode);
        // writeGeneratedTestFile(interactions)
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
