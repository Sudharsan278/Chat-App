import React, { useEffect } from 'react'
import { Users } from 'lucide-react';
import { useChatStore } from '../store/useChatStore.js'
import SkeletonForSideBar from './SkeletonForSideBar.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const Sidebar = () => {

  const {getUsers, currentUser, setCurrentUser, isUsersLoading, users } = useChatStore();
  const {onlineUsers} = useAuthStore();


  useEffect(() => {
    getUsers();
  }, [getUsers]);


  if(isUsersLoading){
    return <SkeletonForSideBar/>
  }


  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
        </div>

      </div>

      <div className="overflow-y-auto w-full py-3"> 
  {Array.isArray(users) && users.length > 0 ? (
    users.map((user) => (
      <button 
        key={user._id}
        onClick={() => setCurrentUser(user)}
        className={`w-full p-3 flex items-center gap-3
                    hover:bg-base-300 transition-colors
                    ${currentUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
        
        <div className="relative mx-auto lg:mx-0">
          <img
            src={user.profilePic || "/profile.png"}
            alt={user.name}
            className="size-12 object-cover rounded-full"
          />
          {onlineUsers.includes(user._id) && (
            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
          )}
        </div>

        <div className="hidden lg:block text-left min-w-0">
          <div className="font-medium truncate">{user.fullName}</div>
          <div className="text-sm text-zinc-400">
            {onlineUsers.includes(user._id) ? "Online" : "Offline"}
          </div>
        </div>
      </button>
    ))
  ) : (
    <p>No users found</p> // Handle empty or non-array cases here
  )}
</div>


   </aside>
  )
}

export default Sidebar
