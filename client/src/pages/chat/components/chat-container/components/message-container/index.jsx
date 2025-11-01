import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTES, GET_CHANNELS_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
    const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages, setIsDownloading, setFileDownloadProgress } = useAppStore();
    const scrollRef = useRef();

    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {

        const getMessages = async () => {
            try {
                const response = await apiClient.post(GET_ALL_MESSAGES_ROUTES, { id: selectedChatData._id },
                    { withCredentials: true }
                );

                if (response.data.messages) {
                    setSelectedChatMessages(response.data.messages);
                }
            } catch (error) {
                console.log({ error });
            }
        };

        const getChannelMessages = async () => {
            try {
                const res = await apiClient.get(
                    `${GET_CHANNELS_MESSAGES}/${selectedChatData._id}`,

                    { withCredentials: true }
                );
                console.log(res.data.messages);
                if (res.data.messages) {
                    setSelectedChatMessages(res.data.messages);
                }
            } catch (error) {
                console.log({ error });
            }
        };

        if (selectedChatData._id) {
            if (selectedChatType === "contact") {
                getMessages();
            } else if (selectedChatType === "channel") {
                getChannelMessages();
            }
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages]);

    const checkIfImage = (filePath) => {
        const imageRegex =
            /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath);
    }

    const renderMessages = () => {
        let lastDate = null;
        const msgs = selectedChatMessages || []; // guard against null/undefined
        return msgs.map((message, index) => {
            const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
            // attach ref to the last message so scrolling works
            const isLast = index === msgs.length - 1;
            return (
                <div key={message._id} ref={isLast ? scrollRef : null}>
                    {showDate && (
                        <div className="text-center text-black my-2">
                            {moment(message.timestamp).format("LL")}
                        </div>
                    )}
                    {selectedChatType === "contact" && renderDMMessages(message)}
                    {selectedChatType === "channel" && renderChannelMessages(message)};
                </div>
            )
        })
    };

    const downloadFile = async (url) => {
        setIsDownloading(true);
        setFileDownloadProgress(0);
        const response = await apiClient.get(`${HOST}/${url}`, {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentCompleted = Math.round((loaded * 100) / total);
                setFileDownloadProgress(percentCompleted);
            }
        });
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        setIsDownloading(false);
        setFileDownloadProgress(0);
    }

    const renderDMMessages = (message) => {
        const isFromCurrentUser = message.sender !== selectedChatData?._id;
        return (
            <div className={`${message.sender === selectedChatData?._id ? "text-left" : "text-right"}`}>
                {message.messageType === "text" && (
                    <div className={`${isFromCurrentUser ? "bg-[#EBC931] text-black border-[#EBC931]/50" :
                        "bg-black text-white/80 border-white/20"
                        } border inline-block px-4 py-1 rounded-2xl my-1 max-w-[50%] break-words`}>
                        {message.content}
                    </div>
                )}
                {
                    message.messageType === "file" &&
                    (<div className={`${isFromCurrentUser ? "bg-[#EBC931]/10 text-black border-[#EBC931]/50" :
                        "bg-[#2a2b33]/5 text-white/80 border-white/20"
                        } border inline-block p-4 rounded-lg my-1 max-w-[50%] break-words`}>

                        {/* pass the file path string to checkIfImage and render accordingly */}
                        {message.fileUrl ? (
                            checkIfImage(message.fileUrl) ? (
                                <div className="cursor-pointer"
                                    onClick={() => {
                                        setShowImage(true);
                                        setImageURL(message.fileUrl);
                                    }}
                                >
                                    <img
                                        src={`${HOST}/${message.fileUrl}`}
                                        alt=""
                                        style={{ maxWidth: 300, maxHeight: 300, objectFit: "contain" }}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-4">
                                    <span className="text-white/8  text-3xl bg-black/20 rounded-full p-3">
                                        <MdFolderZip />
                                    </span>
                                    <span>{message.fileUrl.split("/").pop()}</span>
                                    <span
                                        className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                        onClick={() => downloadFile(message.fileUrl)}
                                    >
                                        <IoMdArrowRoundDown />
                                    </span>
                                </div>
                            )
                        ) : null}
                    </div>)
                }
                <div className="text-xs text-gray-600">
                    {moment(message.timestamp).format("LT")}
                </div>
            </div>
        );
    };

    const renderChannelMessages = (message) => {
        return (
            <div
                className={`mt-5 ${(message.sender._id !== userInfo.id ? "text-left" : "text-right")
                    }`}
            >
                {message.messageType === "text" && (
                    <div
                        className={`${message.sender._id !== userInfo._id
                                ? "bg-[#EBC931] text-black border-[#EBC931]/50 "
                                : "bg-[#EBC931]/5 text-black  border-[#ffff]/20"
                            } border inline-block px-4 py-1  rounded-2xl  my-1 max-w-[50%] break-words`}
                    >
                        {message.content}
                    </div>
                )}

                {message.messageType === "file" && (
                    <div
                        className={`${message.sender._id === userInfo.id
                                ? "bg-[#EBC931]/10 text-black border-[#EBC931]/50"
                                : "bg-[#2a2b33]/5 text-white/90 border-[#ffff]/20"
                            } border inline-block p-4 rounded-lg my-1 max-w-[50%]`}
                    >
                        {checkIfImage(message.fileUrl) ? (
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    setShowImage(true);
                                    setImageUrl(message.fileUrl);
                                }}
                            >
                                <img
                                    src={`${HOST}/${message.fileUrl}`}
                                    height={300}
                                    width={300}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                                    <MdFolderZip />
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span
                                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                    onClick={() => downloadFile(message.fileUrl)}
                                >
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {
                    message.sender._id !== userInfo.id ? (
                        <div className="flex items-center justify-start gap-3">
                            <Avatar className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-500 shadow-md">
                                {message.sender.image && (
                                    <AvatarImage
                                        src={`${HOST}/${message.sender.image}`}
                                        alt="profile"
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                )}
                                <AvatarFallback
                                    className={`uppercase h-full w-full text-lg font-semibold flex items-center justify-center rounded-full ${getColor(
                                        message.sender.color
                                    )}`}
                                >
                                    {message.sender.firstName
                                        ? message.sender.firstName.split("").shift()
                                        : message.sender.email?.split("").shift()}
                                </AvatarFallback>

                            </Avatar>

                            <span className="text-sm text-white/60"> {`${message.sender.firstName} ${message.sender.lastName}`}</span>
                            <span className="text-sm text-white/60"> {moment(message.timestamp).format("LT")}</span>
                        </div>
                    ) : (
                        <div className="text-xs text-white/60 mt-1">
                            {moment(message.timestamp).format("LT")}
                        </div>
                    )}
            </div>
        );
    };



    return (
        <>
            <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
                {renderMessages()}
                <div ref={scrollRef} />

                {
                    showImage && (
                        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
                            <div>
                                <img src={`${HOST}/${imageURL}`}
                                    className="h-[80vh] w-full bg-cover "
                                    alt="" />
                            </div>

                            <div className="flex gap-5 fixed top-0 mt-5">
                                <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                >
                                    <IoMdArrowRoundDown onClick={() => downloadFile(imageURL)} />
                                </button>

                                <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                >
                                    <IoCloseSharp onClick={() => {
                                        setShowImage(false);
                                        setImageURL(null);
                                    }} />
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
};

export default MessageContainer;