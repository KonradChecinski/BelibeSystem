import React, {useEffect, useState, useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Box,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    useTheme
} from "@mui/material";
import {
    Add,
    FormatAlignCenter, FormatAlignJustify,
    FormatAlignLeft, FormatAlignRight,
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatUnderlined,
    LooksOne,
    LooksTwo
} from "@mui/icons-material";


export default function TextEditorAllegro() {
    const [value, setValue] = useState('<p><strong>sasa</strong></p><ul><li>KOnrad1</li><li>konrad2</li></ul>');


    // useEffect(() => {
    //     console.log(value)
    // }, [value])
    return (
        <Paper elevation={5} sx={{
            // bgcolor: 'blue',
            px: 3,
            py: 2,
            '& h1': {
                fontSize: 24
            },
            '& h2': {
                fontSize: 20
            },
        }}>
            <Box className="text-editor-allegro">
                <CustomToolbar/>
                <Divider sx={{borderBottomWidth: 2, my: 1, bgcolor: "text.primary"}}/>
                <ReactQuill value={value} onChange={setValue} modules={modules}
                            formats={formats} theme={false}/>
            </Box>
        </Paper>

    );
}


const CustomToolbar = () => {
    const theme = useTheme();

    return (
        <div id="toolbar-allegro">

            <select className="ql-header"
                    defaultValue={""}
                    onChange={e => e.persist()}
                    style={{
                        backgroundColor: "transparent",
                        // display: "none",
                    }}
            >
                <option value="1" style={{
                    backgroundColor: theme.palette.background.paper,
                }}>
                    Nagłówek 1
                </option>
                <option value="2" style={{
                    backgroundColor: theme.palette.background.paper,
                }}>
                    Nagłówek 2
                </option>
                <option value="" style={{
                    backgroundColor: theme.palette.background.paper,
                }}>
                    Zwykły
                </option>
            </select>
            <IconButton aria-label="bold" className="ql-bold">
                <FormatBold/>
            </IconButton>
            {/*<IconButton aria-label="italic" className="ql-italic">*/}
            {/*    <FormatItalic/>*/}
            {/*</IconButton>*/}
            {/*<IconButton aria-label="underline" className="ql-underline">*/}
            {/*    <FormatUnderlined/>*/}
            {/*</IconButton>*/}

            <IconButton aria-label="italic" className="ql-list" value="ordered">
                <FormatListNumbered/>
            </IconButton>
            <IconButton aria-label="underline" className="ql-list" value="bullet">
                <FormatListBulleted/>
            </IconButton>

            {/*<BlockButton format="heading-one" icon={<LooksOne/>}/>*/}
            {/*<BlockButton format="heading-two" icon={<LooksTwo/>}/>*/}
            {/*/!*<BlockButton format="block-quote" icon={<FormatQuote/>}/>*!/*/}
            {/*<BlockButton format="numbered-list" icon={<FormatListNumbered/>}/>*/}
            {/*<BlockButton format="bulleted-list" icon={<FormatListBulleted/>}/>*/}
            {/*<BlockButton format="left" icon={<FormatAlignLeft/>}/>*/}
            {/*<BlockButton format="center" icon={<FormatAlignCenter/>}/>*/}
            {/*<BlockButton format="right" icon={<FormatAlignRight/>}/>*/}
            {/*<BlockButton format="justify" icon={<FormatAlignJustify/>}/>*/}
        </div>
    );
}


/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
const modules = {
    toolbar: {
        container: "#toolbar-allegro",
        // handlers: {
        //     insertStar: insertStar
        // }
    },
    clipboard: {
        matchVisual: false,
    }
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color"
];
