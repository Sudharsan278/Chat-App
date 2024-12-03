import React, { useEffect, useState } from 'react'
import { Users } from 'lucide-react';
import { useChatStore } from '../store/useChatStore.js'
import SkeletonForSideBar from './SkeletonForSideBar.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const Sidebar = () => {

  const {getUsers, selectedUser, setSelectedUser, isUsersLoading, users } = useChatStore();
  const {onlineUsers} = useAuthStore();
  const [online, setOnline] = useState(false);


  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = online ? users.filter((user) => onlineUsers.includes(user._id)) : users ;

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

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={online}
              onChange={(e) => setOnline(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online Users</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>
      

      <div className="overflow-y-auto w-full py-3"> 
        {/* {console.log(users)} */}
        {filteredUsers.map((user) => (
          <button 
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3
                        hover:bg-base-300 transition-colors
                        ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
            {/* {console.log(user.profilePic)} */}
            
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
        ))}
      </div>

      {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
      )}

   </aside>
  )
}

export default Sidebar
