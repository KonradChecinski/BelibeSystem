import {defineConfig} from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import i18n from "laravel-react-i18n/vite";
// import { existsSync, readFileSync } from "fs";

// let host = "system.belibe.test";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            ssr: "resources/js/ssr.jsx",
            refresh: true,
        }),
        react(),
        i18n(),
    ],
    // optimizeDeps: {
    //     exclude: ['quill', 'parchment']
    // }
    //server: detectServerConfig(host),
});
//
// function detectServerConfig(host) {
//     let keyPath = `@/.config/valet/Certificates/${host}.key`;
//     let certificatePath = `@/.config/valet/Certificates/${host}.crt`;
//
//     if (!existsSync(keyPath)) {
//         return {};
//     }
//
//     if (!existsSync(certificatePath)) {
//         return {};
//     }
//
//     return {
//         hmr: { host },
//         host,
//         https: {
//             key: readFileSync(keyPath),
//             cert: readFileSync(certificatePath),
//         },
//     };
// }
