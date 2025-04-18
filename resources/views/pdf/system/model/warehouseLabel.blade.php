<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Label - {{$productModel->symbol}}</title>


    <style>
        @page {
            margin: 15px;
            margin-bottom: 0px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
        }

        .w-full {
            width: 100%;
        }

        .w-half {
            width: 50%;
        }

        .w-30px {
            width: 30px;
        }

        .max-w-half {
            max-width: 50%;
        }

        .w-45 {
            width: 45%;
        }

        .max-w-45 {
            max-width: 45%;
        }

        .center {
            text-align: center;
        }

        .font-bold {
            font-weight: bold;
        }

        .font-big {
            font-size: 4em;
        }

        .text-vertical {
            /*writing-mode: vertical-rl;*/
            transform: rotate(90deg);
            /*text-orientation: upright;*/
        }

        .margin-0 {
            margin: 0;
        }


    </style>

</head>
<body>
<div class="w-full">
    <p class="w-full center font-bold font-big margin-0" style="margin-top: 15px">{{$productModel->symbol}}</p>
</div>
<div class="w-full">
    <p class="w-full center font-bold" style="margin: 2px 0;">Rozmiary</p>
    <div class="center" style="white-space: nowrap; font-size: 2.9em; overflow: hidden; text-overflow: ellipsis;">
        @foreach($sizes as $size)
            <span class="font-bold" style="display: inline-block; margin: 0 5px;">{{$size->name}}</span>
        @endforeach
    </div>
</div>

<div class="w-full">
    <p class="w-full center font-bold" style="margin: 2px 0;">Kolory</p>
    <div style="text-align: center; white-space: nowrap; overflow: hidden;">
        @foreach($colors as $color)
            <div
                style="height: 290px; display: inline-block; text-align: center; vertical-align: bottom; margin: 0 5px; max-width: {{ 100 / count($colors) }}%;"
            >
                @if(isset($color->images[0]))
                    <img
                        src="{{ route('images', ['slug' =>$color->images[0]->slug]) }}"
                        width="{{550/count($colors)}}"
                        height="{{$color->images[0]->height / ($color->images[0]->width / (550 / count($colors)))}}"
                        style="
                        width: {{550/count($colors)}}px;
                        height: {{$color->images[0]->height / ($color->images[0]->width / (550 / count($colors)))}}px;
                        max-height: 180px;
                        max-width: {{ 180 * $color->images[0]->width / $color->images[0]->height }}px;
                        display: block;
                    "
                        alt="Image"
                    >
                @else
                    <img
                        src="{{ route('images', ['slug' => 'brak.jpg']) }}"
                        width="{{550/count($colors)}}"
                        height="{{960 / (640 / (550/count($colors)))}}"
                        style="
                        width: {{550/count($colors)}}px;
                        height: {{960 / (640 / (550/count($colors)))}}px;
                        max-height: 180px;
                        max-width: 120px;
                        display: block;
                    "
                        alt="Image"
                    >
                @endif
                <div style="margin: 2px auto; width: 2rem">
                    <div style="width: 2rem; height: 2rem; border-radius: 100%; border: 1px solid black;">
                        @if(isset($color->colorIcon))
                            @if($color->colorIcon->type==1)
                                <img
                                    src="{{ route('colorIcons', ['path' => $color->colorIcon->path]) }}"
                                    style="width: 2rem; height: 2rem; border-radius: 100%;"
                                    alt="colorIcon"
                                >
                            @else
                                <div
                                    style="width: 2rem; height: 2rem; border-radius: 100%; background-color: {{$color->colorIcon->hex}};">
                                </div>
                            @endif
                        @endif
                    </div>
                </div>


                <span
                    style="display: block; margin-top: 5px; font-weight: bold; font-size: 20px">{{ $color->shortcut }}</span>
            </div>
        @endforeach
    </div>
</div>
</body>
</html>
