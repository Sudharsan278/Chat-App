import {create} from "zustand"
import { axiosInstance } from "../utils/axios";
import {toast} from 'react-hot-toast';

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
            const response = axiosInstance.get(`/messages/${userId}`);
            set({message : response.data.messages});
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading : false});
        }

    },

    sendMessage  : async(message) => {
        const {messages, selectedUser} = get();

        try {
            const response =axiosInstance.post(`/messages/send/${selectedUser._id}`, message);
            set({messages : [...messages, response.data.messages]})
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    },

    setSelectedUser : (selectedUser) => {
        set({selectedUser})
        // console.log("Selected User :- " + selectedUser.profilePic)
    }


})); 