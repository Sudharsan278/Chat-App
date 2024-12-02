import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatHeader from './ChatHeader.jsx';
import ChatInput from './ChatInput.jsx'
import MessagesSkeleton from './MessagesSkeleton.jsx';

const ChatContainer = () => {

  const {messages, selectedUser, getConversation, isMessagesLoading} = useChatStore();

  useEffect(() => {
    getConversation(selectedUser._id)
  }, [selectedUser._id, getConversation]);

  if(true) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader/>
        <MessagesSkeleton/>
        <ChatInput/>
      </div>
    )
  }


  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      
      <ChatHeader/>

      <p>Messages...</p>


      <ChatInput/>
    </div>
  )
}

export default ChatContainer
