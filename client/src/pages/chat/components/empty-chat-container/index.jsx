import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
const EmptyChatContainer = () => {
    return (
        <>
            <div className="flex-1 md:bg-gray-200 md:flex flex-col justify-center items-center hidden duration-1000 transition-all ">
                <Lottie
                    isClickToPauseDisabled={true}
                    height={200}
                    width={200}
                    options={animationDefaultOptions}
                />

                <div className="text-opacity-80 text-black font-bold flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transotion-all duration-300 text-center">
                    <h3 className="poppins-medium">
                        Hi<span className="text-blue-700 font-bold">!</span> Welcome to
                        <span className="text-blue-700 m-1 poppins-large">
                            BuzzNet
                        </span>
                         Chat App
                        <span className="text-blue-700">
                            .
                        </span>
                    </h3>
                </div>
            </div>
        </>
    )
};

export default EmptyChatContainer;