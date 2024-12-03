import {create} from "zustand"
import { axiosInstance } from "../utils/axios";
import {toast} from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({

    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,
    messages : [],


    getUsers : async() => {

        set({isUsersLoading : true});

        try{
            const response = await axiosInstance.get("/messages/getusers");
            set({users : response.data.sideBarUsers});

        }catch(error){
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }finally{
            set({isUsersLoading : false});
        }
    },


    getConversation : async (userId) => { 

        set({isMessagesLoading : true});

        try {
            console.log("SelectedUserId :- ",userId);
            const response =await axiosInstance.get(`/messages/${userId}`);
           
            console.log("in get conversation :- ",response.data.messages);     
           
            set({messages : response.data.messages});

            const {messages} = get()
            console.log("Messages :- ", messages)
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading : false});
        }

    },

    sendMessage  : async(message) => {
        const {messages, selectedUser} = get();
        console.log(message);

        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, message);
            console.log(response);
            set({messages : [...messages, response.data.newMessage]})
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    },

    setSelectedUser : (selectedUser) => {
        set({selectedUser})
        // console.log("Selected User :- " + selectedUser.profilePic)
    },

    listenerForMessages : () => {
        const {selectedUser} = get();

        if(!selectedUser)
            return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {

            if(newMessage.senderId !== selectedUser._id)
                return;

            set({messages : [...get().messages, newMessage]})
        })
    },


    removeListenerToMessages : () => {

        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
})); 