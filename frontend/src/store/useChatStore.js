import {create} from "zustand"
import { axiosInstance } from "../utils/axios";
import {toast} from 'react-hot-toast';

export const useChatStore = create((set) => ({

    currentUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,
    messages : [],
    users : [],


    getUsers : async() => {

        set({isUsersLoading : true});

        try{

            const response = await axiosInstance.get("/messages/getusers");
            set({users : response.data});

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
            set({message : response.data});
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading : false});
        }

    },

    setCurrentUser : (currentUser) => {
        set({currentUser})
    }


})); 