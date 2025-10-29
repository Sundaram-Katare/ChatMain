import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ui/contact-list";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {
    const { directMessagesContacts, setDirectMessagesContacts, channels, setChannels } = useAppStore();


    useEffect(() => {
        const getContacts = async () => {
            const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
                withCredentials: true,
            });

            if(response.data.contacts) {
                setDirectMessagesContacts(response.data.contacts);
            }
        };

        const getChannels = async () => {
            const response = await apiClient.get(GET_USER_CHANNELS_ROUTES, {
                withCredentials: true,
            });

            if(response.data.channels) {
                setChannels(response.data.channels);
            }
        };
        
        getContacts();
        getChannels();
    }, []);


    return (
        <>
            <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#EBC931]/80 border-r-2 border-[#2f303b] w-">
                <div className="pt-3">
                    <Logo />
                    <div className="my-5">
                        <div className="flex items-center justify-between pr-10">
                            <Title text={"Direct Messages"} />
                            <NewDM />
                        </div>

                        <div className="max-h-[38vh] overflow-auto-y scrollbar-hidden ">
                          <ContactList contacts={directMessagesContacts} />
                        </div>
                    </div>

                    <div className="my-5">
                        <div className="flex items-center justify-between pr-10">
                            <Title text={"Channels"} />
                            <CreateChannel />
                        </div>
                        <div className="max-h-[38vh] overflow-auto-y scrollbar-hidden ">
                          <ContactList contacts={channels} isChannel={true} />
                        </div>
                    </div>
                </div>
                <ProfileInfo />
            </div>
        </>
    )
};

export default ContactsContainer;

const Logo = () => {
    return (
        <div className="flex p-5  justify-start items-center gap-2">
            <img src="https://user-gen-media-assets.s3.amazonaws.com/gemini_images/e0ff9c96-3719-4f12-a480-238e5e9876db.png" 
                className="h-10 w-10 object-cover rounded-full"
            alt="" />
            <span className="text-3xl font-bold text-black ">Buzz<span className="text-blue-700">Net</span></span>
        </div>
    );
};


const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-black pl-10 font-semibold text-opacity-90 text-sm">
            {text}
        </h6>
    )
}