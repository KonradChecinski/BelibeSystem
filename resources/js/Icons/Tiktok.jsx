import {Icon} from "@mui/material";

export function Tiktok(props) {
    return (
        <Icon {...props}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="TikTok"
                role="img"
                viewBox="0 0 512 512"
                width="100%"
                height="100%"
            >
                <rect rx="15%" height="100%" width="100%" fill="#00000000"/>
                <defs>
                    <path
                        id="t"
                        d="M219 200a117 117 0 1 0 101 115v-128a150 150 0 0 0 88 28v-63a88 88 0 0 1-88-88h-64v252a54 54 0 1 1-37-51z"
                        style={{mixBlendMode: "multiply"}}
                    />
                </defs>
                <use href="#t" fill="#f05" x="18" y="15"/>
                <use href="#t" fill="#0ee"/>
            </svg>
        </Icon>
    );
}
