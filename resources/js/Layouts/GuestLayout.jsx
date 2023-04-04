import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import Theme from "@/Theme/Theme";

export default function Guest({ children }) {
    return (
        <Theme>
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-0 guest-background ">
                <div className="w-full min-h-screen flex justify-center items-center bg-gray-700 bg-opacity-25 dark:bg-gray-900 dark:bg-opacity-75">
                    <div className="flex w-96 sm:w-1/4 min-w-fit flex-col backdrop-blur backdrop-brightness-125 backdrop-contrast-75 dark:backdrop-brightness-100 dark:backdrop-contrast-100 sm:justify-center items-center border-gray-700 border-2 rounded-lg py-8 shadow-md">
                        <div>
                            <Link href="/">
                                <ApplicationLogo className="w-full h-25 fill-current text-gray-500" />
                            </Link>
                        </div>

                        <div className="w-full sm:max-w-md mt-6 px-2 py-4 overflow-hidden sm:rounded-lg">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </Theme>
    );
}
