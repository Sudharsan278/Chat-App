import {create} from "zustand"
import { axiosInstance } from "../utils/axios.js"
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

const BASE_URL = 'http://localhost:5000';

export const useAuthStore = create((set, get) => ({

    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isUpdatingName : false,
    onlineUsers : [],
    socket : null,

    isCheckingAuth : true,

    checkAuth : async () => {
        try {
            
            const response = await axiosInstance.get("/auth/check")
            set({authUser : response.data});
            get().connectToSocket();
        } catch (error) {
            console.log("Error in checkAuth ", error);
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false})
        }
    },

    signUp : async (userData) => {
        
        try {
            set({isSigningUp : true});
            const response = await axiosInstance.post("/auth/signup", userData)
            set({authUser : response.data});
            toast.success("Account Created Successfully!");
            get().connectToSocket();
            

        } catch (error) {
            console.log("Error in Signup :- ",error.message);
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }finally{
            set({isSigningUp : false});
        } 
    },


    login : async (userData) => {
        
        try {
            set({isLoggingIn : true});
            const response = await axiosInstance.post("/auth/login", userData);
            set({authUser : response.data});
            toast.success("Logged In Successfully!");
            get().connectToSocket();
        } catch (error) {
            console.log("Error in login :- ", error.message);
            toast.error(error.response.data.message);    
        }finally{
            set({isLoggingIn : false});
        }
    },

    logout : async () => {

        try{
            const response = await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success("Looged Out Successfully!");
            get().disconnectFromSocket();
        }catch(error){
            console.log("Error in logout :- ", error.message);
            toast.error(error.response.data.message);
        }
    },

    updateProfile : async(userData) => {

        set({isUpdatingProfile : true});

        try {
            const response = await axiosInstance.put("/auth/updateprofile", userData);
            set({authUser : response.data});
            toast.success("Profile Picture Update Successfully!");
        } catch (error) {
            console.log("Error in updateProfile :- ", error.message);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile : false});
        }
    }, 

    updateUserName : async (fullName) => {
        
        set({isUpdatingName : true});
        try {
            console.log(fullName);
            const response = await axiosInstance.put("/auth/updatename", {fullName});
            set({authUser : response.data});
            toast.success("Name Updated Successfully!");

        } catch (error) {
            console.log("Error in updateUserName :- ", error.message);
            // toast.error(response.data.error.message);
        }finally{
            set({isUpdatingName : false})
        }
    }, 

    connectToSocket : () => {

        const {authUser} = get();
        // console.log("AuthUser :- ", authUser);
        
        if(!authUser || get().socket?.connected)
            return;
        
        const socket = io(BASE_URL, {
            query : {userId : authUser.user._id},
        });

        // socket.on("connect", () => {
        //     console.log("Socket connected with id:", socket.id);
        // });


        socket.connect();

        set({socket})
        
        socket.on("getOnlineUsers", (userIds) => {
            console.log("Received userIds :- ",userIds);
            set({onlineUsers : userIds})
        });
    },

    disconnectFromSocket : () => {

        if(get().socket?.connected)
            get().socket.disconnect();
    }
}))