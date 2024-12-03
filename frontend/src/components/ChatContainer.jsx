import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatHeader from './ChatHeader.jsx';
import ChatInput from './ChatInput.jsx'
import MessagesSkeleton from './MessagesSkeleton.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { formatTime } from '../utils/formatTime.js';

const ChatContainer = () => {

  const {messages, selectedUser, getConversation, isMessagesLoading, listenerForMessages, removeListenerToMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const scrollToEndRef = useRef();

  useEffect(() => {
    getConversation(selectedUser._id);

    listenerForMessages();

    return (
      removeListenerToMessages
    ) 
  }, [selectedUser._id, getConversation, listenerForMessages, removeListenerToMessages]);

  useEffect(() => {
    if(messages && scrollToEndRef.current)
      scrollToEndRef.current.scrollIntoView({behavior : "smooth"})
  } , [messages])


  if(isMessagesLoading) {
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

      <div  className="flex-1 overflow-y-auto p-4 space-y-4">

      {messages.map((message) => (
        
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser.user._id ? "chat-end" : "chat-start"}`}
            ref = {scrollToEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser.user._id
                      ? authUser.user.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />

              </div>
            </div>

            <div className="chat-header mb-1">
              
              <time className="text-xs opacity-50 ml-1">
                {formatTime(message.createdAt)}
              </time>
            
            </div>
           
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.message && <p>{message.message}</p>}
            </div>
          
          </div>
        
        ))}      
      </div>

      <ChatInput/>
    </div>
  )
}

export default ChatContainer
